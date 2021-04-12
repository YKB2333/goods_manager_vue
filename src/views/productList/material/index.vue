<template>
  <the-dialog width="80%" :closeOnClickModal="false" ref="dialog" :title="uploadContainerTitle">
    <div v-if="!showUploadContainer">
      <div class="mb10">
        <el-button size="mini" type="success" @click="onAddMaterial">添加</el-button>
      </div>
      <el-table :data="tableData" v-loading="tableLoading" border stripe size="mini">
        <el-table-column label="素材ID" prop="id" width="60"></el-table-column>
        <el-table-column label="素材文案" prop="title"></el-table-column>
        <el-table-column label="类型" prop="type" width="60">
          <template slot-scope="scope">
            <span v-if="scope.row.type === '0'">图片</span>
            <span v-if="scope.row.type === '1'">视频</span>
          </template>
        </el-table-column>
        <el-table-column label="附件" prop="materialAttaList">
          <template slot-scope="scope">
            <div v-if="scope.row.type === '0'">
              <el-image v-for="(file, index) in scope.row.materialAttaList" :key="index"
                style="max-width: 60px; max-height: 60px; margin-right:10px;"
                :src="file.attaUrl"
                :preview-src-list="previewScrList(scope.row.materialAttaList)">
              </el-image>
            </div>
            <!-- 视频 -->
            <div v-if="scope.row.type === '1'">
              <el-link v-if="scope.row.materialAttaList.length" :href="scope.row.materialAttaList[0].attaUrl" target="_blank" type="primary">{{ scope.row.materialAttaList[0].fileName }}</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createDate" width="90">
          <template slot-scope="scope">
            <span>{{  scope.row.createDate | formatDate('Y/M/D h:m') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="onDeleteMaterial(scope.row, scope.$index)">删除</el-button>
            <el-button type="text" @click="onUpdateMaterial(scope.row, scope.$index)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="showUploadContainer">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="推广文案" prop="materialTitle">
          <el-input v-model="form.materialTitle" type="textarea" placeholder="输入推广文案" :rows="3" resize="none" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="素材类型">
          <el-radio v-model="fileType" label="0" :disabled="fileType === '1' && fileList.length > 0">{{ `图片(最多9张)` }}</el-radio>
          <el-radio v-model="fileType" label="1" :disabled="fileType === '0' && fileList.length > 0">{{ `视频(最多1个)` }}</el-radio>
        </el-form-item>
      </el-form>
      <upload-file 
        v-model="fileList"
        action="/uploadGoodsSc"
        :multiple="multiple"
        :limit="limit"
        :size="size"
        :fileType="fileType"
      />
      <div class="mt30">
        <el-button size="small" type="primary" @click="onSave" :loading="saveLoading">保存</el-button>
        <el-button size="small" type="primary" plain @click="returnTableList">返回</el-button>
      </div>
    </div>
  </the-dialog>
</template>

<script>
import TheDialog from '@/components/TheDialog'
import UploadFile from './UploadFile'
import { getMaterialList, addMaterial, updateMaterial, deleteMaterial } from '@/api/material'

export default {
  name: 'Material',
  components: { TheDialog, UploadFile },
  data() {
    return {
      spuId: null,
      form: {
        materialTitle: '', // 推广文案
      },
      rules: {
        materialTitle: [
          { required: true, message: '请输入推广文案', trigger: 'blur' },
        ]
      },
      fileType: '0', // 附件类型0图片，1视频
      limit: 9, // 附件数量：图片9，视频1
      size: 4, // 附件大小：图片4M，视频20M
      fileList: [],
      multiple: true,
      saveLoading: false,
      tableData: [],
      tableLoading: false,
      uploadContainerType: '',
      updateMaterialId: null,
      showUploadContainer: false
    }
  },
  computed: {
    uploadContainerTitle() {
      if (this.uploadContainerType === 'add') {
        return '添加素材'
      } else if (this.uploadContainerType === 'edit') {
        return '修改素材'
      } else {
        return '素材列表'
      }
    }
  },
  created() {
  },
  methods: {
    init(spuId) {
      this.$refs['dialog'].show()
      this.spuId = spuId
      this.fetchTableData()
    },
    fetchTableData() {
      this.tableLoading = true
      getMaterialList(this.spuId).then(res => {
        console.log('列表', res)
        this.tableData = res
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 保存
    onSave() {
      console.log('文件列表', this.fileList)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.uploadContainerType === 'add') {
            this.$confirm('确定添加？').then(() => {
              let attaList = []
              this.fileList.forEach(file => {
                attaList.push({
                  attaUrl: file.url,
                  fileName: file.fileName,
                  fileType: file.fileType,
                  size: file.size,
                  snapshot:file.snapshot
                })
              })
              this.saveLoading = true
              addMaterial({
                attaList: attaList,
                type: this.fileType,
                spuId: this.spuId,
                title: this.form.materialTitle
              }).then(res => {
                this.$message.success('添加成功')
                this.$refs['form'].resetFields()
                this.fileList = []
                this.fetchTableData()
                this.showUploadContainer = false
              }).finally(() => {
                this.saveLoading = false
              })
            }).catch(() => {
              console.log('取消')
            })
          }
          if (this.uploadContainerType === 'edit') {
            this.$confirm('确定修改？').then(() => {
              let attaList = []
              this.fileList.forEach(file => {
                attaList.push({
                  attaUrl: file.url || file.attaUrl,
                  fileName: file.fileName,
                  fileType: file.fileType,
                  size: file.size,
                  snapshot:file.snapshot
                })
              })
              this.saveLoading = true
              updateMaterial({
                id: this.updateMaterialId,
                attaList: attaList,
                type: this.fileType,
                spuId: this.spuId,
                title: this.form.materialTitle
              }).then(res => {
                this.$message.success('修改成功')
                this.$refs['form'].resetFields()
                this.fileList = []
                this.fetchTableData()
                this.showUploadContainer = false
              }).finally(() => {
                this.saveLoading = false
              })
            }).catch(() => {
              console.log('取消')
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除操作
    onDeleteMaterial(item, index) {
      this.$confirm('确定删除？').then(res => {
        deleteMaterial(item.id).then(res => {
          this.tableData.splice(index, 1)
          this.$message.success('删除成功')
        })
      }).catch(error => {
      })
    },
    onAddMaterial() {
      this.uploadContainerType = 'add'
      this.showUploadContainer = true
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        this.fileList = []
      })
    },
    // 
    onUpdateMaterial(item, index) {
      this.uploadContainerType = 'edit'
      this.showUploadContainer = true
      console.log(item)
      let data = _.cloneDeep(item)
      this.$nextTick(() => {
        this.form['materialTitle'] = data.title
        this.fileList = data.materialAttaList
        this.fileType = data.type
        this.updateMaterialId = data.id
      })
    },
    previewScrList(list) {
      let arr = list.map(item => item.attaUrl)
      return arr
    },
    returnTableList() {
      this.showUploadContainer = false
      this.fileList = []
      this.fileType = '0'
      this.$refs['form'].resetFields()
    }
  },
  watch: {
    fileType: {
      handler: function(val) {
        if (val === '0') {
          this.multiple = true
          this.limit = 9
          this.size = 4
        } else if (val === '1') {
          this.multiple = false
          this.limit = 1
          this.size = 20
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
