<template>
  <div>
    <the-search
      @onSearch="onChange"
      @onReset="onResetQuery"
      @onExactSearch="onExactChange"
      :isExact="false"
    >
      <el-form :model="searchQuery" ref="searchQuery" label-width="100px" inline size="mini">
        <el-form-item label="商品ID" prop="inIds">
          <id-batch-query-input v-model="searchQuery.inIds"  @keyup.enter.native="onChange"></id-batch-query-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="searchQuery.name"
            placeholder="请输入"
            clearable
            @keyup.enter.native="onChange"
            style="width: 140px;"
          ></el-input>
        </el-form-item>
        <el-form-item prop="skuSns">
          <template slot="label">
            <el-tooltip class="item" effect="dark" content="NC编码;多个NC编码之间使用“,”分隔" placement="top">
              <span>规格编码<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
          <id-batch-query-input v-model="searchQuery.skuSns" @keyup.enter.native="onChange"></id-batch-query-input>
        </el-form-item>
        <el-form-item label="商品条码" prop="codeBars">
          <id-batch-query-input v-model="searchQuery.codeBars" @keyup.enter.native="onChange" ></id-batch-query-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brandId">
          <select-brand v-model="searchQuery.brandId" multiple  />
        </el-form-item>
        <el-form-item label="商品服务类型" prop="brandCategory">
          <el-select
            v-model="searchQuery.brandCategory"
            multiple
            style="width: 140px;"
          >
            <el-option
              v-for="item in brandCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </the-search>

    <div style="margin-top: -10px;margin-bottom: 10px" >
      <el-button v-permission-button="'exportCensusSpu'"  type="warning"  @click="exportCensusSpu">导出</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%;"
      border
      stripe
      size="mini"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column label="商品ID" prop="id" width="80"></el-table-column>
      <el-table-column label="商品名称" style="min-width: 250px;" min-width="280">
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
            <div class="pl10">
              <span>{{ scope.row.name }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="skuSn" width="150">
        <template slot="header">
          <el-tooltip class="item" effect="dark" content="NC编码" placement="top">
            <span>规格编码<i class="el-icon-info ml6"></i></span>
          </el-tooltip> 
        </template>
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.skuSn" :key="index">{{ item }}</div>
        </template>
      </el-table-column>
      <el-table-column label="商品条码" prop="codeBar" width="150">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.codeBar" :key="index">{{ item }}</div>
        </template>
      </el-table-column>

      <el-table-column label="品牌" prop="brandName" width="110"></el-table-column>
      <el-table-column label="商品服务类型" prop="brandCategory" width="100">
        <template slot-scope="scope">
          <template v-for="item in brandCategoryOptions">
            <el-tag
              type="success"
              :key="item.value"
              v-if="scope.row.brandCategory === item.value"
            >{{ item.label }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="是否上架" prop="publishStatus" width="80"></el-table-column>
      <el-table-column label="建档耗时" prop="filinTime" width="80"></el-table-column>
      <el-table-column label="上架耗时" prop="onSaleTime" width="80"></el-table-column>
      <el-table-column label="基本信息完整度" prop="spuDetailIntegrity" width="80"></el-table-column>
      <el-table-column label="SKU信息完整度" prop="skuDetailIntegrity" width="80"></el-table-column>
      <el-table-column label="主图数量" prop="masterImgCount" width="80"></el-table-column>
      <el-table-column label="详情页数量" prop="detailPageCount" width="80"></el-table-column>
      <el-table-column label="视频数量" prop="videoCount" width="80"></el-table-column>
      <el-table-column label="附件数量" prop="attaCount" width="80"></el-table-column>
      <el-table-column label="素材数量" prop="materialCount" width="80"></el-table-column>
      <el-table-column label="是否有商品说明书" prop="isInstructions" width="80"></el-table-column>
      <el-table-column label="创建人" prop="creatorName" width="80">
        <template slot-scope="scope">
          <div>{{ scope.row.creatorName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate" width="120" sortable>
        <template slot-scope="scope">
          <div>{{ scope.row.createDate | formatDate('Y/M/D h:m') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="修改人" prop="editorName" width="80"></el-table-column>
      <el-table-column label="修改时间" prop="updateDate" width="120" sortable>
        <template slot-scope="scope">
          <div>{{ scope.row.updateDate | formatDate('Y/M/D h:m') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission-button="'viewDetails'" type="text" size="small" @click="preview(scope.row, scope.$index)">查看详情</el-button>
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
  </div>
</template>


<script>
import TheSearch from "@/components/TheSearch";
import ProductList from "./ProductComponent";
import { brandCategory } from "@/const/goods";
import SelectBrand from "@/components/SelectBrand";
import ThePagination from "@/components/ThePagination";
import { exportCensusSpu as exportCensusSpuHttp } from '@/api/excel';
import {  formatDate } from '@/utils';
import FileSaver from 'file-saver';
import { baseURL, headersTokenKey } from '@/config'
import vuedraggable from "vuedraggable";
import idBatchQuery from '@/components/idBatchQuery'
import idBatchQueryInput from '@/components/IdBatchQueryInput'

export default {
  name: "OnSaleStatistic",
  title: "上架商品信息统计",
  // components: {ProductList },
  data() {
    return {
      skuSn:null,
      codeBar:null,
      searchQuery: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        id: "", //商品ID
        name: "", //商品名称
        skuSns: [], //规格编码
        codeBars: [], //商品条码
        brandCategory: [], //商品服务类型
        inIds:[], // 商品id查询
        orderStr: "updateDate desc",
        brandId: [], //品牌
        searchDegree:100
      },
      brandCategoryOptions: brandCategory.properties,
      tableData: [], // 表格数据
    };
  },
  components: { TheSearch, SelectBrand, ThePagination, idBatchQuery, idBatchQueryInput },
  created() {
    this.fetchSpuList();
  },
  mounted() {},
  methods: {
     // 导出
    exportCensusSpu(){
      var start = new Date().getTime();
      this.$store.commit('SHOW_LOADING')
      let params = _.cloneDeep(this.searchQuery)
      exportCensusSpuHttp(params)
      .then(blob => {
        console.info(blob)
        let fileName = `上架商品信息统计表${formatDate(new Date().getTime(), 'Y-M-D h:m')}`
        FileSaver.saveAs(blob, fileName+'.xlsx')
        var end = new Date().getTime();
        this.$message.success('导出成功!耗时' + ((end - start)/1000)+ '秒')
        })
      .finally(()=>{
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    // 预览
    preview(data, index) {
      let previewPage = this.$instantCompt(
        require("./maintaining/Preview").default,
        {
          dialogWidth: "80%",
        }
      );
      previewPage.init(data.id);
    },
    handleCurrentChange(val) {
      // 页码改变时
      this.searchQuery["pageIndex"] = val;
      this.onChange();
    },
    handleSizeChange(val) {
      // 每页条数改变时
      this.searchQuery["pageSize"] = val;
      this.searchQuery["pageIndex"] = 1;
      this.onChange();
    },
    handleSelectionChange(selection) {
      console.log(selection);
      this.selectionList = selection;
      this.checkList = selection;
      console.log(this.selectionIds);
    },
    async fetchSpuList() {
      try {
        this.$store.commit("SHOW_LOADING");
        let res = await this.fetchSpuPager();
        this.searchQuery.total = Number(res.total); // 总条数
        this.searchQuery.skuTotal = res.skuTotal || 0;
        let spuList = res.records;
         this.tableData = spuList;
        // if (spuList && spuList.length) {
        //   let spuIds = spuList.map((item) => item.id); // 获取品牌id数组
        //   this.tableData = await this.fetchAttaCounts(spuList, spuIds);
        // } else {
        //   this.tableData = [];
        // }
        console.log("---------------");
        console.log(this.tableData);
      } catch (error) {
        console.log("catch", error);
      } finally {
        this.$store.commit("SHOW_LOADING", false);
      }
    },
    // 获取spu列表
    fetchSpuPager() {
      return new Promise((resolve, reject) => {
        // if(this.searchQuery.id){
        //    var idStr = this.searchQuery.id;
        //     if(idStr.indexOf(",") > 0){
        //        this.searchQuery.inIds= idStr.split(",");
        //     }else{
        //        this.searchQuery.inIds.push(idStr);
        //     }
        // }

        let params = _.cloneDeep(this.searchQuery);

        if(Array.isArray(params.inIds)){
          for(let id of params.inIds){
            if(isNaN(id)){
              this.$message.error(`“${id}”非商品ID`)
              reject(error)
              return
            }
          }
        }
        // if(typeof this.skuSn === 'string' ){
        //   params.skuSns = this.skuSn.split(/[，.,\s\v\n\t\r]/).filter(item => !!item)
        // }
        // if(typeof this.codeBar === 'string' ){
        //   params.codeBars = this.codeBar.split(/[，.,\s\v\n\t\r]/).filter(item => !!item)
        // }
        // this.searchQuery.id = (params.inIds || []).join(',')
        // this.skuSn = (params.skuSns || []).join(',')
        // this.codeBar = (params.codeBars || []).join(',')
        this.$post("/goods/spu/supExportList", params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取附件数量
    fetchAttaCounts(list, spuIds) {
      return new Promise((resolve, reject) => {
        //获取附件数量
        this.$post("/attachment/getCountBySpuId", spuIds)
          .then((res) => {
            list.forEach((spu, index) => {
              res.forEach((json, i) => {
                if (spu.id == json.spuId) spu.attaCount = json.count;
              });
            });
            resolve(list);
          })
          .catch((error) => {
            this.tableData = list;
            reject();
          });
      });
    },
    onChange() {
      this.searchQuery['pageIndex'] = 1
      // this.searchQuery.codeBars=[]
      // this.searchQuery.skuSns=[]
      // if(this.codeBar&&this.codeBar!=''){
      //     this.searchQuery.codeBars.push(this.codeBar)
      // }
      // if(this.skuSn&&this.skuSn!=''){
      //    this.searchQuery.skuSns.push(this.skuSn)
      // }
      this.fetchSpuList();
    },
    onResetQuery() {
      this.$refs["searchQuery"].resetFields();
      console.log(this.searchQuery);
      this.searchQuery["pageIndex"] = 1;
      this.codeBar=null
      this.skuSn=null
      this.onChange();
    },
    onExactChange() {
      this.searchQuery.searchDegree = 100;
      this.fetchSpuList();
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
