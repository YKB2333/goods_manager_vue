<template>
  <div>
    <div style="text-align: center;margin-bottom: 15px;">【{{title}}】关联商品</div>
    <the-search @onSearch="onChange" @onReset="onResetQuery">
      <el-form :model="searchQuery" ref="searchQuery" label-width="100px" inline size="mini">
        <el-form-item label="商品名称" prop="spuName">
          <el-input
            v-model="searchQuery.spuName"
            placeholder="请输入商品名称"
            clearable
            @keyup.enter.native="onChange"
            style="width: 140px;"
          ></el-input>
        </el-form-item>
        <el-form-item prop="skuSns">
          <template slot="label">
            <el-tooltip class="item" effect="dark" content="NC编码" placement="top">
              <span>
                规格编码
                <i class="el-icon-info ml6"></i>
              </span>
            </el-tooltip>
          </template>
          <id-batch-query-input v-model="searchQuery.skuSns" @keyup.enter.native="onChange"></id-batch-query-input>
        </el-form-item>
        <el-form-item label="商品条码" prop="codeBars">
          <id-batch-query-input v-model="searchQuery.codeBars" @keyup.enter.native="onChange"></id-batch-query-input>
        </el-form-item>
        <el-form-item label="商品品牌" prop="name">
          <select-brand v-model="searchQuery.brandId" multiple />
        </el-form-item>
        <el-form-item label="商品分类" prop="cateCode">
          <select-category v-model="searchQuery.cateCode" />
        </el-form-item>
        <el-form-item label="审核状态" prop="isEnable">
          <el-select v-model="searchQuery.checkedStatus" clearable>
            <el-option label="未审核" :value="1"></el-option>
            <el-option label="审核中" :value="4"></el-option>
            <el-option label="审核通过" :value="2"></el-option>
            <el-option label="审核未通过" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态" prop="isEnable">
          <el-select v-model="searchQuery.isOnSale" clearable>
            <el-option label="未上架" :value="false"></el-option>
            <el-option label="已上架" :value="true"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </the-search>
    <div class="mb10">
      <el-button v-permissionButton="'add'" type="primary" @click="showSpu">添加关联商品</el-button>
      <el-button
        v-permissionButton="'delete'"
        type="primary"
        :loading="batchDeleteLoading"
        @click="onBatchDelete"
      >批量删除</el-button>
      <!-- <el-button  type="primary" :loading="batchDeleteLoading" @click="onBatchDelete">设置备注</el-button> -->
      <relation-spu-setmark-button
        class="opt"
        :selectList="selectAllList"
        :tagId="currentItem.id"
        v-permissionButton="'addRemark'"
      ></relation-spu-setmark-button>
      <el-button
        v-permissionButton="'addSort'"
        type="primary"
        :loading="batchDeleteLoading"
        @click="onSort"
      >设置排序</el-button>

      <el-button
        v-permissionButton="'export'"
        type="primary"
        :loading="batchDeleteLoading"
        @click="exportData"
      >导出</el-button>
      <!-- <el-button-group style="margin-top: -10px;margin-bottom:10px">
      </el-button-group>-->
    </div>
    <el-table
      ref="spuTableData"
      :data="tableData"
      border
      stripe
      element-loading-text="拼命加载中"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!--商品sku库存信息 start-->
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
                <span
                  v-if="scopes.row.firstAtbValue"
                >{{scopes.row.firstAtbKey}}: {{scopes.row.firstAtbValue}}</span>
                <span
                  v-if="scopes.row.secondAtbValue"
                >;{{scopes.row.secondAtbKey}}: {{scopes.row.secondAtbValue}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="effectiveStock" label="可用库存" align="center"></el-table-column>
            <el-table-column prop="workStatus" label="合作状态" align="center"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <!--商品sku库存信息 end-->
      <el-table-column type="index" width="50" align="center" label="序号" />
      <!-- <el-table-column prop="id" label="spu_id" align="center" ></el-table-column> -->
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

      <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
      <el-table-column prop="cateName" label="分类" align="center"></el-table-column>
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
      <el-table-column label="总可用库存" align="center">
        <template slot-scope="scope">{{scope.row.validityStock||0}}</template>
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
      <el-table-column align="center" :show-overflow-tooltip="true">
        <template slot="header">
          <el-tooltip effect="dark" content="可填写标签推荐原因，填写后将在企微端显示" placement="top">
            <span>
              备注
              <i class="el-icon-info ml6"></i>
            </span>
          </el-tooltip>
        </template>
        <template slot-scope="scope">{{scope.row.remark}}</template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">{{scope.row.orderLevel}}</template>
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

    <el-dialog
      title="设置排序"
      v-if="isShowOrderDialog"
      :visible.sync="isShowOrderDialog"
      :show-close="false"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form ref="form" :model="form" size="mini" label-width="100px" inline :rules="formRules">
        <el-form-item label="排序" prop="orderLevel">
          <el-input style="width:230px;" v-model="form.orderLevel"></el-input>
        </el-form-item>
        <el-form-item label=" " style="font-size:12px !important;">
          <div class="fs12">ps:列表按照序号大小排序,序号越大,排序越前</div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="onCloseOrderDialog">取消</el-button>
        <el-button type="primary" :loading="saveBtnLoading" @click="onSaveOrderDialog">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  disassociationSpuTag,
  getRelationSpuPager,
  exportTagSpu,
  addOrderLevel
} from '@/api/goods'
import TheDialog from '@/components/TheDialog'
import TheSearch from '@/components/TheSearch'
import ThePagination from '@/components/ThePagination'
import SelectBrand from '@/components/SelectBrand'
import SelectCategory from '@/components/SelectCategory'
import IdBatchQueryInput from '@/components/IdBatchQueryInput.vue'
import RelationSpuSetmarkButton from './relation-spu-setmark-button.vue'
import FileSaver from 'file-saver'
import { formatDate } from '@/utils'

