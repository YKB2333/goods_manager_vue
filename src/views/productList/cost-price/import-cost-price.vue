<template>
  <span>
    <el-button type="primary"   @click="importData" >导入成本价</el-button>
    <el-dialog
      title="导入成本价"
      :visible.sync="dialogVisible"
      @close="close"
      close-on-press-escape
      width="30%"
      close-on-click-modal>

      <el-form label-width="100px" >
        <el-form-item label="选择文件"  >
          <el-upload 
            action="#"
            ref="upload"
            :on-remove="handleRemove"
            :httpRequest="uploadRequest"
            :multiple="false"
            :file-list="files"
            :limit="1"
            :on-exceed="onExceed"
            accept=".xls,.xlsx">
            <el-button size="small" icon="el-icon-upload2" >点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="模板下载" >
          <el-button size="small" icon="el-icon-download" @click="downLoadTemplate" >点击下载</el-button>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close" size="small" >取 消</el-button>
        <el-button type="primary" @click="onConfirm" size="small" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="导入数据校验"
      :visible.sync="dialogVisibleV"
      @close="closeV"
      close-on-press-escape
      close-on-click-modal
      width="60%"
      >

      <el-table :data="tableData" style="width: 100%" max-height="400">
        <el-table-column label="序号" type="index"  min-width="50px"></el-table-column>
        <el-table-column   label="校验信息" min-width="200px" v-if="!dataValidated">
          <template slot-scope="scope">
            <div class="color: red"  v-if="scope.row.validateMsg">第{{scope.$index+1}}行：{{scope.row.validateMsg}}</div>
          </template>
        </el-table-column>
        <el-table-column  prop="spuName" label="商品名称" min-width="200px"></el-table-column>
        <el-table-column prop="skuSn" label="规格编码" min-width="120px"></el-table-column>
        <el-table-column prop="codeBar" label="商品条码" min-width="120px"></el-table-column>
        <el-table-column prop="spuBrandName" label="品牌名称" min-width="100px"></el-table-column>
        <el-table-column prop="spuCateName" label="分类名称" min-width="80px"></el-table-column>
        <el-table-column  label="规格" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.firstAtbKey " >{{ scope.row.firstAtbKey + ':'}} {{ scope.row.firstAtbValue }}</div>
            <div v-if="scope.row.secondAtbKey" >{{ scope.row.secondAtbKey + ':'}} {{ scope.row.secondAtbValue }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="costPrice" label="成本价" min-width="100px"></el-table-column>

      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeV" size="small" >取 消</el-button>
        <el-button type="primary" @click="doImport" size="small" :disabled="!dataValidated" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import {exportSkuCostPriceTemplate} from '@/api/excel'
import {importSkuCostPriceValidate, importUpdateSkuCostPrice} from '@/api/goods'
import FileSaver from 'file-saver'
export default {
  name: 'ImportCostPrice',
  data() {
    return {
      dialogVisible: false,
      loading: false,
      file: null,
      files: [],

      dialogVisibleV: false,

      tableData: []
    }
  },
  computed: {
    dataValidated() { // 校验数据是否通过
      return  this.tableData.every(v => !v || (v.validateMsg === ''))
    }
  },
  methods: {
    importData() {
      this.dialogVisible = true;
    },
    onConfirm() { // 弹窗回调
      if (!this.file) {
        this.$message.warning("请先选择文件")
      }
      let formData = new FormData()
      formData.append("file", this.file)
      importSkuCostPriceValidate(formData)
        .then(res => {
          this.tableData = res;
          if (!Array.isArray(this.tableData) || (this.tableData.length === 0)) {
            this.$message.error('导入数据不能为空！');
            return;
          }
          this.dialogVisibleV = true
          this.close();
          if (!this.dataValidated) {
            this.$message.error('数据校验不通过，请查看错误信息！');
          }
          console.log(res);
        })
    },
    close() { // 弹窗关闭操作
      this.files = [];
      this.file = null;
      this.dialogVisible = false;
    },
    // #region 文件上传相关
    onExceed(files, fileList) {
      this.file = files[0];
      this.files = [files[0]];
    },
    uploadRequest(data) {
      // console.info(data)
      // 获取选择的文件
      this.file = data.file
    },
    handleRemove(file, fileList) {
      this.file = null
    },
    // #endregion
    
    // #region 创建校验弹窗
    closeV() {
      this.tableData = [];
      this.dialogVisibleV = false;
    },
    doImport() {
      
      this.loading = true
      let params = this.tableData.map(v => ({skuId: v.skuId, costPrice: v.costPrice}))
      importUpdateSkuCostPrice(params).then(res => {
        this.$message.success('批量导入成本价成功')
        this.$emit('afterSuccess', res)
        this.closeV();
      }).finally(() => {
        this.loading = false
      })
    },
    // #endregion

    downLoadTemplate() {
      exportSkuCostPriceTemplate()
        .then(blob => {
          let fileName = `商品成本价导入模版`
          FileSaver.saveAs(blob, fileName+'.xlsx')
        })
    }
  }
}
</script>

<style scoped lang="scss" >
</style>