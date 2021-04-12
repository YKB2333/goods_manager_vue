<template>
  <the-dialog
    :width="dialogWidth"
    :title="title"
    :closeOnClickModal="true"
    @close="back"
    ref="addDialog"
  >
    <the-search @onSearch="onChange" @onReset="onResetQuery">
      <el-form :model="searchQuery" ref="searchQuery" label-width="100px" inline size="mini">
        <el-form-item label="商品名称" prop="spuName">
          <el-input
            v-model="searchQuery.spuName"
            placeholder="请输入商品名称"
            clearable
            @clear="onChange"
            @keyup.enter.native="onChange"
            style="width: 140px;"
          ></el-input>
        </el-form-item>
        <el-form-item prop="skuSn">
          <template slot="label">
            <el-tooltip class="item" effect="dark" content="NC编码" placement="top">
              <span>
                规格编码
                <i class="el-icon-info ml6"></i>
              </span>
            </el-tooltip>
          </template>
          <el-input
            v-model="skuSn"
            placeholder="请输入"
            clearable
            @clear="onChange"
            @keyup.enter.native="onChange"
            style="width: 140px;"
          ></el-input>
          <el-button size="mini" icon="el-icon-more" @click="showSkuSnDialog=true"></el-button>
        </el-form-item>
        <el-form-item label="商品条码" prop="codeBar">
          <el-input
            v-model="codeBar"
            placeholder="请输入"
            clearable
            @clear="onChange"
            @keyup.enter.native="onChange"
            style="width: 140px;"
          ></el-input>
          <el-button size="mini" icon="el-icon-more" @click="showCodeBarDialog=true"></el-button>
        </el-form-item>
        <el-form-item label="商品品牌" prop="name">
          <select-brand v-model="searchQuery.brandId" multiple @change="onChange" />
        </el-form-item>
        <el-form-item label="商品分类" prop="cateCode">
          <select-category v-model="searchQuery.cateCode" @change="onChange" />
        </el-form-item>
        <el-form-item label="审核状态" prop="isEnable">
          <el-select v-model="searchQuery.checkedStatus" @change="onChange" clearable>
            <el-option label="未审核" :value="1"></el-option>
            <el-option label="审核中" :value="4"></el-option>
            <el-option label="审核通过" :value="2"></el-option>
            <el-option label="审核未通过" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态" prop="isEnable">
          <el-select v-model="searchQuery.isOnSale" @change="onChange" clearable>
            <el-option label="未上架" :value="false"></el-option>
            <el-option label="已上架" :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品标签" prop="tag">
          <el-input
            v-model="searchQuery.tag"
            placeholder="请输入商品标签"
            clearable
            @clear="onChange"
            @keyup.enter.native="onChange"
            style="width: 140px;"
          ></el-input>
        </el-form-item>
      </el-form>
    </the-search>
    <div class="col">
      <el-button-group class="pb14">
        <el-button type="primary" size="small" :loading="batchAddLoading" @click="onBatchAdd">添加</el-button>
      </el-button-group>
    </div>
    <el-table
      ref="spuTableData"
      :data="tableData"
      border
      stripe
      element-loading-text="拼命加载中"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column type="expand" width="50px" align="center">
        <template slot-scope="scope">
          <el-table
            ref="spuTableData"
            :data="scope.row.skus"
            border
            stripe
            v-if="scope.row.skus && scope.row.skus.length>0"
          >
            <el-table-column type="index" label="序号" width="50px" align="center" />
            <el-table-column prop="name" label="规格图片" align="center">
              <template slot-scope="scopes">
                <div class="row center-y">
                  <el-popover placement="top" trigger="click">
                    <img
                      slot="reference"
                      :src="scopes.row.titleImage || require('@/assets/images/logo.png')"
                      style="max-width: 100px; max-height: 100px;"
                    />
                    <el-image
                      :src="scopes.row.titleImage || require('@/assets/images/logo.png')"
                      style="max-width: 600px; max-height: 600px;"
                    ></el-image>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="skuSn" label align="center">
              <template slot="header">
                <el-tooltip effect="dark" content="nc编码" placement="top">
                  <span>
                    规格编码
                    <i class="el-icon-info ml6"></i>
                  </span>
                </el-tooltip>
              </template>
              <template slot-scope="scopes">{{scopes.row.skuSn}}</template>
            </el-table-column>
            <el-table-column prop="codeBar" label="商品条码" align="center"></el-table-column>
            <el-table-column label="规格属性" align="center">
              <template slot-scope="scopes">
                <spn
                  v-if="scopes.row.firstAtbValue"
                >{{scopes.row.firstAtbKey}}: {{scopes.row.firstAtbValue}}</spn>
                <spn
                  v-if="scopes.row.secondAtbValue"
                >;{{scopes.row.secondAtbKey}}: {{scopes.row.secondAtbValue}}</spn>
              </template>
            </el-table-column>
            <el-table-column prop="effectiveStock" label="可用库存" align="center"></el-table-column>
            <el-table-column prop="workStatus" label="合作状态" align="center"></el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column type="index" width="50" align="center" label="序号" />
      <el-table-column prop="id" label="spu_id" align="center"></el-table-column>
      <el-table-column label="商品图片" align="center">
        <template slot-scope="scope">
          <div class="row center-y">
            <el-popover placement="top" trigger="click">
              <img
                slot="reference"
                :src="scope.row.titleImage || require('@/assets/images/logo.png')"
                style="max-width: 100px; max-height: 100px;"
              />
              <el-image
                :src="scope.row.titleImage || require('@/assets/images/logo.png')"
                style="max-width: 600px; max-height: 600px;"
              ></el-image>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="200px">
        <template slot="header">
          <el-tooltip effect="dark" content="点击商品名称可查询商品详情信息" placement="top">
            <span>
              商品名称
              <i class="el-icon-info ml6"></i>
            </span>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="preview(scope.row.id)"
            style="user-select: unset;"
          >{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="cateName" label="分类"></el-table-column>
      <el-table-column prop="brandName" label="品牌"></el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          <div v-if="scope.row.checkedStatus == 1">未审核</div>
          <div v-if="scope.row.checkedStatus == 2">审核通过</div>
          <div v-if="scope.row.checkedStatus == 3">审核不通过</div>
          <div v-if="scope.row.checkedStatus == 4">审核中</div>
        </template>
      </el-table-column>
      <el-table-column label="上架状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isOnSale == true">已上架</div>
          <div v-if="scope.row.isOnSale == false">未上架</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="tag" label="标签">
                  <template slot-scope="scope">
          <el-tag type="warning" v-for="item in scope.row.tag" :key="item.id">{{ item }}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column label="总可用库存" align="center">
        <template slot-scope="scope">{{scope.row.validityStock}}</template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-tooltip effect="dark" content="该spu下的所有sku均为正常销售时，则显示正常销售" placement="top">
            <span>
              合作状态
              <i class="el-icon-info ml6"></i>
            </span>
          </el-tooltip>
        </template>
        <template slot-scope="scope">{{scope.row.workStatusShow}}</template>
      </el-table-column>
    </el-table>

    <the-pagination
      :pageIndex="searchQuery.pageIndex"
      :pageSize="searchQuery.pageSize"
      :total="searchQuery.total"
      @onPageSizeChange="handleSizeChange"
      @onPageIndexChange="handleCurrentChange"
    />
    <!-- 弹窗 -->
    <my-dialog
      v-model="showCodeBarDialog"
      :close-on-click-modal="false"
      :title="showCodeBarTitle"
      width="500px"
      max-height
      @close="closeCodeBarDialog"
    >
      <div>
        <el-input v-model="codeBar" type="textarea" :rows="8" placeholder="请输入数据进行查询"></el-input>
      </div>
      <div style="margin-top:5px;margin-bottom:10px">批量搜索的数据支持英文“,” 或换行隔开，最多查询1000条数据</div>
      <div style="margin-left:390px">
        <el-button type="primary" @click="selectByCodeBar">确定</el-button>
      </div>
    </my-dialog>

    <!-- 弹窗 -->
    <my-dialog
      v-model="showSkuSnDialog"
      :close-on-click-modal="false"
      :title="showCodeBarTitle"
      width="500px"
      max-height
      @close="closeSkuSnDialog"
    >
      <div>
        <el-input v-model="skuSn" type="textarea" :rows="8" placeholder="请输入数据进行查询"></el-input>
      </div>
      <div style="margin-top:5px;margin-bottom:10px">批量搜索的数据支持英文“,” 或换行隔开，最多查询1000条数据</div>
      <div style="margin-left:390px">
        <el-button type="primary" @click="selectBySkuSn">确定</el-button>
      </div>
    </my-dialog>
  </the-dialog>
</template>

<script>
import { relationSpuTag, getSpuPager } from '@/api/goods'
import TheDialog from '@/components/TheDialog'
import TheSearch from '@/components/TheSearch'
import ThePagination from '@/components/ThePagination'
import SelectBrand from '@/components/SelectBrand'
import SelectCategory from '@/components/SelectCategory'

export default {
  name: 'addRelationSpu',
  components: {
    TheSearch,
    TheDialog,
    ThePagination,
    SelectBrand,
    SelectCategory
  },
  props: {
    tagItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      title: '添加关联商品',
      dialogWidth: '80%',
      currentItem: this.tagItem,
      delTip: false,
      inputStyle: { width: '220px' },
      labelWidth: '80px',
      saveBtnLoading: false, // 保存按钮的loading状态
      tableLoading: false,
      tableData: [], // 表格数据
      selectAllList: [], //分页选中数据
      batchAddLoading: false,
      showCodeBarTitle: '批量搜索',
      showCodeBarDialog: false,
      showSkuSnDialog: false,
      codeBar: null,
      skuSn: null,
      searchForm: [
        {
          label: '商品名称',
          key: 'spuName',
          placeholder: '请输入商品名称',
          type: 'input'
        }
      ],
      searchQuery: {
        spuName: '', //标签名称
        skuSns: [],
        codeBars: [],
        cateCode: '',
        tag: null,
        isDelete: false,
        isOnSale: null,
        checkedStatus: '',
        brandId: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0 // 总条数
      },
      dialogVisible: false,
      saveForm: {}
    }
  },
  async created() {
    // await this.fetchTableData();
  },
  methods: {
    async init() {
      this.show()
      await this.fetchTableData()
    },
    // 查询列表
    fetchTableData() {
      this.$store.commit('SHOW_LOADING')
      this.tableLoading = true
      this.searchQuery['tagId'] = this.currentItem.id
      console.info('')
      return getSpuPager(this.searchQuery)
        .then((res) => {
          this.searchQuery.total = parseInt(res.count) // 总条数
          if (res.count <= 0) {
            this.tableData = []
            return
          }
          res.list.forEach((r) => {
            r.id += ''
            r.workStatusShow = ''
            if (r.workStatus && r.workStatus.length > 0) {
              r.workStatusShow = '正常销售'
              r.workStatus.forEach((item) => {
                if (item === '清货') {
                  r.workStatusShow = '清货'
                }
              })
            }
          })
          let selectTempList = _.cloneDeep(this.selectAllList)
          console.info('test:', selectTempList)
          this.tableData = res.list
          this.reSelectSpu(selectTempList)
          console.log(this.tableData)
        })
        .finally(() => {
          this.tableLoading = false
          this.$store.commit('SHOW_LOADING', false)
        })
    },
    reSelectSpu(selectTempList) {
      this.$nextTick(() => {
        if (selectTempList && selectTempList.length > 0) {
          this.tableData.forEach((item) => {
            selectTempList.forEach((item2) => {
              if (item2 === item.id) {
                this.$refs['spuTableData'].toggleRowSelection(item)
              }
            })
          })
          selectTempList = []
        }
      })
    },
    handleSelectionChange(selection) {
      console.log('selection:', selection)
      let arr = this.selectAllList.filter((item) => {
        return !this.tableData.find((e) => e.id == item)
      })
      this.selectAllList = arr

      if (selection && selection.length > 0) {
        selection.forEach((item) => {
          this.selectAllList.push(item.id)
        })
      }
      console.info('selectAllList:', this.selectAllList)
    },
    onChange() {
      this.searchQuery['pageIndex'] = 1
      this.selectAllList = []
      this.getCodeBarAndSkuSn()
      this.fetchTableData()
    },
    getCodeBarAndSkuSn() {
      this.searchQuery.codeBars = []
      this.searchQuery.skuSns = []
      if (this.codeBar && this.codeBar != '') {
        let tempCodeBar = this.codeBar.split(/[，.,\s\v\n\t\r]/)
        tempCodeBar.forEach((item) => {
          item = item.replace(/\s*/g, '')
          if (item && item != '' && item.length > 0 && this.isLegal(item))
            this.searchQuery.codeBars.push(item)
        })
        this.codeBar = (this.searchQuery.codeBars || []).join(',')
      }
      if (this.skuSn && this.skuSn != '') {
        let tempSkuSn = this.skuSn.split(/[，.,\s\v\n\t\r]/)
        tempSkuSn.forEach((item) => {
          item = item.replace(/\s*/g, '')
          if (item && item != '' && item.length > 0 && this.isLegal(item))
            this.searchQuery.skuSns.push(item)
        })
        this.skuSn = (this.searchQuery.skuSns || []).join(',')
      }
    },
    isLegal(obj) {
      let reg = /^[A-Za-z0-9]{1,}$/ /*定义验证表达式*/
      return reg.test(obj) /*进行验证*/
    },
    closeDialog() {
      this.saveForm = {}
      this.dialogVisible = false
      this.$refs['saveForm'].clearValidate()
    },
    // 保存提交
    submit() {
      console.log(this.saveForm)
      if (this.saveForm.id) {
        this.update()
      } else {
        this.save()
      }
    },
    save() {
      this.$refs.saveForm.validate((valid) => {
        if (!valid) return false
        this.saveBtnLoading = true
        addSpuTag(this.saveForm)
          .then(() => {
            this.$message.success('商品标签添加成功')
            this.fetchTableData()
            this.closeDialog()
          })
          .finally(() => {
            this.saveBtnLoading = false
          })
      })
    },

    add() {
      this.saveForm = {}
      this.dialogVisible = true
    },
    show() {
      this.$refs['addDialog'].show()
    },
    hide() {
      this.$refs['addDialog'].hide()
    },
    onResetQuery() {
      this.$refs['searchQuery'].resetFields()
      this.searchQuery['pageIndex'] = 1
      this.searchQuery['cateCode'] = ''
      this.searchQuery['brandId'] = []
      this.searchQuery['isOnSale'] = null
      this.searchQuery['checkedStatus'] = ''
      ;(this.codeBar = null), (this.skuSn = null), this.onChange()
    },
    handleSizeChange(val) {
      // 每页条数改变时
      this.searchQuery['pageSize'] = val
      this.searchQuery['pageIndex'] = 1
      this.fetchTableData()
    },
    handleCurrentChange(val) {
      // 页码改变时
      this.searchQuery['pageIndex'] = val
      this.fetchTableData()
    },
    // 批量添加
    onBatchAdd() {
      if (!this.selectAllList.length) {
        this.$message.warning('未选中商品数据！')
        return
      }
      // 弹窗确认
      this.$confirm('确定添加关联商品吗？', {
        type: 'warning'
      })
        .then(() => {
          this.batchAddLoading = true
          let param = {}
          param.tagId = this.currentItem.id
          param.spuIds = this.selectAllList
          relationSpuTag(param)
            .then((res) => {
              this.$message({
                message: '标签已成功关联商品',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.hide()
                }
              })
            })
            .finally(() => {
              this.batchAddLoading = false
            })
        })
        .catch(() => {})
    },
    selectByCodeBar() {
      this.showCodeBarDialog = false
      this.onChange()
    },
    closeCodeBarDialog() {
      this.showCodeBarDialog = false
    },
    selectBySkuSn() {
      this.showSkuSnDialog = false
      this.onChange()
    },
    closeSkuSnDialog() {
      this.showSkuSnDialog = false
    },
    back() {
      // 发送广播
      console.info('backbackbackback')
      this.$eventHub.$emit('addRelationSpu', { tagId: this.currentItem.id })
    },
    // 预览
    preview(spuId) {
      console.info('test:', spuId)
      let previewPage = this.$instantCompt(
        require('@/views/productList/maintaining/Preview.vue').default,
        {
          dialogWidth: '80%'
        }
      )
      previewPage.init(spuId)
    }
  }
}
</script>

