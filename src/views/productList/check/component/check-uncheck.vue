<template>
  <div>
    <the-search class="pl8" @onSearch="onChange" @onReset="onResetQuery">
      <el-form :model="searchQuery" ref="searchQuery" label-width="100px" inline size="mini">
        <el-form-item class="form_item" label="商品名称" prop="name">
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
      </el-form>
    </the-search>
    <div style="margin-top: -10px">
      <exoprt-button
        v-permission-button="'export'"
        fileName="待复核商品"
        :params="exportParams"
        :downloadTotal="exportTotal"
        :req="exportToBeReview"
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
        <el-table-column label="商品条码" prop="codeBar" width="150"></el-table-column>
        <el-table-column prop="shelfLife" label="保质期(天)" width="100"></el-table-column>
        <el-table-column label="箱规" prop="wholesaleSpec" width="100"></el-table-column>
        <el-table-column label="单品体积" width="100">
          <template #default="{row}">
            <div>长：{{row.skuLength || 0}}mm</div>
            <div>宽：{{row.skuWeight || 0}}mm</div>
            <div>高：{{row.skuHeight || 0}}mm</div>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="skuScale" label="单品重量（KG）"></el-table-column>
        <el-table-column label="中箱体积" width="100">
          <template #default="{row}">
            <div>长：{{row.longMiddleCartonSize || 0}}mm</div>
            <div>宽：{{row.widthMiddleCartonSize || 0}}mm</div>
            <div>高：{{row.highMiddleCartonSize || 0}}mm</div>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="middleCartonScale" label="中箱重量（KG）"></el-table-column>
        <el-table-column label="外箱体积" width="100">
          <template #default="{row}">
            <div>长：{{row.longCartonSize || 0}}mm</div>
            <div>宽：{{row.widthCartonSize || 0}}mm</div>
            <div>高：{{row.highCartonSize || 0}}mm</div>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="cartonScale" label="外箱重量（KG）"></el-table-column>
        <el-table-column width="120" label="复核状态" fixed="right">
          <template>待复核</template>
        </el-table-column>
      </el-table>

      <the-pagination
        :pageIndex="searchQuery.pageIndex"
        :pageSize="searchQuery.pageSize"
        :total="searchQuery.total"
        @onPageSizeChange="handleSizeChange"
        @onPageIndexChange="handleCurrentChange"
      />
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
import tableMixin from './table-mixin'
import { getReviewSkuPager, exportToBeReview } from '@/api/goods'

export default {
  name: 'CheckUncheck',

  mixins: [tableMixin],

  components: {
    IdBatchQueryInput,
    SelectBrand,
    SelectCategory,
    SelectAddGoodChannelType,
    ThePagination,
    TheSearch,
    ExoprtButton
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
    'searchQuery.brandId'(val) {
      if (val) {
        this.searchQuery.brandIds = [val]
      } else {
        this.searchQuery.brandIds = []
      }
    }
  },

  methods: {
    exportToBeReview,
    getList() {
      this.$store.commit('SHOW_LOADING')
      getReviewSkuPager(this.searchQuery)
        .then((res) => {
          this.searchQuery.total = res.total || 0
          this.list = res.records || []
          this.reselect(_.cloneDeep(this.selectList))
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>