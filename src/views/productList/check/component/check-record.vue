<template>
  <div>
    <div class="white-bg desc pl40 pb4">备注：仅显示涉及商品物流属性相关的字段的修改记录，例如商品条码、保质期、箱规、单品/外箱/中箱长宽高重量信息。</div>
    <the-search class="pl8" @onSearch="onChange" @onReset="onResetQuery">
      <el-form :model="searchQuery" ref="searchQuery" label-width="100px" inline size="mini">
        <el-form-item label="更新时间" prop="updateDate">
          <el-date-picker
            v-model="searchQuery.updateDate"
            type="daterange"
            value-format="timestamp"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="searchQuery.name"
            placeholder="请输入"
            clearable
            @clear="onChange"
            @keyup.enter.native="onChange"
          ></el-input>
        </el-form-item>
        <el-form-item prop="skuSns">
          <template slot="label">
            <el-tooltip class="item" effect="dark" content="NC编码;多个NC编码之间使用“,”分隔" placement="top">
              <span>
                规格编码
                <i class="el-icon-info ml6"></i>
              </span>
            </el-tooltip>
          </template>
          <id-batch-query-input v-model="searchQuery.skuSns" @keyup.enter.native="onChange"></id-batch-query-input>
        </el-form-item>
        <el-form-item prop="codeBars">
          <template slot="label">
            <el-tooltip class="item" effect="dark" content="多个商品条码之间使用“,”分隔" placement="top">
              <span>
                商品条码
                <i class="el-icon-info ml6"></i>
              </span>
            </el-tooltip>
          </template>
          <id-batch-query-input v-model="searchQuery.codeBars" @keyup.enter.native="onChange"></id-batch-query-input>
        </el-form-item>
        <el-form-item label="商品品牌" prop="brandId">
          <select-brand v-model="searchQuery.brandId" />
        </el-form-item>
        <el-form-item label="商品分类" prop="cateCode">
          <select-category :refresh="false" v-model="searchQuery.cateCode" />
        </el-form-item>
        <el-form-item label="授权渠道范围" prop="scopeAuthoriza">
          <select-add-good-channel-type
            :multiple="false"
            v-model="searchQuery.scopeAuthoriza"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item label="审核状态" prop="checkedStatus">
          <el-select v-model="searchQuery.checkedStatus" clearable>
            <el-option
              v-for="(label, value) in checkMap"
              :key="value"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </the-search>
    <div style="margin-top: -10px">
      <exoprt-button
        fileName="商品修改记录"
        :params="exportParams"
        :downloadTotal="exportTotal"
        :req="exportReviewLog"
      ></exoprt-button>
    </div>
    <div class="mt10 ptb10 plr8 white-bg">
      <el-table
        ref="table"
        :data="list"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40px"></el-table-column>
        <el-table-column label="序号" type="index" width="50px"></el-table-column>
        <el-table-column prop="skuSn" width="150">
          <template slot="header">
            <el-tooltip class="item" effect="dark" content="NC编码" placement="top">
              <span>
                规格编码
                <i class="el-icon-info ml6"></i>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name" min-width="300"></el-table-column>
        <el-table-column label="分类" prop="cateName" width="100"></el-table-column>
        <el-table-column label="品牌" prop="brandName" width="110"></el-table-column>
        <el-table-column label="商品条码" prop="newCodeBar" width="150"></el-table-column>
        <el-table-column prop="newShelfLife" label="保质期" width="100"></el-table-column>
        <el-table-column label="箱规" prop="newWholesaleSpec" width="100"></el-table-column>
        <el-table-column label="单品体积" width="100">
          <template #default="{row}">
            <div>长：{{row.newSkuLength || 0}}mm</div>
            <div>宽：{{row.newSkuWeight || 0}}mm</div>
            <div>高：{{row.newSkuHeight || 0}}mm</div>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="newSkuScale" label="单品重量（KG）"></el-table-column>
        <el-table-column label="中箱体积" width="100">
          <template #default="{row}">
            <div>长：{{row.newLongMiddleCartonSize || 0}}mm</div>
            <div>宽：{{row.newWidthMiddleCartonSize || 0}}mm</div>
            <div>高：{{row.newHighMiddleCartonSize || 0}}mm</div>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="newMiddleCartonScale" label="中箱重量（KG）"></el-table-column>
        <el-table-column label="外箱体积" width="100">
          <template #default="{row}">
            <div>长：{{row.newLongCartonSize || 0}}mm</div>
            <div>宽：{{row.newWidthCartonSize || 0}}mm</div>
            <div>高：{{row.newHighCartonSize || 0}}mm</div>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="newCartonScale" label="外箱重量（KG）"></el-table-column>
        <el-table-column width="100" label="审核状态">
          <template #default="{row}">{{checkMap[row.checkedStatus]}}</template>
        </el-table-column>
        <el-table-column width="100" prop="creator" label="申请人"></el-table-column>
        <el-table-column
          width="120"
          label="申请时间"
          prop="createDate"
          :formatter="(row) => formatDate(row.createDate, 'Y/M/D h:m')"
        ></el-table-column>
        <el-table-column width="100" label="审核人" prop="approver"></el-table-column>
        <el-table-column
          width="120"
          label="更新时间"
          prop="updateDate"
          :formatter="(row) => formatDate(row.updateDate, 'Y/M/D h:m')"
        ></el-table-column>
        <el-table-column width="100" label="操作" fixed="right">
          <template #default="{row}">
            <el-button @click="view(row)" type="text">查看</el-button>
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
      <el-dialog
        title="审批详情"
        :visible.sync="dialogVisible"
        width="800px"
        custom-class="compact"
        :close-on-press-escape="false"
      >
        <check-record-detail :goods="currentItem"></check-record-detail>
        <div slot="footer">
          <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import TheSearch from '@/components/TheSearch'
