<template>
  <div class="category-page col">
    <div class="search-box">
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
        <el-button
          v-permission-button="'setMainCategory'"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="onAddTypeClick"
        >设置所属大类</el-button>
        <!-- <el-button type="success" size="small" icon="el-icon-document-copy" @click="onExportClick">导出Excel</el-button> -->
        <el-button
          v-permission-button="'export'"
          icon="el-icon-document-copy"
          type="success"
          size="small"
          @click="exportCategory"
        >导出Excel</el-button>
      </el-button-group>
    </div>
    <el-tree
      ref="treeX"
      v-loading="treeLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="tree-dom"
      :data="treeData"
      node-key="id"
      :default-expand-all="expandAll"
      :expand-on-click-node="true"
      :filter-node-method="filterNode"
      show-checkbox
      @check-change="onCheckChange"
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
          <div class="inline-block mr10" v-if="data.cateLevel !== '3'">
            <el-tag
              v-for="(item, idx) in data.mainCategory"
              :key="idx"
              effect="dark"
              class="mr10"
            >{{item}}</el-tag>
          </div>
          <div class="inline-block mr10" v-if="data.cateLevel === '3' && data.mainCategory">
            <el-tag effect="dark" class="mr10">{{ data.mainCategory }}</el-tag>
          </div>
          <div style="width: 200px; display: inline-block; text-align: right;">
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
      </div>
    </el-tree>
    <!-- 添加/编辑 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      width="600px"
      @close="resetForm('form')"
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
        <el-form-item label="是否显示" prop="isShow">
          <el-radio v-model="form.isShow" :label="true">是</el-radio>
          <el-radio v-model="form.isShow" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item
          label="所属大类"
          prop="mainCategory"
          v-if="currentParent && currentParent.cateLevel == 2"
        >
          <el-select v-model="form.mainCategory" placeholder="请选择" clearable>
            <el-option v-for="(item,idx) in typeOptions" :key="idx" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <tags v-model="form.tags"></tags>
        </el-form-item>

        <!-- <el-form-item style="display: block; text-align: left; padding-left: 80px;">
          <el-button type="primary" :loading="saveBtnLoading" @click="submit('form')">保存</el-button>
          <el-button @click="resetForm('form')">关闭</el-button>
        </el-form-item>-->
      </el-form>
      <span slot="footer">
        <el-button @click="resetForm('form')">取消</el-button>
        <el-button type="primary" :loading="saveBtnLoading" @click="submit('form')">保存</el-button>
      </span>
    </el-dialog>
    <!-- 设置所属大类 -->
    <el-dialog
      title="批量设置所属大类"
      :visible.sync="isShowTypeDialog"
      :show-close="false"
      :close-on-click-modal="false"
      width="500px"
      @close="resetForm('form')"
    >
      <el-form ref="form" :model="mainCategoryForm" label-width="100px" size="mini" inline>
        <el-form-item label="所属大类" prop="name">
          <el-select v-model="typeValue" placeholder="请选择" clearable>
            <el-option v-for="(item,idx) in typeOptions" :key="idx" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="onCloseTypeDialog">取消</el-button>
        <el-button type="primary" :loading="saveBtnLoading" @click="onSaveTypeDialog">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UploadImage from '@/components/UploadImage'
import Tags from '@/components/Tags'
import { translateDataToTree, formatDate } from '@/utils'
import FileSaver from 'file-saver'
import { exportCategory as exportCategoryHttp } from '@/api/excel'
import {
  findMainCategory,
  batchSetMainCategory,
  getCategoryPager
} from '@/api/goods'

