<template>
  <div class="category-page">
    <el-input class="mb20 w400 block" placeholder="输入关键字进行搜索" v-model="cateSearchVal"></el-input>
    <el-button-group class="mb20">
      <el-button
        type="info"
        size="small"
        :icon="expandAll ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        @click="expandAllClick"
      >{{ expandAll ? '折叠所有' : '展开所有' }}</el-button>
      <el-button
        v-permission-button="'add'"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="onAddCateClick"
      >添加新分类</el-button>
      <!-- <el-button type="success" size="small" icon="el-icon-document-copy" @click="onExportClick">导出Excel</el-button> -->
      <el-button
        v-permission-button="'export'"
        icon="el-icon-document-copy"
        type="success"
        size="small"
        @click="exportCategory"
      >导出Excel</el-button>
    </el-button-group>
    <el-tree
      ref="treeX"
      v-loading="treeLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      style="width: 800px; min-height: 240px;"
      :data="treeData"
      node-key="id"
      :default-expand-all="expandAll"
      :expand-on-click-node="true"
      :filter-node-method="filterNode"
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <div>
          <img
            :src="data.icon || require('@/assets/images/logo.png')"
            class="w-h40 vertical-middle mr6"
          />
          <span>{{ data.name }}</span>
        </div>
        <div>
          <el-button
            v-permission-button="'show'"
            type="text"
            size="mini"
            :loading="loadingBtnId === data.id"
            @click.stop="showHideCate(data)"
          >{{ data.isShow ? '隐藏它' : '显示它' }}</el-button>
          <el-button
            v-permission-button="'addChild'"
            v-if="data.cateLevel !== '3'"
            type="text"
            size="mini"
            @click.stop="addSubCate(data)"
          >添加子分类</el-button>
          <el-button
            v-permission-button="'edit'"
            type="text"
            size="mini"
            @click.stop="updateCate(data)"
          >修改</el-button>
          <el-button
            v-permission-button="'delete'"
            type="text"
            size="mini"
            @click.stop="deleteCate(data, node)"
          >删除</el-button>
        </div>
      </div>
    </el-tree>
    <!-- 添加/编辑 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      width="600px"
      @close="resetForm()"
    >
      <el-form ref="form" :model="form" :rules="formRules" label-width="100px" size="mini" inline>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="分类排序" prop="orderLevel">
          <el-input v-model="form.orderLevel" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <upload-image
            ref="uploadImage"
            url="/uploadGoodsImages"
            tip="建议尺寸: 100*100，或正方型图片"
            v-model="form.icon"
          />
        </el-form-item>
        <!-- <el-form-item label="标签" prop="tag">
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button class="button-new-tag" size="small" @click="showInput">+ 点击输入标签</el-button>
        </el-form-item>-->
        <el-form-item label="是否显示" prop="isShow">
          <el-radio v-model="form.isShow" :label="true">是</el-radio>
          <el-radio v-model="form.isShow" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <tags v-model="form.tags"></tags>
        </el-form-item>
        <!-- <el-form-item style="display: block; text-align: left; padding-left: 80px;">
        </el-form-item>-->
      </el-form>
      <span slot="footer">
        <el-button @click="resetForm('form')">取消</el-button>
        <el-button type="primary" :loading="saveBtnLoading" @click="submit('form')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UploadImage from '@/components/UploadImage'
import Tags from '@/components/Tags'
import { translateDataToTree, formatDate } from '@/utils'
import FileSaver from 'file-saver'
import { exportNewCategory as exportCategoryHttp } from '@/api/excel'