export default {
  name: 'relationTagSpu',
  components: {
    TheSearch,
    TheDialog,
    ThePagination,
    SelectBrand,
    SelectCategory,
    IdBatchQueryInput,
    RelationSpuSetmarkButton
  },
  props: {
    tagItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      title: this.$route.query.name,
      dialogWidth: '80%',
      currentItem: this.$route.query,
      delTip: false,
      inputStyle: { width: '220px' },
      labelWidth: '80px',
      saveBtnLoading: false, // 保存按钮的loading状态
      tableLoading: false,
      tableData: [], // 表格数据
      selectAllList: [], //分页选中数据
      batchDeleteLoading: false,
      showCodeBarTitle: '批量搜索',
      showCodeBarDialog: false,
      showSkuSnDialog: false,
      skuSn: null,
      codeBar: null,
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
        brandId: [],
        isDelete: false,
        isOnSale: null,
        checkedStatus: '',
        pageIndex: 1,
        pageSize: 10,
        total: 0 // 总条数
      },
      dialogVisible: false,
      saveForm: {},
      isShowOrderDialog: false,
      form: {
        orderLevel: 0 //默认排序
      },
      formRules: {
        orderLevel: [
          {
            required: true,
            message: '请输入排序值（排序最大限制输入5位数）',
            trigger: 'blur'
          },
          {
            pattern: /^(0{1}|([1-9]\d{0,4}))$/,
            message: '排序最大限制输入5位数',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  async created() {
    await this.fetchTableData()
    this.backToDong()
  },
  methods: {
    async init() {
      //  this.show();
      await this.fetchTableData()
    },
    // 查询列表
    fetchTableData() {
      this.$store.commit('SHOW_LOADING')
      this.tableLoading = true
      this.searchQuery['tagId'] = this.currentItem.id
      return getRelationSpuPager(this.searchQuery)
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
          this.tableData = res.list
          this.reSelectSpu(selectTempList)
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
    },

    onChange() {
      this.searchQuery['pageIndex'] = 1
      this.selectAllList = []
      this.fetchTableData()
    },
    //设置排序
    onSort() {
      if (!this.selectAllList.length) {
        this.$message.warning('未选中商品数据！')
        return
      }
      this.form.orderLevel = 0
      this.isShowOrderDialog = true
    },
    onSaveOrderDialog() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addOrderLevel({
            orderLevel: this.form.orderLevel,
            spuIds: this.selectAllList,
            tagId: this.currentItem.id
          }).then((res) => {
            this.$message.success('设置成功')
            this.isShowOrderDialog = false
            this.selectAllList = []
            this.fetchTableData()
          })
        } else {
          return false
        }
      })
    },
    onCloseOrderDialog() {
      this.isShowOrderDialog = false
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
    // show() {
    //   this.$refs['dialog'].show()
    // },

    onResetQuery() {
      this.$refs['searchQuery'].resetFields()
      this.searchQuery['pageIndex'] = 1
      this.searchQuery['cateCode'] = ''
      this.searchQuery['brandId'] = []
      this.searchQuery['isOnSale'] = null
      this.searchQuery['checkedStatus'] = ''
      this.codeBar = null
      this.skuSn = null
      this.onChange()
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
    // 批量删除
    onBatchDelete() {
      if (!this.selectAllList.length) {
        this.$message.warning('未选中商品数据！')
        return
      }
      // 弹窗确认
      this.$confirm('是否删除选中的关联商品？', {
        type: 'warning'
      })
        .then(() => {
          this.batchDeleteLoading = true
          let param = {}
          param.tagId = this.currentItem.id
          param.spuIds = this.selectAllList
          disassociationSpuTag(param)
            .then((res) => {
              this.$message({
                message: '关联商品删除成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.onChange()
                }
              })
            })
            .finally(() => {
              this.batchDeleteLoading = false
            })
        })
        .catch(() => {})
    },

    showSpu() {
      let view = this.$instantCompt(require('./addRelationSpu').default, {
        tagItem: this.currentItem
      })
      view.init()
    },

    backToDong() {
      // 关闭全局广播
      this.$eventHub.$off('addRelationSpu')
      // 开始全局广播
      this.$eventHub.$on('addRelationSpu', (res) => {
        this.selectAllList = []
        this.fetchTableData()
      })
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
    },

    exportData() {
      let downloadTotal =
        (this.selectAllList && this.selectAllList.length) ||
        this.searchQuery.total ||
        0
      if (!downloadTotal) {
        this.$message.error('当前导出的数据为空')
        return
      }
      let msg = '当前无勾选商品数据，将下载全部标签关联商品数据，是否确认下载？'
      if (this.selectAllList && this.selectAllList.length > 0) {
        msg =
          '当前待下载的商品数量：' +
          this.selectAllList.length +
          '，是否确认下载？'
      }
      this.$confirm(msg, {
        type: 'warning'
      })
        .then(() => {
          this.doExport()
        })
        .catch(() => {
          return
        })
    },

    doExport() {
      this.$store.commit('SHOW_LOADING')
      if (Array.isArray(this.selectAllList)) {
        this.searchQuery.spuIds = this.selectAllList
      }
      exportTagSpu(this.searchQuery)
        .then((blob) => {
          let fileName = `标签关联商品信息-${formatDate(
            new Date().getTime(),
            'YMDhm'
          )}`
          FileSaver.saveAs(blob, fileName + '.xlsx')
        })
        .finally(() => {
          this.searchQuery.spuIds = []
          this.$store.commit('SHOW_LOADING', false)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.opt + .opt {
  margin-left: 10px;
}
.el-button + .opt {
  margin-left: 10px;
}
.opt + .el-button {
  margin-left: 10px;
}
</style>