export default {
  name: 'CategoryManager',
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
        tags: [],
        mainCategory: '',
        id: ''
      },
      // 所属大类
      mainCategoryForm: {
        name: ''
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
      isShowTypeDialog: false,
      typeOptions: [],
      typeValue: '',
      checkedList: [], // 选中分类
      currentParentId: 0 // 选中分类父级id
    }
  },
  computed: {
    // 弹窗标题
    dialogTitle() {
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
    },
    currentParent() {
      return this.categoryList.find((v) => v.id === this.currentParentId)
    }
  },
  created() {
    this.fetchCategoryList()
    this.fetchMainCategory()
  },
  mounted() {},
  methods: {
    // 获取分类列表
    async fetchCategoryList() {
      this.treeLoading = true
      this.expandAll = true
      await getCategoryPager({
        pageIndex: 1,
        pageSize: -1
      })
        .then((res) => {
          this.categoryList = _.cloneDeep(res.list)
          //合并所属子大类到第一级
          this.formatMainCategory(2)
          this.formatMainCategory(1)
          this.treeData = translateDataToTree(this.categoryList, 'superId')
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
    formatMainCategory(level) {
      this.categoryList
        .filter((e) => e.cateLevel === String(level))
        .forEach((e) => {
          let map = new Map()
          let arr = []
          this.categoryList
            .filter((e) => e.cateLevel === String(level + 1))
            .forEach((v) => {
              if (v.superId === e.id && v.mainCategory) {
                arr = arr.concat(v.mainCategory)
              }
            })
          e.mainCategory = arr.filter(
            (item) => !map.has(item) && map.set(item, 1)
          )
        })
    },
    // 获取所属大类
    fetchMainCategory() {
      findMainCategory().then((res) => {
        this.typeOptions = res
      })
    },
    // 分类的显示隐藏操作
    showHideCate(data) {
      let url
      if (data.isShow) {
        url = `/goods/category/hide/${data.id}`
      } else {
        url = `/goods/category/show/${data.id}`
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
      this.currentCate = null
      this.dialogType = 'add'
      this.dialogVisible = true
      this.currentParentId = 0
    },
    //选中分类
    onCheckChange(data, checked) {
      if (checked) {
        this.checkedList.push(data)
      } else {
        this.checkedList.splice(
          this.checkedList.findIndex((e) => e.code === data.code),
          1
        )
      }
    },
    //打开大类弹窗
    onAddTypeClick() {
      if (this.checkedList.length > 0) {
        this.isShowTypeDialog = true
      } else {
        this.$message.warning('请选择第三级分类')
      }
    },
    //保存所属大类
    onSaveTypeDialog() {
      let ids = []
      this.checkedList
        .filter((e) => e.cateLevel === '3')
        .map((i) => {
          ids.push(i.id)
        })
      batchSetMainCategory({
        ids,
        mainCategory: this.typeValue
      }).then((res) => {
        this.isShowTypeDialog = false
        this.typeValue = ''
        this.fetchCategoryList()
      })
    },
    //关闭所属大类
    onCloseTypeDialog() {
      this.isShowTypeDialog = false
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
    // 保存
    submit(formName = 'form') {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = _.cloneDeep(this.form)
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
            url = '/goods/category/addCategory'
            params['superId'] = this.currentCate.id
          } else if (this.dialogType === 'add') {
            url = '/goods/category/addCategory'
          } else if (this.dialogType === 'update') {
            url = '/goods/category/updateCategory'
            params['id'] = this.currentCate.id
          }
          if (!this.currentParent || this.currentParent.cateLevel == 1) {
            params.mainCategory = ''
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
      this.form.id = ''
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    // 添加子分类
    addSubCate(data) {
      this.currentCate = data
      this.dialogType = 'addSub'
      this.dialogVisible = true
      this.currentParentId = this.currentCate.id
    },
    // 修改分类
    updateCate(data) {
      this.dynamicTags = data.tags
      this.currentCate = data
      this.dialogType = 'update'
      this.dialogVisible = true
      this.currentParentId = this.currentCate.superId
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
          this.$delete('/goods/category/delete/' + data.id).then((res) => {
            this.$message.success('删除成功')
            this.fetchCategoryList()
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex((d) => d.id === data.id)
            children.splice(index, 1)
          })
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
.search-box {
  position: fixed;
  height: 120px;
  width: 80%;
  top: 84px;
  padding: 20px 0 10px;
  z-index: 9;
  background: #f0f2f5;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.tree-dom {
  width: 800px;
  min-height: 240px;
  margin-top: 100px;
}
/deep/ .el-tree-node__children[role='group'] {
  .el-tree-node[role='treeitem'] {
    .el-icon-caret-right,
    .el-checkbox {
      transform: translateX(-18px);
    }
    .expanded.el-tree-node__expand-icon.el-icon-caret-right {
      transform: translateX(-18px) rotate(90deg);
    }
  }
  .el-tree-node__children[role='group'] {
    .el-tree-node[role='treeitem'] {
      .el-checkbox {
        transform: translateX(-36px);
      }
    }
  }
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

