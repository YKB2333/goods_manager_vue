<template>
  <div>
    <the-search @onSearch="onChange" @onReset="resetSearch">
      <el-form :model="searchQuery" ref="searchQuery" inline class="pl10">
        <el-form-item label="状态" prop="isEnable">
          <el-select v-model="searchQuery.isEnable">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="name">
          <select-brand v-model="searchQuery.name" return-val="name" />
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-input
            v-model="searchQuery.tag"
            placeholder="请输入"
            clearable
            @keyup.enter.native="onChange"
          ></el-input>
        </el-form-item>
      </el-form>
    </the-search>
    <div class="pb10">
      <el-button v-permission-button="'add'" type="primary" @click="onAdd">新增</el-button>
      <el-button v-permission-button="'export'" type="primary" @click="onExportClick">导出</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      stripe
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      @selection-change="handleSelectionChange"
      @sort-change="onSortChange"
      row-key="id"
    >
      <el-table-column type="selection" width="55" reserve-selection></el-table-column>
      <el-table-column prop="id" label="品牌ID" width="80"></el-table-column>
      <el-table-column prop="icon" label="品牌图标" width="80">
        <template slot-scope="scope">
          <div style="text-align: center;">
            <el-popover placement="top" trigger="click">
              <img
                slot="reference"
                :src="scope.row.icon || require('@/assets/images/logo.png')"
                width="60"
                height="60"
              />
              <el-image
                :src="scope.row.icon || require('@/assets/images/logo.png')"
                style="max-width: 300px; max-height: 300px;"
              ></el-image>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="品牌名称" width="180"></el-table-column>
      <el-table-column prop="simpleName" label="品牌简称" width="120"></el-table-column>
      <el-table-column prop="enName" label="品牌英文名称" width="120"></el-table-column>
      <el-table-column prop="orderLevel" label="品牌排序" width="80"></el-table-column>
      <el-table-column label="状态" width="60">
        <template slot-scope="scope ">
          <el-tag type="success" v-if="scope.row.isEnable">启用</el-tag>
          <el-tag type="danger" v-if="!scope.row.isEnable">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="是否显示" width="70">
        <template slot-scope="scope ">
          <el-tag type="success" v-if="scope.row.isShow">显示</el-tag>
          <el-tag type="danger" v-if="!scope.row.isShow">隐藏</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="附件" width="80">
        <template slot-scope="scope">
          <!-- <el-tag class="pointer" @click="showAttaList(scope.row)">{{ scope.row.attaCount}}</el-tag> -->
          <el-tag
            class="pointer"
            @click="showAttaList(scope.row)"
          >{{ showBrandAttaCounts(scope.row.id, 'count')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标签" prop="tags" min-width="100">
        <template slot-scope="scope">
          <el-tag v-for="(tag, index) in scope.row.tags" :key="index">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="品牌故事" width="200" prop="story">
        <template slot-scope="scope">
          <span class="ellipsis3" :title="scope.row.story">{{ scope.row.story }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="shops" width="120">
        <template slot="header">
          <el-tooltip effect="dark" content="客户中心-客户店铺管理，可维护店铺下的品牌" placement="top">
            <span>
              品牌在营店铺
              <i class="el-icon-info ml6"></i>
            </span>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-tag v-for="(shop, index) in scope.row.brandRelatedShops" :key="index">{{ shop.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="120" prop="remark"></el-table-column>
      <el-table-column label="品牌负责人" width="120" prop="director"></el-table-column>
      <el-table-column label="创建时间" prop="createDate" width="100" sortable="custom">
        <template slot-scope="scope">
          <div>{{ scope.row.createDate | formatDate('Y/M/D h:m') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="creatorName" width="80"></el-table-column>
      <el-table-column label="修改时间" prop="updateDate" width="100" sortable="custom">
        <template slot-scope="scope">
          <div v-if="scope.row.updateDate">{{ scope.row.updateDate | formatDate('Y/M/D h:m')}}</div>
        </template>
      </el-table-column>
      <el-table-column label="修改人" prop="editorName" width="80"></el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-permission-button="'cease'"
            type="text"
            size="small"
            style="margin-left:10px;"
            v-show="scope.row.isEnable"
            @click="onDisabled(scope.row, scope.$index)"
          >禁用</el-button>
          <el-button
            v-permission-button="'start'"
            type="text"
            size="small"
            v-show="!scope.row.isEnable"
            @click="onEnable(scope.row, scope.$index)"
          >启用</el-button>
          <el-button
            v-permission-button="'upload'"
            type="text"
            size="small"
            @click="showUploadAtta(scope.row)"
          >上传附件</el-button>
          <el-button
            v-permission-button="'edit'"
            type="text"
            size="small"
            @click="editBrand(scope.row, scope.$index)"
          >编辑</el-button>
          <el-button
            v-permission-button="'viewLog'"
            type="text"
            size="small"
            @click="showLog(scope.row)"
          >操作日志</el-button>
        </template>
      </el-table-column>
    </el-table>
    <the-pagination
      :pageIndex="searchQuery.pageIndex"
      :pageSize="searchQuery.pageSize"
      :total="searchQuery.total"
      @onPageSizeChange="handleSizeChange"
      @onPageIndexChange="handleCurrentChange"
    />
    <!-- 添加/编辑 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="900px"
      center
      :show-close="false"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="130px"
        label-position="right"
        inline
      >
        <div class="row space-between">
          <div class="col">
            <el-form-item label="品牌名称" prop="name">
              <el-input size="small" v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="品牌英文名称" prop="enName">
              <el-input v-model="form.enName" placeholder="请输入" style="width:180px;"></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="tag">
              <tags v-model="form.tags"></tags>
            </el-form-item>
            <el-form-item label="品牌在营店铺">
              <span style="color: darkgray;">请到“客户中心-客户店铺管理”页面维护店铺下的品牌</span>
            </el-form-item>
            <el-form-item label="品牌图标" prop="icon" style="display: block;">
              <upload-image
                ref="uploadImage"
                url="/uploadGoodsImages"
                tip="建议尺寸: 100*100，或正方型图片"
                v-model="form.icon"
              />
            </el-form-item>
          </div>
          <div class="col">
            <el-form-item label="品牌简称" prop="simpleName">
              <!-- <tree-select></tree-select> -->
              <el-input v-model="form.simpleName" placeholder="请输入" style="width:180px;"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="isEnable">
              <el-select v-model="form.isEnable" style="width:180px;">
                <el-option label="启用" :value="true"></el-option>
                <el-option label="禁用" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌排序" prop="orderLevel" style="min-width:120px;">
              <el-input v-model="form.orderLevel" placeholder="请输入" style="width:180px;"></el-input>
            </el-form-item>
            <el-form-item label="是否显示到企微端" prop="isShow">
              <el-select v-model="form.isShow" style="width:180px;">
                <el-option label="显示" :value="true"></el-option>
                <el-option label="隐藏" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌负责人" prop="directorMobile">
              <!-- <dept-tree-select v-model="form.directorMobile"></dept-tree-select> -->
              <dept-person-select v-model="form.directorMobile"></dept-person-select>
            </el-form-item>
          </div>
        </div>

        <el-form-item label="品牌故事" prop="story" style="display: block;">
          <el-input type="textarea" v-model="form.story" placeholder="请输入" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="display: block;" size="small">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入" style="width: 500px;"></el-input>
        </el-form-item>
        <div class="row center">
          <el-button @click="resetForm('form')">关闭</el-button>
          <el-button
            class="ml40"
            type="primary"
            :loading="saveBtnLoading"
            @click="submitForm('form')"
          >保存</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 附件列表弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="docDialog.dialogVisible"
      @close="whenDocDialogClose"
    >
      <div v-show="docDialog.dialogType === 'attaList'">
        <el-table :data="docDialog.attachmenList">
          <el-table-column label="附件">
            <template slot-scope="scope">
              <span class="mr10">{{ scope.row.fileName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="大小" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.size | formatFileSize }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否受保护" width="120">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.isProtect">是</el-tag>
              <el-tag type="danger" v-else>否</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <div style="display: flex;">
                <el-button
                  v-permission-button="'deleteAtta'"
                  type="danger"
                  @click="deleteAtta(scope.row, scope.$index)"
                >删除</el-button>
                <download
                  v-permission-button="'downloadAtta'"
                  :attaId="scope.row.id"
                  :fileName="scope.row.fileName"
                ></download>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="docDialog.dialogType === 'uploadAtta'">
        <el-upload
          ref="upload"
          class="inline-block"
          :action="`${$config.baseURL}/uploadAttaImages`"
          :on-success="(response, file) => onSuccessUpload(response, file)"
          :on-remove="(file) => onRemoveUpload(file)"
          :multiple="false"
          :httpRequest="uploadRequest"
          :disabled="docDialog.uploadLoading"
        >
          <el-button size="small" type="primary" v-show="showUploadBtn">选择文件上传</el-button>
        </el-upload>
        <div class="ml40 inline-block" :class="!showUploadBtn ? 'relative bottom8' : ''">
          <span>是否受保护</span>
          <el-switch v-model="uploadAttaForm.isProtect"></el-switch>
        </div>
        <div v-show="docDialog.uploadLoading">
          <el-button type="text" :loading="docDialog.uploadLoading">上传中</el-button>
        </div>
        <div class="mt30">
          <el-button type="success" @click="addAtta" :disabled="docDialog.uploadLoading">添加附件</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TheSearch from '@/components/TheSearch'
import ThePagination from '@/components/ThePagination'
import UploadImage from '@/components/UploadImage'
import FileSaver from 'file-saver'
import Download from '@/components/download'
import { getAttachmentList, deleteAtta } from '@/api/attachment'
import Tags from '@/components/Tags'
import {
  getBrandList,
  getBrandAttaCount,
  disabledBrand,
  enableBrand,
  updateBrand,
  addBrand,
  exportBrandList,
} from '@/api/brand'
import SelectBrand from '@/components/SelectBrand'
import { formatDate } from '@/utils'
import DeptPersonSelect from './dept-person-select.vue'
import TreeSelect from '@/components/TreeSelect.vue'
import DeptTreeSelect from './dept-tree-select.vue'

export default {
  name: 'Brand',
  components: {
    TheSearch,
    ThePagination,
    UploadImage,
    Download,
    Tags,
    SelectBrand,
    DeptPersonSelect,
    TreeSelect,
    DeptTreeSelect,
  },
  data() {
    return {
      allBrandList: [],
      tableLoading: false,
      searchQuery: {
        name: '',
        isEnable: null,
        tag: '',
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [], // 表格数据
      brandList: [],
      brandAttaCounts: [],
      docDialog: {
        dialogVisible: false,
        dialogType: '',
        attachmenList: [],
        uploadLoading: false,
      },
      uploadAttaForm: {
        attaUrl: '',
        fileName: '',
        fileType: '',
        isProtect: false,
        size: 0,
        brandId: null,
      },
      dialogVisible: false,
      dialogType: 'add', // 弹窗类型：新增add、编辑edit
      form: {
        name: '',
        icon: '',
        simpleName: '',
        isEnable: true,
        orderLevel: 0,
        remark: '',
        story: '',
        tags: [],
        enName: '',
        directorMobile: '',
        isShow: true,
      },
      rules: {
        name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
        // directorMobile: [
        //   { validator: validatePass, trigger: 'change' }
        // ]
      },
      currentEditItem: null, // 当前编辑项数据
      currentEditIndex: 0,
      saveBtnLoading: false, // 保存按钮的loading状态
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      multipleSelection: [],
    }
  },
  created() {
    this.fetchTableData()
  },
  computed: {
    dialogTitle() {
      if (this.dialogType === 'add') {
        return '添加品牌'
      } else if (this.dialogType === 'edit') {
        return '编辑品牌'
      }
      if (this.docDialog.dialogType === 'attaList') {
        return '查看附件列表'
      } else if (this.docDialog.dialogType === 'uploadAtta') {
        return '上传附件'
      }
    },
    showUploadBtn() {
      return this.uploadAttaForm['attaUrl'] == ''
    },
  },
  methods: {
    onChange() {
      this.fetchTableData()
    },
    // 加载表格数据
    async fetchTableData() {
      try {
        this.tableLoading = true
        let res = await this.fetchBrandList()
        this.searchQuery['total'] = res.count
        console.log('获取品牌列表', res.list)
        let brandList = res.list // 品牌数据
        this.tableData = brandList
        let brandIds = brandList.map((item) => item.id)
        this.fetchBrandAttaCounts(brandIds)
      } catch (error) {
        console.log('catch', error)
      } finally {
        this.tableLoading = false
      }
    },
    fetchAllBrandList() {
      return new Promise((resolve, reject) => {
        let params = {
          name: this.searchQuery.name,
          isEnable: this.searchQuery.isEnable,
          tag: this.searchQuery.tag,
          pageIndex: 1,
          pageSize: this.$maxNumber,
          total: 0,
        }
        getBrandList(params)
          .then((res) => {
            resolve(res.list)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取品牌列表
    fetchBrandList() {
      return new Promise((resolve, reject) => {
        getBrandList(this.searchQuery)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 根据品牌id数组获取附件数量
    fetchBrandAttaCounts(brandIds) {
      getBrandAttaCount(brandIds)
        .then((res) => {
          console.log('品牌附件数量', res)
          this.brandAttaCounts = res
        })
        .catch((error) => {
          console.log(error)
        })
    },
    showBrandAttaCounts(brandId, key) {
      let result = 0
      this.brandAttaCounts.every((item) => {
        if (item.brandId === brandId) {
          result = item[key]
          return false
        } else {
          return true
        }
      })
      // console.log('附件数量', result)
      return result
    },
    handleSizeChange(val) {
      // 每页条数改变时
      this.searchQuery['pageSize'] = val
      this.searchQuery['pageIndex'] = 1
      this.onChange()
    },
    handleCurrentChange(val) {
      // 页码改变时
      this.searchQuery['pageIndex'] = val
      this.onChange()
    },
    // 禁用
    onDisabled(row, index) {
      this.$confirm(row.name, `确定禁用？`, {
        confirmButtonText: `禁用`,
        // center: true
      })
        .then(() => {
          disabledBrand({
            id: row.id,
          }).then((res) => {
            this.$message.success('已禁用')
            row.isEnable = !row.isEnable
          })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    // 启用
    onEnable(row, index) {
      this.$confirm(row.name, `确定启用？`, {
        confirmButtonText: `启用`,
        // center: true
      })
        .then(() => {
          enableBrand({
            id: row.id,
          }).then((res) => {
            this.$message.success('已启用')
            row.isEnable = !row.isEnable
          })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    editBrand(item, index) {
      // 编辑品牌
      // console.log(item)
      this.dynamicTags = item.tags
      this.currentEditItem = item
      this.currentEditIndex = index
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.form = _.cloneDeep(item)
      })
    },
    // 导出Excel
    async onExportClick() {
      // console.log(this.searchQuery, 'searchQuery')
      console.log(this.searchQuery, 'searchQuery')
      if (this.tableData.length === 0) {
        this.$message.warning('没有选中数据')
        return
      }
      let params = {
        tag: this.searchQuery.tag,
        isEnable: this.searchQuery.isEnable,
        ids: this.multipleSelection.map((e) => e.id),
      }
      this.$store.commit('SHOW_LOADING')
      exportBrandList(params)
        .then((res) => {
          // console.log('res', res)
          let fileName = `品牌列表${formatDate(new Date().getTime(), 'Y-M-D')}`
          FileSaver.saveAs(res, fileName + '.xlsx')
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    },
    resetSearch() {
      this.$refs['searchQuery'].resetFields()
      this.searchQuery['pageIndex'] = 1
      this.onChange()
    },
    // 以下三个是添加标签的方法
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
      this.form.tags = this.dynamicTags
    },
    // 保存提交
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.saveBtnLoading = true
          if (this.dialogType === 'add') {
            // 添加
            let params = _.cloneDeep(this.form)
            addBrand(params)
              .then((res) => {
                // console.log(res)
                this.$message.success('添加成功')
                this.resetForm('form')
                this.fetchTableData()
              })
              .finally(() => {
                this.saveBtnLoading = false
              })
          } else if (this.dialogType === 'edit') {
            // 编辑
            let params = _.cloneDeep(this.form)
            params.id = this.currentEditItem.id
            this.saveBtnLoading = true
            updateBrand(params)
              .then((res) => {
                this.$set(this.tableData, this.currentEditIndex, params)
                this.$message.success('修改成功')
                this.resetForm('form')
              })
              .finally(() => {
                this.saveBtnLoading = false
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName = 'form') {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    showUploadAtta(row) {
      this.docDialog.dialogType = 'uploadAtta'
      this.docDialog.dialogVisible = true
      this.uploadAttaForm['brandId'] = row.id
    },
    // 附件弹窗关闭
    whenDocDialogClose() {
      this.clearAttaForm()
    },
    // 删除附件
    deleteAtta(row, index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$delete(`/attachment/delAttachment/${row.id}`).then((res) => {
            this.$message.success('删除成功')
            this.docDialog.attachmenList.splice(index, 1)
            this.fetchTableData()
          })
        })
        .catch(() => {})
    },
    onSuccessUpload(res, file) {
      this.uploadAttaForm['attaUrl'] = res
      this.uploadAttaForm['fileName'] = file.name
      this.uploadAttaForm['size'] = file.size
      let type = file.name.substring(file.name.lastIndexOf('.') + 1)
      this.uploadAttaForm['fileType'] = type
    },
    onRemoveUpload(file) {
      this.clearAttaForm()
    },
    uploadRequest(data) {
      console.info('自定义上传')
      const _file = data.file
      var formData = new FormData()
      formData.append('file', _file)
      return new Promise((resolve, reject) => {
        this.docDialog.uploadLoading = true
        this.$post(data.action, formData)
          .then((res) => {
            this.docDialog.uploadLoading = false
            resolve(res)
          })
          .catch((err) => {
            reject()
          })
      })
    },
    // 添加附件
    addAtta() {
      console.log('添加附件', this.uploadAttaForm)
      this.$confirm('确定添加？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          this.$post(`/attachment/addAttachment`, this.uploadAttaForm).then(
            (res) => {
              this.$message.success('添加成功')
              this.clearAttaForm()
              // this.docDialog.dialogVisible = false;
              this.fetchTableData()
            }
          )
        })
        .catch(() => {})
    },
    // 清除添加附件参数
    clearAttaForm() {
      this.uploadAttaForm['fileName'] = ''
      this.uploadAttaForm['fileType'] = ''
      this.uploadAttaForm['size'] = ''
      this.uploadAttaForm['attaUrl'] = ''
      this.uploadAttaForm['isProtect'] = false
      // this.uploadAttaForm["brandId"] = null
      this.$refs['upload'].clearFiles()
    },
    // 显示附件列表
    showAttaList(row) {
      // console.log(row);
      if (this.showBrandAttaCounts(row.id, 'count') > 0) {
        this.docDialog.dialogType = 'attaList'
        this.docDialog.dialogVisible = true
        this.$get(`/attachment/getByBrandId/${row.id}`).then((res) => {
          this.docDialog.attachmenList = res
        })
      }
    },
    showLog(row) {
      let view = this.$instantCompt(require('@/views/log/index.vue').default, {
        logType: '2',
        relationKey: row.id,
      })
      view.init()
    },
    onAdd() {
      this.dialogType = 'add'
      this.dialogVisible = true
      this.form.tags = []
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onSortChange({ column, prop, order }) {
      console.info('触发排序', column, prop, order)
      if (order) {
        let isAsc = order === 'ascending' ? 'asc' : 'desc'
        this.searchQuery.orderStr = prop + ' ' + isAsc
      } else {
        this.searchQuery.orderStr = null
      }
      this.onChange()
    },
  },
}
</script>
<style lang="scss" scoped>
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>