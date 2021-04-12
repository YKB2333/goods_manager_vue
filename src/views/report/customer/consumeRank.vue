<template>
  <div>
    <my-table v-model="query" :pagination="false" :searchForm="searchForm" @change="onChange">
      <!-- 表格数据 -->
      <el-row v-loading="tableLoading" :gutter="20" type="flex" justify="center">
        <el-col>
          <el-card header="客户渠道排行榜" shadow="hover">
            <el-card
              v-for="(item,index) in channelData"
              :key="'channel'+index"
            >{{item.rank | toOrdinalFilter}}{{item.qdName}} ￥{{item.amt | toThousandFilter}}</el-card>
          </el-card>
        </el-col>
        <el-col>
          <el-card header="客户排行榜" shadow="hover">
            <el-card
              v-for="(item,index) in customerData"
              :key="'customer'+index"
            >{{item.rank | toOrdinalFilter}}{{item.csName}} ￥{{item.amt | toThousandFilter}}</el-card>
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
  name: "ReportCustomerConsumeRank",
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
      customerData: {},
      channelData: {}
    };
  },
  computed: {},
  methods: {
    fetchRankData() {
      this.tableLoading = true;
      let params = this.$lodash.cloneDeep(this.query);
      params.startTime = params.time[0];
      params.endTime = params.time[1];
      let csPromise = new Promise((resolve, reject) => {
        this.$post(`report/customer/customerRank`, params)
          .then(res => {
            this.customerData = res.records;
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
      let qdPromise = new Promise((resolve, reject) => {
        this.$post(`report/customer/channelRank`, params)
          .then(res => {
            this.channelData = res.records;
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
      Promise.all([csPromise, qdPromise]).finally(() => {
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
