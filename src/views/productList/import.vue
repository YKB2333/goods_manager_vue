<template>
  <div>
    <div class="col">
      <el-button-group class="pb14">
        <!-- <el-button type="danger" size="small" :loading="batchDeleteLoading" @click="onBatchDelete">移除</el-button> -->
        <el-button v-permission-button="'download'" type="primary" size="small" @click="exportSpu">下载模版</el-button>
        <el-button v-permission-button="'import'" type="warning" size="small" @click="importDialogVisible = true">导入</el-button>
        <el-button v-permission-button="'save'" type="danger" size="small" @click="dialogVisible = true" :disabled="tableData.length > 0 ? false:true">批量保存</el-button>
      </el-button-group>
    </div>
    <el-checkbox-group v-model="checkTheads" class="mb10">
      <el-checkbox v-for="item in formThead" :key="item.prop" :label="item.prop">{{ item.label }}</el-checkbox>
    </el-checkbox-group>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%;"
      border
      stripe
      size="mini"
      :default-sort = "{prop: 'status', order: 'descending'}"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="导前状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.id > 0 ? '': 'danger'" effect="plain">{{ scope.row.id > 0 ? '修改' : '新增' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="导后状态" prop="status" width="100" sortable>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==='0'" effect="plain">{{ '已新增' }}</el-tag>
          <el-tag v-if="scope.row.status==='1'" effect="plain">{{' 已更新' }}</el-tag>
          <el-tag v-if="scope.row.status==='2'" type='danger' effect="plain">{{ '提交失败' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" sortable="true" width="80" />
      <el-table-column v-if="checkTheads.includes('cateName')" label="分类" prop="cateName" width="120" />
      <el-table-column label="商品信息" style="min-width: 300px;" min-width="300">
        <template slot-scope="scope">
          <div class="row center-y">
            <!-- <el-popover placement="top" trigger="click">
              <img slot="reference" :src="scope.row.titleImage || require('@/assets/images/logo.png')" style="max-width: 100px; max-height: 100px;">
              <el-image :src="scope.row.titleImage || require('@/assets/images/logo.png')" style="max-width: 600px; max-height: 600px;"></el-image>
            </el-popover>
            <div class="pl10">
              <span>商品名称：{{ scope.row.name }}</span>
            </div> -->
            <div class="pl10">
              <span>{{ scope.row.name }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="checkTheads.includes('brandName')" label="品牌" prop="brandName" width="110" />
      <el-table-column v-if="checkTheads.includes('tag')" label="标签" prop="tags" min-width="80">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.tags" :key="item.id" type="warning">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkTheads.includes('brandCategory')" label="商品服务类型" prop="brandCategory" width="100">
        <template slot-scope="scope">
          <template v-for="item in brandCategoryOptions">
            <el-tag v-if="scope.row.brandCategory === item.value" :key="item.value" type="success">{{ item.label }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="checkTheads.includes('workStatus')" label="是否清货" prop="workStatus" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.workStatus && scope.row.workStatus.includes('清货')" type="danger" size="mini">清货</el-tag>
          <el-tag v-else type="danger" size="mini">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkTheads.includes('createDate')" label="导入时间" prop="createDate" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.createDate">{{ scope.row.createDate | formatDate('Y/M/D h:m') }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="checkTheads.includes('updateDate')" label="更新时间" prop="updateDate" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.updateDate">{{ scope.row.updateDate | formatDate('Y/M/D h:m') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="preview(scope.row, scope.$index)">查看</el-button> -->
          <el-button v-permission-button="'edit'"  type="text" size="small" @click="edit(scope.row, scope.$index)">编辑</el-button>
          <el-button v-permission-button="'delete'"  type="text" size="small" @click="del(scope.row, scope.$index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>确定要进行提交操作？提交后将更新{{tableData.length}}条商品信息，<span style="color:red;">请一定仔细检查数据是否有误</span></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onBatchUpdateSpus" :loading="loading" > {{ loading ? '上传中' : '开始导入' }}</el-button>
        <el-button v-permission-button="'superSave'" type="danger" @click="onBatchUpdateSpus4Admin" :loading="loading" > {{ loading ? '上传中' : '开始超级导入' }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入声明"
      :visible.sync="importDialogVisible"
      width="30%"
    >
      <p style="color:red;">导入的商品信息必须是“文本”格式，特别注意商品ID，编码，条码等以数字串存在的字段，系统无法识别excel的格式，若在编辑excel时失准（变成科学计数展示），导致导入系统的信息发生错乱</p>
      <p style="color:red;">成功录入商品中心的商品，系统自动生成“商品ID” ，也是在商品中心的唯一识别码；若是批量导入新商品，“商品ID”列不填，导入成功后，系统会给这些新商品生成商品ID</p>
      <p style="color:red;">批量修改系统旧商品信息，需要准确填写该商品的商品ID，系统才能找到需要修改的商品，将需要修改的信息更新</p>
      <p style="color:red;">为提升操作效率，导入的商品信息，可批量设置提交，请在确认无误后，再提交；新增的商品提交后，需要手动上架；修改上架中的商品，会直接更改信息，请谨慎操作</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="importSpu" :loading="loading" >确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入结果"
      :visible.sync="dialogResult"
      width="30%"
    >
      <span>已批量更新{{importResult.updateNum}}条商品信息，新增{{importResult.addNum}}条商品信息提交失败{{importResult.faultNum}}条商品信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogResult = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TheSearch from '@/components/TheSearch'
import ThePagination from '@/components/ThePagination'
import { translateDataToTree, formatDate } from '@/utils'
import { baseURL, headersTokenKey } from '@/config'
import { brandCategory } from '@/const/goods'
import Download from '@/components/download'
import { getAttachmentList, deleteAtta } from '@/api/attachment'
import { getBrandList } from '@/api/brand'
import { getCategoryList } from '@/api/category'
import SelectBrand from '@/components/SelectBrand'
import SelectCategory from '@/components/SelectCategory'
import FileSaver from 'file-saver'
import { importSpu, batchUpdateSpus, batchUpdateSpus4Admin, exportSpu as exportSpuHttp } from '@/api/excel'

export default {
  name: 'Import',
  title: '批量导入',
  components: { TheSearch, ThePagination, Download, SelectBrand, SelectCategory },
  data() {
    return {
      brandCategoryOptions: brandCategory.properties,
      tableData: [], // 表格数据
      isLoadingCateList: false, // 分类下拉框加载状态
      isLoadingBrandList: false, // 品牌下拉框加载状态
      selectionList: [], // 选中的行数据
      batchSaleLoading: false,
      batchDeleteLoading: false,
      cascaderOptions: [],
      cateCodes: [],
      dialogType: 'attaList',
      dialogVisible: false,
      importDialogVisible: false,
      attachmenList: [],
      baseURL: baseURL,
      uploadLoading: false,
      // 回收站
      batchResumeLoading: false,
      //
      productFlag: '', // 入口标识，判断显示什么值
      checkTheads: [],
      cacheData: [],
      formThead: [
        { label: '分类', prop: 'cateName', default: true },
        { label: '品牌', prop: 'brandName', default: true },
        { label: '附件', prop: 'attachment', default: true },
        { label: '标签', prop: 'tag', default: true },
        { label: '商品服务类型', prop: 'brandCategory', default: false },
        { label: '清货', prop: 'workStatus', default: false },
        { label: '导入时间', prop: 'createDate', default: true },
        { label: '更新时间', prop: 'updateDate', default: false }
      ],
      dialogResult:false,
      importResult:{
        updateNum:'',
        addNum:'',
        faultNum:'',
        faultList:[],
        list:[]//导入后改变状态的数据
      },
      loading: false,
      searchQuery: {
        inIds: [0],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        name: '',
        skuSn: '',
        codeBar: '',
        cateCode: '',
        brandCategory: [],
        orderStr: 'updateDate desc',
        isDelete: true,
        isOnSale: false,
        brandId: [],
        tag:'',
        checkedStatus: '',
      },
    }
  },
  computed: {
    selectionIds() {
      const ids = this.selectionList.map(item => item.sid)
      return ids
    },
    dialogTitle() {
      if (this.dialogType === 'attaList') {
        return '查看附件列表'
      }
      if (this.dialogType === 'uploadAtta') {
        return '上传附件'
      }
    },
    uploadHeaders() {
      const headers = {}
      headers[headersTokenKey] = this.$store.getters.token
      return headers
    },
    showUploadBtn() {
      return this.uploadAttaForm['attaUrl'] == ''
    },
    isImage() {
      return function(type) {
        const arr = ['image', 'jpg', 'png', 'jpeg']
        return arr.indexOf(type) != -1
      }
    }
  },
  created() {
    this.fetchSpuList()
    this.checkTheads = this.formThead.map(item => item.default && item.prop)
    this.cacheData = JSON.parse(localStorage.getItem('importSpuData'))
    const data = []
    for ( var i in this.cacheData) {
      data.push(this.cacheData[i])
    }
    this.cacheData = data;
  },
  methods: {
    onBatchUpdateSpus4Admin() {
      this.$confirm("本次导入直接更新主表并推送NC，确认导入？", {
        type: "warning",
        center: true
      }).then(() => {
        this.http(batchUpdateSpus4Admin)
      })
    },
    onBatchUpdateSpus() {
      let spuData = JSON.parse(localStorage.getItem('importSpuData'))
      console.info(spuData)
      let isNeedOAApproval = false
      for(let key in spuData){
        if(spuData[key].isNeedOAApproval){
          isNeedOAApproval = true
          break
        }
      }

      if(isNeedOAApproval){
        this.$confirm("信息变更如涉及名称、分类、品牌，需要提交OA审批后生效，确认更新吗？",
            {
              type: "warning",
            }
          ).then(() => {
            this.http(batchUpdateSpus)
          });
      }else{
        this.http(batchUpdateSpus)
      }
    },
    http(api) {
      this.cacheData = JSON.parse(localStorage.getItem('importSpuData'))
      const data = []
      for ( var i in this.cacheData) {
        data.push(this.cacheData[i])
      }
      this.loading = true
      api(data).then(
        res => {
          this.importResult = res
          this.$message.success('操作成功')

          const data = {}
          for (const i in res.list) {
            data[res.list[i].sid] = res.list[i]
          }
          localStorage.setItem('importSpuData', JSON.stringify(data))
          this.tableData = res.list
          this.fetchSpuList()
          this.dialogVisible = false
          this.dialogResult = true
        }).catch(() => {
          this.$message.error('失败')
        }).finally(() => {
          this.loading = false
        })
    },
    // 批量删除
    onBatchDelete() {
      if (!this.selectionIds.length) {
        this.$message.warning('未选中数据！')
        return
      }
      // 弹窗确认
      this.$confirm('确定移除吗？', {
        type: 'warning'
      }).then(() => {
        this.removeSpuBySid(this.selectionIds)
      }).catch(() => {
      })
    },
    del(row, index) {
      // 弹窗确认
      this.$confirm('确定移除吗？', {
        type: 'warning'
      }).then(() => {
        this.removeSpuBySid([row.sid])
      }).catch(() => {
      })
    },
    removeSpuBySid(sids) {
      var _arr = JSON.parse(localStorage.getItem('importSpuData'))
      for (const item in sids) {
        const delId = sids[item]
        console.info('移除', delId)
        delete _arr[delId]
      }
      console.info('_arr', _arr)
      this.batchDeleteLoading = true
      localStorage.setItem('importSpuData', JSON.stringify(_arr))
      this.$message.success('操作成功')
      this.fetchSpuList()
      this.batchDeleteLoading = false
    },
    async fetchSpuList() {
      try {
        this.$store.commit('SHOW_LOADING')
        // console.log(JSON.parse(localStorage.getItem("importSpuData")))
        this.tableData = JSON.parse(localStorage.getItem('importSpuData'))
        this.tableData = Object.keys(this.tableData).filter(item => this.tableData[item]).map(item => {
          const obj = this.tableData[item]
          // console.info("1", item)
          const workStatus = []
          if (obj.skus) {
            obj.skus.forEach(sku => {
              workStatus.push(sku.workStatus)
            })
            obj['workStatus'] = workStatus
          }
          return obj
        })
      } catch (error) {
        console.log('catch', error)
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },
    handleSelectionChange(selection) {
      this.selectionList = selection
    },
    // 预览
    preview(data, index) {
      const previewPage = this.$instantCompt(require('./maintaining/Preview').default, {
        dialogWidth: '80%'
      })
      previewPage.init(data.id)
    },
    edit(data, index) {
      this.$router.push({
        name: 'importProductMaintainingEdit',
        query: {
          sid: data.sid
        }
      })
    },

    // 弹窗关闭
    whenClose() {
      /* this.clearAttaForm()*/
      this.$refs['upload'].clearFiles()
    },

    // 导入Excel
    importSpu() {
      this.importDialogVisible = false
      const view = this.$instantCompt(require('./import-spu/index.vue').default)
      view.show()
      // 监听导入成功事件
      this.$bus.on('importSpuSuccess', (res) => {
        // 导入成功后刷新列表
        const data = {}
        for (const i in res) {
          data[res[i].sid] = res[i]
        }
        localStorage.setItem('importSpuData', JSON.stringify(data))
        this.tableData = res
        this.fetchSpuList()
        // 隐藏弹窗
        view.hide()
      })
    },
    // 下载模版
    exportSpu(){
      this.$store.commit('SHOW_LOADING')
      let params = _.cloneDeep(this.searchQuery)
      exportSpuHttp(params)
      .then(blob => {
        // console.log("进去了")
        // console.info(blob)
        let fileName = `导入模版`
        FileSaver.saveAs(blob, fileName+'.xlsx')
      })
      .finally(()=>{
        this.$store.commit('SHOW_LOADING', false)
      })
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
