<template>
  <div>
    <el-tabs  v-model="saleStatus" type="card" >
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="已发布" name="release"></el-tab-pane>
      <el-tab-pane label="已下架" name="unsale"></el-tab-pane>
    </el-tabs>

    <the-search @onSearch="onChange" @onReset="onResetQuery"  >
      <el-form class="form_wapper" :model="searchQuery" ref="searchQuery" label-width="100px" inline size="mini">
        <el-form-item class="form_item" label="商品名称" prop="spuName">
          <el-input v-model="searchQuery.spuName" placeholder="请输入" clearable @clear="onChange" @keyup.enter.native="onChange" ></el-input>
        </el-form-item>
        <el-form-item prop="skuSns">
          <template slot="label">
            <el-tooltip class="item" effect="dark" content="NC编码;多个NC编码之间使用“,”分隔" placement="top">
              <span>规格编码<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
          <id-batch-query-input v-model="searchQuery.skuSns"  @keyup.enter.native="onChange" ></id-batch-query-input>
        </el-form-item>
        <el-form-item  prop="codeBars">
          <template slot="label">
            <el-tooltip class="item" effect="dark" content="多个商品条码之间使用“,”分隔" placement="top">
              <span>商品条码<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
          <id-batch-query-input v-model="searchQuery.codeBars"  @keyup.enter.native="onChange" ></id-batch-query-input>
        </el-form-item>
        <el-form-item label="商品品牌" prop="brandIds">
          <select-brand
            v-model="searchQuery.brandIds"
            multiple
          />
        </el-form-item>
        <el-form-item label="商品分类" prop="cateCode">
          <select-category
            v-model="searchQuery.cateCode"
          />
        </el-form-item>
        <el-form-item label="商品服务类型" prop="brandCategory">
          <el-select v-model="searchQuery.brandCategory" multiple >
            <el-option
              v-for="item in brandCategoryOptions" :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="spuCheckedStatus"  >
          <el-select v-model="searchQuery.spuCheckedStatus" clearable >
            <el-option label="未审核" :value="1"></el-option>
            <el-option label="审核中" :value="4"></el-option>
            <el-option label="审核通过" :value="2"></el-option>
            <el-option label="审核未通过" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item  label="规格状态" prop="isOnSale">
          <el-select v-model="searchQuery.isOnSale " clearable placeholder="全部" >
            <el-option label="已启用" :value="true"></el-option>   
            <el-option label="已禁用" :value="false"></el-option>
          </el-select>
       </el-form-item>

        <el-form-item  label="是否需上架" prop="isSpuNeedOnSale">
          <el-select v-model="searchQuery.isSpuNeedOnSale "  clearable placeholder="全部" >
            <el-option label="需上架" :value="true"></el-option>   
            <el-option label="无需上架" :value="false"></el-option>
          </el-select>
       </el-form-item>

        <el-form-item  label="是否有成本价" prop="existCostPrice">
          <el-select v-model="searchQuery.existCostPrice "  clearable placeholder="全部" >
            <el-option label="有成本价" :value="true"></el-option>   
            <el-option label="无成本价" :value="false"></el-option>
          </el-select>
       </el-form-item>

      </el-form>
    </the-search>

    <div class="pb8">
      <setting-cost-price v-permission-button="'edit'" class="ml10" :selectList="selectList" @afterSuccess="getTableData"  ></setting-cost-price>
      <el-button v-permission-button="'export'" class="ml10" type="primary"   @click="exportSku" >导出</el-button>
      <import-cost-price v-permission-button="'upload'" class="ml10" @afterSuccess="onChange" ></import-cost-price>
    </div>

    <el-table
       ref="spuTableData"
      :data="tableData"
      style="width: 100%;"
      border stripe
      size="mini"
      @selection-change="handleSelectionChange"
      >
      <el-table-column type="selection" width="40px"></el-table-column>
      <el-table-column label="序号" type="index"  width="50px"></el-table-column>
      <el-table-column label="商品图片"  min-width="75px">
        <template slot-scope="scope">
          <div class="row center-y">
            <el-popover placement="top" trigger="click">
              <img slot="reference" :src="scope.row.spuTitleImage || require('@/assets/images/logo.png')" style="max-width: 40px; max-height: 40px;">
              <el-image :src="scope.row.spuTitleImage || require('@/assets/images/logo.png')" style="max-width: 600px; max-height: 600px;"></el-image>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="skuSn" min-width="125px">
        <template slot="header">
          <el-tooltip class="item" effect="dark" content="NC编码" placement="top">
            <span>规格编码<i class="el-icon-info ml6"></i></span>
          </el-tooltip> 
        </template>
        <!-- <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.skuSn" :key="index">{{ item }}</div>
        </template> -->
      </el-table-column>
      <el-table-column label="商品条码" prop="codeBar" min-width="125px" >
      </el-table-column>
      <el-table-column label="分类" prop="spuCateName" width="100" ></el-table-column>
      <el-table-column label="品牌" prop="spuBrandName" width="110" ></el-table-column>
      <el-table-column label="商品名称" prop="spuName" width="250px" ></el-table-column>
      <el-table-column label="规格" width="150" >
        <template slot-scope="scope">
          <div v-if="scope.row.firstAtbKey " >{{ scope.row.firstAtbKey + ':'}} {{ scope.row.firstAtbValue }}</div>
          <div v-if="scope.row.secondAtbKey" >{{ scope.row.secondAtbKey + ':'}} {{ scope.row.secondAtbValue }}</div>
        </template>
      </el-table-column>
      <el-table-column  label="审核状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.spuCheckedStatus == 1">未审核</el-tag>
          <el-tag v-if="scope.row.spuCheckedStatus == 2">审核通过</el-tag>
          <el-tag v-if="scope.row.spuCheckedStatus == 3">审核不通过</el-tag>
          <el-tag v-if="scope.row.spuCheckedStatus == 4">审核中</el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="是否需上架" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.isSpuNeedOnSale">
            需上架
          </span>
          <span v-if="!scope.row.isSpuNeedOnSale">
            无需上架
          </span>
        </template>
      </el-table-column>
      <el-table-column  label="上架状态">
        <template slot-scope="scope">
          <span v-if="scope.row.isSpuOnSale">
            已发布
          </span>
          <span v-if="!scope.row.isSpuOnSale ">
            已下架
          </span>
        </template>
      </el-table-column>
      <el-table-column  label="规格状态"  >
        <template slot-scope="scope">
          <span v-if="scope.row.isOnSale">
            已启用
          </span>
          <span v-if="!scope.row.isOnSale">
            已禁用
          </span>
        </template>
      </el-table-column>
      <el-table-column label="成本价" prop="costPrice" width="80" fixed="right" ></el-table-column>

       <el-table-column label="修改人" prop="editorName" width="80" >
        <template slot-scope="scope">
          <div>{{ scope.row.editorName || scope.row.editor}}</div>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="updateDate" width="120" sortable >
        <template slot-scope="scope">
          <div v-if="scope.row.updateDate" >{{ scope.row.updateDate | formatDate('Y/M/D h:m') }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission-button="'viewLog'"  type="text" size="small" @click="preview(scope.row)">操作日志</el-button>
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

    <!-- 日志dialog -->
    <el-dialog
      title="成本价操作日志"
      :visible.sync="logDialog"
      @close="close"
      border
      close-on-press-escape
      close-on-click-modal>
      <el-table :data="logTableData" style="width: 100%" max-height="400">
        <el-table-column  prop="creatorName" label="操作人" width="140"></el-table-column>
        <el-table-column  prop="operationName" label="操作名称" width="140"></el-table-column>
        <el-table-column  label="操作时间" width="140">
          <template slot-scope="scope">
            <div>{{ scope.row.createDate | formatDate('Y/M/D h:m') }}</div>
          </template>
        </el-table-column>
        <el-table-column  fixed="right"  label="备注" width="400">
          <template slot-scope="scope" >
            <!-- ${scope.row.beforeBean} -->
            {{ "成本价：将{" + scope.row.beforeBean +"}改为{" + scope.row.afterBean + "}" }}
          </template>
        </el-table-column>
      </el-table>
      <the-pagination
        :pageIndex="logQuery.pageIndex"
        :pageSize="logQuery.pageSize"
        :total="logQuery.total"
        @onPageSizeChange="logTableSizeChange"
        @onPageIndexChange="logTableIndexChange"
      />
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="close" size="small" >取 消</el-button>
        <el-button type="primary" @click="onConfirm" size="small" :loading="loading">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import IdBatchQueryInput from '@/components/IdBatchQueryInput'
import ThePagination from '@/components/ThePagination'
import TheSearch from '@/components/TheSearch'
import SelectBrand from '@/components/SelectBrand'
import SelectCategory from '@/components/SelectCategory'
import { brandCategory } from "@/const/goods"
import SettingCostPrice from './setting-cost-price.vue'
import ImportCostPrice from './import-cost-price.vue'
import { formatDate } from '@/utils'
import FileSaver from 'file-saver'

import { getSkuCostPricePager, getModifyLogPages } from '@/api/goods'
import {   exportSkuCostPrice } from '@/api/excel'
export default {
  name: 'CostPrice',
  title: '商品成本价管理',
  components: { TheSearch, ThePagination, SelectBrand, SelectCategory, IdBatchQueryInput, SettingCostPrice, ImportCostPrice, },
  data() {
    return {
      brandCategoryOptions: brandCategory.properties,
      tableData: [],
      searchQuery: {
        skuIds: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        spuName: '',
        inIds: [],
        skuSns: [],
        codeBars: [],
        cateCode: '',
        brandCategory: [],
        status: '',
        existCostPrice: '',
        isSpuNeedOnSale: '',
        isOnSale: '',
        isSpuOnSale: '',
        isDelete: false,
        brandIds: [],
        spuCheckedStatus:'',
        orderStr: 'updateDate desc',
        searchDegree:100,
      },
      selectAllList: [], // 选中的行数据 item
      selectList: [], // 选中的item.id 注意分页选中

      logTableData: [],
      logDialog: false,
      logQuery: {
        pageSize: 10,
        pageIndex: 1,
        logType: 'updateGoodSkuCostPrice',
        systemType: 'goods',
        relationField: '',
        total: 0
      }
    }
  },
  computed: {
    saleStatus: {
      set(str) {
        if (str === 'all') {
          this.searchQuery.isSpuOnSale = ''
          this.onChange();
          return ;
        }
        this.searchQuery.isSpuOnSale = (str === 'release');
        this.onChange();
      },
      get() {
        if (this.searchQuery.isSpuOnSale === '') {
          return 'all';
        }
        return this.searchQuery.isSpuOnSale ? 'release' : 'unsale'
      }
    }
  },
  created() {
    this.getTableData();
  },
  methods: {
    // #region 查询相关
    getTableData() {
      this.$store.commit('SHOW_LOADING')
      getSkuCostPricePager(this.searchQuery).then(res => {
        this.searchQuery.total = Number(res.total)
        this.searchQuery.skuTotal = res.skuTotal || 0
        this.tableData = res.records || []
        this.reSelectSpu(this.selectList)
      }).finally(() => {
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    reSelectSpu(selectTempList){
      this.$nextTick(()=> {
        if(selectTempList&& selectTempList.length>0){
            this.tableData.forEach(item=> {
                selectTempList.forEach(item2 => {
                    if(item2===item.id){
                      this.$refs['spuTableData'].toggleRowSelection(item);
                    }
                });
              })
              selectTempList=[]
          }
      });
    },
    onChange() {
      this.searchQuery['pageIndex'] = 1
      this.selectAllList=[]
      this.selectList=[]
      this. getTableData()
    },
    onResetQuery() {
      this.$refs['searchQuery'].resetFields()
      this.searchQuery['searchDegree']=100
      this.onChange()
    },
    handleSelectionChange(e) {
      this.selectList = this.selectList.filter(v => !this.tableData.find(item => item.id === v )) // 非当前页的选中的id
      this.selectList = this.selectList.concat(e.map(v => v.id)); // 非当前页选中的id + 当前选中的id
      this.selectAllList = this.selectAllList.filter(v => !this.tableData.find(item => item.id === v.id ) );
      this.selectAllList = this.selectAllList.concat(e);
    },

    handleSizeChange(val) { // 每页条数改变时 
      this.searchQuery['pageSize'] = val
      this.searchQuery['pageIndex'] = 1
      this. getTableData()
    },
    handleCurrentChange(val) { // 页码改变时
      this.searchQuery['pageIndex'] = val
      this. getTableData()
    },
    // #endregion 查询结束

    // #region 导出
    exportSku() {
      let downloadTotal = this.selectAllList && this.selectAllList.length || this.searchQuery.total || 0
      if (!downloadTotal ) {
        this.$message.error('当前导出的数据为空')
        return;
      }
      this.$confirm(`当前待下载的商品数量：${downloadTotal}，是否确认下载？`, {
        type: 'warning'
      }).then(() => {
        this.doExport()
      }).catch(() => {
        return;
      })
      // exportSkuCostPrice(this.searchQuery)
    },
    doExport() {
      this.$store.commit('SHOW_LOADING')
      if (Array.isArray(this.selectList)) {
        this.searchQuery.skuIds = this.selectList;
      }
      exportSkuCostPrice(this.searchQuery).then((blob) => {
        let fileName = `商品成本价-${formatDate(new Date().getTime(), 'YMDhm')}`
        FileSaver.saveAs(blob, fileName+'.xlsx')
      }).finally(() => {
        this.searchQuery.skuIds = [];
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    // #endregion
  
    // #region 日志相关
    close() {
      this.logDialog = false;
      this.logTableData = [];
      this.logQuery.pageIndex = 1;
      this.logQuery.pageSize = 10;
    },
    preview(sku) {
      this.logQuery.relationField = `SKU::ID::${sku.id}`;
      this.getLogData();
      this.logDialog = true;
    },
    getLogData() {
      getModifyLogPages(this.logQuery)
        .then(res => {
          this.logTableData = res.records || [];
          this.logQuery.total = res.total || 0
        })
    },
    logTableSizeChange(e) {
      this.logQuery.pageIndex = 1;
      this.logQuery.pageSize = e;
      this.getLogData();
    },
    logTableIndexChange(e) {
      this.logQuery.pageIndex = e;
      this.getLogData();
    }
    // #endregion
  }
}
</script>

<style scoped lang="scss" >
.the-search-page {
  margin-bottom: 8px;
}

/deep/ .el-tabs__nav {
  background: #fff;
}

/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item {
  border-bottom: 1px solid #E4E7ED
}

/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
  border-bottom-color: #fff
}

/deep/ .el-tabs__header {
  margin: 0;
}
</style>