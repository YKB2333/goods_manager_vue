<template>
  <div>
    <my-table v-model="query" :pagination="false" :searchForm="searchForm" @change="onChange">
      <!-- 表格数据 -->
      <el-row v-loading="tableLoading" :gutter="20" type="flex" justify="center">
        <el-col>
          <el-card header="商品服务类型排行榜" shadow="hover">
            <el-card
              v-for="(item,index) in brandCategoryData"
              :key="'brandCategory'+index"
            >{{item.rank | toOrdinalFilter}}{{item.brandCategory}} ￥{{item.amt | toThousandFilter}}</el-card>
          </el-card>
        </el-col>
        <el-col>
          <el-card header="商品品类排行榜" shadow="hover">
            <el-card
              v-for="(item,index) in categoryData"
              :key="'category'+index"
            >{{item.rank | toOrdinalFilter}}{{item.cateName}} ￥{{item.amt | toThousandFilter}}</el-card>
          </el-card>
        </el-col>
        <el-col>
          <el-card header="商品品牌排行榜" shadow="hover">
            <el-card
              v-for="(item,index) in brandData"
              :key="'brand'+index"
            >{{item.rank | toOrdinalFilter}}{{item.brandName}} ￥{{item.amt | toThousandFilter}}</el-card>
          </el-card>
        </el-col>
        <el-col>
          <el-card header="商品排行榜" shadow="hover">
            <el-card
              v-for="(item,index) in goodsData"
              :key="'goods'+index"
            >{{item.rank | toOrdinalFilter}}{{item.spuName}} ￥{{item.amt | toThousandFilter}}</el-card>
          </el-card>
        </el-col>
      </el-row>
    </my-table>
  </div>
</template>

<script>
import MyTable from "@/components/Table";
import { resolve, reject } from "q";
export default {
  name: "ReportGoodsSalesRank",
  components: { MyTable },
  data() {
    return {
      tableLoading: false,
      query: {
        time: [],
        pageIndex: 1,
        pageSize: 10
      },
      searchForm: [
        {
          key: "time",
          label: "时间",
          type: "date_picker",
          pickerType: "monthrange",
          clearable: false,
          format: "yyyy-MM",
          valueFormat: "timestamp",
          defaultTime:['00:00:00', '23:59:59'],
          startPlaceholder: "开始月份",
          endPlaceholder: "结束月份",
          pickerOptions: {
            shortcuts: [
              {
                text: "本月",
                onClick(picker) {
                  picker.$emit("pick", [new Date(), new Date()]);
                }
              },
              {
                text: "今年至今",
                onClick(picker) {
                  const end = new Date();
                  const start = new Date(new Date().getFullYear(), 0);
                  picker.$emit("pick", [start, end]);
                }
              },
              {
                text: "最近六个月",
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setMonth(start.getMonth() - 6);
                  picker.$emit("pick", [start, end]);
                }
              }
            ]
          }
        }
      ],
      brandCategoryData: {},
      categoryData: {},
      brandData: {},
      goodsData: {}
    };
  },
  computed: {},
  methods: {
    fetchRankData() {
      this.tableLoading = true;
      let params = this.$lodash.cloneDeep(this.query);
      params.startTime = params.time[0];
      params.endTime = params.time[1];
      let bcPromise = new Promise((resolve, reject) => {
        this.$post(`report/goods/brandCategoryRank`, params)
          .then(res => {
            this.brandCategoryData = res.records;
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
      let cPromise = new Promise((resolve, reject) => {
        this.$post(`report/goods/categoryRank`, params)
          .then(res => {
            this.categoryData = res.records;
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
      let bPromise = new Promise((resolve, reject) => {
        this.$post(`report/goods/brandRank`, params)
          .then(res => {
            this.brandData = res.records;
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
      let gPromise = new Promise((resolve, reject) => {
        this.$post(`report/goods/goodsRank`, params)
          .then(res => {
            this.goodsData = res.records;
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
      Promise.all([bcPromise, cPromise, bPromise, gPromise]).finally(() => {
        this.tableLoading = false;
      });
    },
    onChange() {
      this.fetchRankData();
    }
  },
  async created() {
    this.query.time[0] = this.$dayjs().startOf('month').valueOf();
    this.query.time[1] = this.$dayjs().endOf('month').valueOf();
    this.fetchRankData();
  }
};
</script>