import ThePagination from '@/components/ThePagination'
import IdBatchQueryInput from '@/components/IdBatchQueryInput'
import SelectBrand from '@/components/SelectBrand'
import SelectCategory from '@/components/SelectCategory'
import SelectAddGoodChannelType from '@/components/SelectAddGoodChannelType'
import ExoprtButton from '@/components/ExoprtButton.vue'
import CheckRecordDetail from './check-record-detail'
import tableMixin from './table-mixin'
import { getReviewSkuLogPager, exportReviewLog } from '@/api/goods'
import { formatDate } from '@/utils'

export default {
  name: 'CheckRecord',

  mixins: [tableMixin],

  components: {
    IdBatchQueryInput,
    SelectBrand,
    SelectCategory,
    SelectAddGoodChannelType,
    ThePagination,
    TheSearch,
    ExoprtButton,
    CheckRecordDetail
  },

  data() {
    return {
      searchQuery: {
        name: '',
        skuSns: [],
        codeBars: [],
        brandId: '',
        cateCode: '',
        scopeAuthoriza: ''
      },
      list: [],
      selectList: [],
      tempSelectList: [],
      dialogVisible: false,
      currentItem: {},
      checkMap: {
        0: '复核中',
        1: '复核通过',
        2: '复核不通过'
      }
    }
  },

  computed: {
    exportParams() {
      const ids = this.selectList.map((v) => v.skuId)
      return {
        ...this.searchQuery,
        skuIds: ids
      }
    },

    exportTotal() {
      return this.selectList.length || this.searchQuery.total || 0
    }
  },

  watch: {
    'searchQuery.updateDate': {
      deep: true,
      handler: function (val) {
        if (Array.isArray(val) && val.length === 2) {
          this.searchQuery.startUpdateDate = val[0]
          this.searchQuery.endUpdateDate = val[1]
        } else {
          this.searchQuery.startUpdateDate = null
          this.searchQuery.endUpdateDate = null
        }
      }
    },

    'searchQuery.brandId'(val) {
      if (val) {
        this.searchQuery.brandIds = [val]
      } else {
        this.searchQuery.brandIds = []
      }
    }
  },

  methods: {
    exportReviewLog,
    formatDate,

    getList() {
      this.$store.commit('SHOW_LOADING')
      getReviewSkuLogPager(this.searchQuery)
        .then((res) => {
          this.searchQuery.total = res.total || 0
          this.list = res.records || []
          this.reselect(_.cloneDeep(this.selectList))
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    },

    view(row) {
      this.currentItem = row
      this.dialogVisible = true
      console.log(row)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .compact {
  .el-dialog__body {
    padding: 16px;
  }
}

.desc {
  color: #7f7f7f;
  font-size: 13px;
}
</style>