<template>
  <div class="charts-container">
    <el-row type="flex">
      <el-col class="avtive">
        <el-card
          style="height:100%;"
          shadow="hover"
          :body-style="{height:'100%'}"
          @mouseenter.native="livingCard('brandCategory')"
          v-loading="active=='brandCategory'&&reportLoading"
        >
          <el-form style="margin-left:10%;" :inline="true" :model="query">
            <el-form-item label="商品服务类型">
              <el-select v-model="query.brandCategory">
                <el-option
                  v-for="item in brandCategoryList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="环比时间">
              <el-date-picker v-model="query.time" type="month" value-format="yyyy-MM"></el-date-picker>
            </el-form-item>
          </el-form>
          <chart-line style="height:95%;width:100%;" :value="brandCategoryData" text="商品服务类型环比"></chart-line>
        </el-card>
      </el-col>
      <el-col>
        <el-card
          style="height:100%;"
          shadow="hover"
          :body-style="{height:'100%'}"
          @mouseenter.native="livingCard('category')"
          v-loading="active=='category'&&reportLoading"
        >
          <el-form style="margin-left:10%;" :inline="true" :model="query">
            <el-form-item label="商品品类">
              <cate-cascader
                v-model="query.cateCode"
                ref="cascader"
                expandTrigger="hover"
                :showLoading="false"
                :clearable="false"
              ></cate-cascader>
            </el-form-item>
            <el-form-item label="环比时间">
              <el-date-picker v-model="query.time" type="month" value-format="yyyy-MM"></el-date-picker>
            </el-form-item>
          </el-form>
          <chart-line style="height:95%;width:100%;" :value="categoryData" text="商品品类环比"></chart-line>
        </el-card>
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col>
        <el-card
          style="height:100%;"
          shadow="hover"
          :body-style="{height:'100%'}"
          @mouseenter.native="livingCard('brand')"
          v-loading="active=='brand'&&reportLoading"
        >
          <el-form style="margin-left:10%;" :inline="true" :model="query">
            <el-form-item label="商品品牌">
              <el-select v-model="query.brandId">
                <el-option
                  v-for="brand in brandList"
                  :key="brand.value"
                  :value="brand.value"
                  :label="brand.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="环比时间">
              <el-date-picker v-model="query.time" type="month" value-format="yyyy-MM"></el-date-picker>
            </el-form-item>
          </el-form>
          <chart-line style="height:95%;width:100%;" :value="brandData" text="商品品牌环比"></chart-line>
        </el-card>
      </el-col>
      <el-col>
        <el-card
          style="height:100%;"
          shadow="hover"
          :body-style="{height:'100%'}"
          @mouseenter.native="livingCard('goods')"
          v-loading="active=='goods'&&reportLoading"
        >
          <el-form style="margin-left:10%;" :inline="true" :model="query">
            <el-form-item label="商品">
              <el-select
                v-model="query.spuId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="spuLoading"
              >
                <el-option
                  v-for="item in spuList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <el-row type="flex" align="middle">
                    <el-image style="width: 30px; height: 30px" :src="item.img"></el-image>
                    {{item.label}}
                  </el-row>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="环比时间">
              <el-date-picker v-model="query.time" type="month"></el-date-picker>
            </el-form-item>
          </el-form>
          <chart-line style="height:95%;width:100%;" :value="goodsData" text="商品环比"></chart-line>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getMaxNumber, deepClone, generateCategoryCascader } from "@/utils";
import { brandCategory } from "@/const/goods";
import { ChartLine } from "@/components/charts";
import CateCascader from "@/components/CateCascader";
export default {
  name: "ReportGoodsRingGrowth",
  components: { ChartLine, CateCascader },
  data() {
    return {
      reportLoading: false,
      query: {
        brandCategory: null,
        brandId: null,
        cateCode: null,
        spuId: null,
        time: null
      },
      brandCategoryData: {},
      brandData: {},
      categoryData: {},
      goodsData: {},
      cascaderOptions: null,
      brandCategoryList: brandCategory.properties,
      brandList: null,
      spuName: null,
      spuList: null,
      spuLoading: false,
      active: "brandCategory"
    };
  },
  methods: {
    fetchReportData() {
      let params = this.$lodash.cloneDeep(this.query);
      switch (this.active) {
        case "brandCategory":
          if (this.query.brandCategory == null) return;
          this.reportLoading = true;
          this.$post(`report/goods/ringGrowth/${this.active}`, params)
            .then(res => {
              this.brandCategoryData = this.transToReportData(res);
            })
            .finally(() => {
              this.reportLoading = false;
            });
          break;
        case "brand":
          if (this.query.brandId == null) return;
          this.reportLoading = true;
          this.$post(`report/goods/ringGrowth/${this.active}`, params)
            .then(res => {
              this.brandData = this.transToReportData(res);
            })
            .finally(() => {
              this.reportLoading = false;
            });
          break;
        case "category":
          if (this.query.cateCode == null) return;
          this.reportLoading = true;
          this.$post(`report/goods/ringGrowth/${this.active}`, params)
            .then(res => {
              this.categoryData = this.transToReportData(res);
            })
            .finally(() => {
              this.reportLoading = false;
            });
          break;
        case "goods":
          if (this.query.spuId == null) return;
          this.reportLoading = true;
          this.$post(`report/goods/ringGrowth/${this.active}`, params)
            .then(res => {
              this.goodsData = this.transToReportData(res);
            })
            .finally(() => {
              this.reportLoading = false;
            });
          break;
      }
    },
    transToReportData(res) {
      let tmpData = {};
      res.reverse().forEach(e => {
        tmpData[e.date] = e.amt;
      });
      return tmpData;
    },
    livingCard(value) {
      this.active = value;
    },
    onChange() {
      this.fetchReportData();
    },
    // 加载品牌下拉框数据
    fetchBrandData() {
      this.$post("/goods/brand/getBrandPager", {
        pageIndex: 1,
        pageSize: getMaxNumber(),
        isEnable: true
      }).then(res => {
        for (let i in res.list) {
          res.list[i].label = res.list[i].name;
          res.list[i].value = String(res.list[i].id);
        }
        this.brandList = res.list;
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.spuLoading = true;
        this.$get(`/report/sales/getSpuInfo?name=${query}`)
          .then(res => {
            for (let i in res) {
              res[i].label = res[i].name;
              res[i].value = String(res[i].id);
              res[i].img = res[i].titleImage;
            }
            this.spuList = res;
          })
          .finally(() => {
            this.spuLoading = false;
          });
      } else {
        this.spuList = [];
      }
    }
  },
  watch: {
    query: {
      handler(newValue, oldValue) {
        this.onChange();
      },
      deep: true
    }
  },
  mounted() {
    // 判断有没有值
    this.$nextTick(() => {
      this.fetchBrandData();
    });
  },
  async created() {
    this.query.time = this.$dayjs()
      .subtract(1, "month")
      .format("YYYY-MM");
  }
};
</script>
<style lang="scss" scoped>
.charts-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  > div {
    height: 50%;
    width: 100%;
    > div {
      padding: 10px;
    }
  }
}
</style>