export default {
  name: 'newProductsCategoryManager',
  components: { UploadImage, Tags },
  data() {
    return {
      categoryList: [], // 全部分类数据
      treeData: [], // 树形控件数据
      treeLoading: false,
      expandAll: true, // 默认展开所有
      loadingBtnId: null, // 显示/隐藏按钮loading效果
      dialogVisible: false,
      dialogType: 'add', // 弹窗类型：add新增分类，addSub添加子分类，update修改
      // 分类添加参数
      form: {
        name: '',
        icon: '',
        isShow: false,
        orderLevel: 0,
        tags: []
      },
      formRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      saveBtnLoading: false, // 弹窗保存按钮loading
      currentCate: null, // 当前点击的分类
      cateSearchVal: '', // 分类搜索关键词
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      currentParentId: 0 // 选中分类父级id
    }
  },
  computed: {
    dialogTitle() {
      // 弹窗标题
      if (this.dialogType === 'add') {
        return '添加新分类'
      } else if (this.dialogType === 'addSub') {
        return `在“${this.currentCate.name}”上添加子分类`
      } else if (this.dialogType === 'update') {
        return `修改分类“${this.currentCate.name}”`
      }
    },
    //当前级别数组
    currentLevelList() {
      return this.categoryList.filter((v) => v.superId === this.currentParentId)
    }
  },
  created() {
    this.fetchCategoryList()
  },
  mounted() {},
  methods: {
    // 获取分类列表
    async fetchCategoryList() {
      this.treeLoading = true
      this.expandAll = true
      await this.$post('/goods/newProductsCategory/getCategoryPager', {
        pageIndex: 1,
        pageSize: -1
      })
        .then((res) => {
          this.categoryList = _.cloneDeep(res.list)
          this.treeData = translateDataToTree(res.list, 'superId')
          let str = this.cateSearchVal
          this.cateSearchVal = ''
          this.$nextTick(() => {
            this.cateSearchVal = str
          })
        })
        .finally(() => {
          this.treeLoading = false
        })
    },
    // 分类的显示隐藏操作
    showHideCate(data) {
      let url
      if (data.isShow) {
        url = `/goods/newProductsCategory/hide/${data.id}`
      } else {
        url = `/goods/newProductsCategory/show/${data.id}`
      }
      this.loadingBtnId = data.id
      this.$put(url)
        .then((res) => {
          data.isShow = !data.isShow
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loadingBtnId = null
        })
    },
    // 添加分类
    onAddCateClick() {
      this.dialogType = 'add'
      this.dialogVisible = true
      this.currentParentId = 0
    },
    // #region 标签相关
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
    // #endregion 标签相关
    // 保存
    submit(formName = 'form') {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = this.form
          let url
          if (
            this.currentLevelList.some((v) => {
              return v.id !== params.id && v.name === params.name
            })
          ) {
            this.$message.error('同级分类名称不能重复')
            return
          }
          this.saveBtnLoading = true
          if (this.dialogType === 'addSub') {
            url = '/goods/newProductsCategory/addCategory'
            params['superId'] = this.currentCate.id
          } else if (this.dialogType === 'add') {
            url = '/goods/newProductsCategory/addCategory'
          } else if (this.dialogType === 'update') {
            url = '/goods/newProductsCategory/updateCategory'
            params['id'] = this.currentCate.id
          }
          this.$post(url, params)
            .then((res) => {
              this.resetForm('form')
              this.fetchCategoryList()
              this.$message.success('操作成功')
            })
            .catch((error) => {})
            .finally(() => {
              this.saveBtnLoading = false
            })
        } else {
          return false
        }
      })
    },
    // 关闭添加分类弹窗
    resetForm(formName = 'form') {
      this.$refs[formName].resetFields()
      // console.log(formName, this.form)
      this.dialogVisible = false
    },
    // 添加子分类
    addSubCate(data) {
      this.currentCate = data
      this.currentParentId = this.currentCate.id
      this.dialogType = 'addSub'
      this.dialogVisible = true
    },
    // 修改分类
    updateCate(data) {
      this.dynamicTags = data.tags
      this.currentCate = data
      this.currentParentId = this.currentCate.superId
      this.dialogType = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        // bug: 解决保存后resetField无效问题
        this.form = JSON.parse(JSON.stringify(data))
      })
    },
    // 删除分类
    deleteCate(data, node) {
      this.$confirm('确定删除？', {
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$delete('/goods/newProductsCategory/delete/' + data.id).then(
            (res) => {
              this.$message.success('删除成功')
              // this.fetchCategoryList()
              const parent = node.parent
              const children = parent.data.children || parent.data
              const index = children.findIndex((d) => d.id === data.id)
              children.splice(index, 1)
            }
          )
        })
        .catch(() => {
          console.log('取消删除')
        })
    },
    // 折叠/展开
    expandAllClick() {
      for (let i = 0; i < this.$refs.treeX.store._getAllNodes().length; i++) {
        this.$refs.treeX.store._getAllNodes()[i].expanded = !this.expandAll
      }
      this.expandAll = !this.expandAll
    },
    // 树形控件过滤
    filterNode(value, data) {
      // 返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 导出Excel
    onExportClick() {
      console.log('分类', this.categoryList)
      // return
      // 导出
      let formatJson = (filterVal, jsonData) => {
        return jsonData.map((v) =>
          filterVal.map((j) => {
            if (j === 'isShow') {
              return v[j] ? '显示' : '隐藏'
            } else {
              return v[j]
            }
          })
        )
      }
      let listData = this.categoryList
      import('@/utils/excel/Export2Excel').then((excel) => {
        const tHeader = [
          'ID',
          '分类名称',
          '父ID',
          '分类等级',
          '显示/隐藏',
          '排序等级',
          '标签'
        ]
        const filterVal = [
          'id',
          'name',
          'superId',
          'cateLevel',
          'isShow',
          'orderLevel',
          'tag'
        ]
        const list = listData
        const data = formatJson(filterVal, list)
        let fileName = `商品分类${formatDate(
          new Date().getTime(),
          'Y-M-D h:m'
        )}`
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: fileName
        })
      })
    },
    // 导出
    exportCategory() {
      this.$store.commit('SHOW_LOADING')
      exportCategoryHttp()
        .then((blob) => {
          console.log('进去了')
          console.info(blob)
          let fileName = `分类清单${formatDate(
            new Date().getTime(),
            'Y-M-D h:m'
          )}`
          FileSaver.saveAs(blob, fileName + '.xlsx')
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    }
  },
  watch: {
    cateSearchVal(val) {
      this.$refs['treeX'].filter(val)
    }
  }
}
</script>

<style lang='scss' scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
<style lang="scss">
.category-page {
  .el-tree-node__content {
    height: 50px;
  }
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>


