<template>
  <div>
    <the-search @onSearch="onChange" @onReset="onResetQuery" @onExactSearch="onExactChange">
      <el-form :model="searchQuery" ref="searchQuery" label-width="100px" inline size="mini">
        <!-- <el-form-item label="商品服务类型" prop="brandCategory">
          <el-select
            v-model="searchQuery.brandCategory"
            @change="onChange"
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
        </el-form-item>-->
        <el-form-item label="选择时间">
          <el-date-picker
            v-model="searchQuery.times"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="开始日期" prop="startTime">
          <el-date-picker
            v-model="searchQuery.startTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :style="inputStyle"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期" prop="endTime">
          <el-date-picker
            v-model="searchQuery.endTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :style="inputStyle"
          ></el-date-picker>
        </el-form-item>-->
      </el-form>
    </the-search>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%;"
      border
      stripe
      size="mini"
      @selection-change="handleSelectionChange"
    >
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

      <el-table-column label="新增商品数量" prop="addCount" width="120">
        <template slot-scope="scope">
          <a
            style="text-decoration:underline"
            @click="getAddCountList(scope.row, scope.$index)"
          >{{scope.row.addCount}}</a>
        </template>
      </el-table-column>
      <el-table-column label="审核通过数量" prop="passCount" width="120"></el-table-column>
      <el-table-column label="审核不通过数量" prop="noPassCount" width="120"></el-table-column>
      <el-table-column label="新品上架数量" prop="newOnSaleCount" width="120">
        <template slot-scope="scope">
          <a
            style="text-decoration:underline"
            @click="getNewOnSaleCountList(scope.row, scope.$index)"
          >{{scope.row.newOnSaleCount}}</a>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="120" fixed="right">
     <template slot-scope="scope">
           <el-button type="warning" size="small" @click="exportSpuCheckedCount(scope.row, scope.$index)">导出</el-button>
      </template>
      </el-table-column>-->
    </el-table>

    <!-- 弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="whenClose" width="600px">
      <!-- 商品清单 -->
      <el-table :data="goodsList">
        <el-table-column label="商品名称" width="160">
          <template slot-scope="scope">
            <template >
               <span>{{ scope.row.name}}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="商品服务类型" prop="brandCategory" width="120">
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
        <el-table-column label="是否上架" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.isOnSale ?"是":"否" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="NC编码" width="160">
          <template slot-scope="scope">
            <template v-for="item in scope.row.skuSnList">
              <el-tag type="success" :key="item" v-if="item">{{ item }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="商品条码" width="160">
          <template slot-scope="scope">
            <template v-for="item in scope.row.codeBarList">
              <el-tag type="success" v-if="item" :key="item">{{ item }}</el-tag>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>


<script>
import TheSearch from "@/components/TheSearch";
import ProductList from "./ProductComponent";
import { brandCategory } from "@/const/goods";
import SelectBrand from "@/components/SelectBrand";
import ThePagination from "@/components/ThePagination";
import { exportCensusSpu as exportCensusSpuHttp } from "@/api/excel";
import {
  getSpuCheckedCountList,
  getNewOnSaleCountList as getNewOnSaleCountListHttp,
  getAddCountList as getAddCountListHttp,
} from "@/api/goods";
import { formatDate } from "@/utils";
import FileSaver from "file-saver";
import { baseURL, headersTokenKey } from "@/config";
import vuedraggable from "vuedraggable";

export default {
  name: "CheckedStatistic",
  title: "上架商品信息统计",
  // components: {ProductList },
  data() {
    return {
      dialogTitle: "未定义",
      goodsList: [],
      dialogVisible: false,
      searchQuery: {
        times: [],
      },
      brandCategoryOptions: brandCategory.properties,
      tableData: [], // 表格数据
      inputStyle: { width: "220px" },
    };
  },
  components: { TheSearch, SelectBrand, ThePagination },
  created() {
    this.fetchSpuList();
  },
  mounted() {},

  methods: {
    // 弹窗关闭
    whenClose() {
      this.goodsList = [];
      this.dialogVisible = false;
      this.dialogTitle === "未定义";
    },
    getAddCountList(item) {
      let params = this.searchQuery;
      if (this.searchQuery.times.length == 0) {
        this.$message.warning('请选择时间!')
        return;
      }
      params.startTime = this.searchQuery.times[0];
      params.endTime = this.searchQuery.times[1];
      params.brandCategory = item.brandCategory;
      getAddCountListHttp(params).then((res) => {
        console.log(res);
        this.goodsList = res;
        this.dialogVisible = true;
        this.dialogTitle = "新增商品-商品清单";
      });
    },
    getNewOnSaleCountList(item) {
      let params = this.searchQuery;
      if (this.searchQuery.times.length == 0) {
        this.$message.warning('请选择时间!')
        return;
      }
      params.startTime = this.searchQuery.times[0];
      params.endTime = this.searchQuery.times[1];
      params.brandCategory = item.brandCategory;
      getNewOnSaleCountListHttp(params).then((res) => {
        console.log(res);
        this.goodsList = res;
        this.dialogVisible = true;
        this.dialogTitle = "新品上架-商品清单";
      });
    },
    handleSelectionChange(selection) {
      console.log(selection);
      this.selectionList = selection;
      this.checkList = selection;
      console.log(this.selectionIds);
    },
    async fetchSpuList() {
      try {
        let params = this.searchQuery;
        if (this.searchQuery.times.length > 0) {
          params.startTime = this.searchQuery.times[0];
          params.endTime = this.searchQuery.times[1];
        }
        getSpuCheckedCountList(params).then((res) => {
          console.log(res);
          this.tableData = res;
        });
        return;
      } catch (error) {
        console.log("catch", error);
      } finally {
        this.$store.commit("SHOW_LOADING", false);
      }
    },

    onChange() {
      this.searchQuery.searchDegree = 50;
      this.fetchSpuList();
    },
    onResetQuery() {
      this.$refs["searchQuery"].resetFields();
      console.log(this.searchQuery);
      this.searchQuery["pageIndex"] = 1;
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
