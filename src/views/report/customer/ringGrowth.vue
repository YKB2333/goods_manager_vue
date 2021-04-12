<template>
  <div class="charts-container">
    <el-row type="flex">
      <el-col class="avtive">
        <el-card
          style="height:100%;"
          shadow="hover"
          :body-style="{height:'100%'}"
          @mouseenter.native="livingCard('channel')"
          v-loading="active=='channel'&&reportLoading"
        >
          <el-form style="margin-left:10%;" :inline="true" :model="query">
            <el-form-item label="客户渠道">
              <el-select v-model="query.qdCode">
                <el-option
                  v-for="item in channelList"
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
          <chart-line style="height:95%;width:100%;" :value="channelData" text="客户渠道环比"></chart-line>
        </el-card>
      </el-col>
      <el-col>
        <el-card
          style="height:100%;"
          shadow="hover"
          :body-style="{height:'100%'}"
          @mouseenter.native="livingCard('customer')"
          v-loading="active=='customer'&&reportLoading"
        >
          <el-form style="margin-left:10%;" :inline="true" :model="query">
            <el-form-item label="客户">
              <el-select
                v-model="query.csCode"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="customerLoading"
              >
                <el-option
                  v-for="item in customerList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="环比时间">
              <el-date-picker v-model="query.time" type="month" value-format="yyyy-MM"></el-date-picker>
            </el-form-item>
          </el-form>
          <chart-line style="height:95%;width:100%;" :value="customerData" text="客户环比"></chart-line>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getMaxNumber, deepClone, generatecustomerCascader } from "@/utils";
import { ChartLine } from "@/components/charts";
export default {
  name: "ReportCustomerRingGrowth",
  components: { ChartLine },
  data() {
    return {
      reportLoading: false,
      query: {
        qdCode: null,
        csCode: null,
        time: null
      },
      channelData: {},
      customerData: {},
      channelList: null,
      customerList: null,
      customerLoading: false,
      active: "channel"
    };
  },
  methods: {
    fetchReportData() {
      let params = this.$lodash.cloneDeep(this.query);
      switch (this.active) {
        case "channel":
          if (this.query.qdCode == null) return;
          this.reportLoading = true;
          this.$post(`report/customer/ringGrowth/${this.active}`, params)
            .then(res => {
              this.channelData = this.transToReportData(res);
            })
            .finally(() => {
              this.reportLoading = false;
            });
          break;
        case "customer":
          if (this.query.csCode == null) return;
          this.reportLoading = true;
          this.$post(`report/customer/ringGrowth/${this.active}`, params)
            .then(res => {
              this.customerData = this.transToReportData(res);
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
    fetchChannelData() {
      this.$get("/customer/channel/findAll")
      .then(res => {
        for (let i in res) {
          res[i].label = res[i].name;
          res[i].value = res[i].code;
        }
        this.channelList = res;
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.customerLoading = true;
        this.$get(`/report/sales/getCustomerInfo?name=${query}`)
          .then(res => {
            for (let i in res) {
              res[i].label = res[i].name;
              res[i].value = res[i].ncCode;
            }
            this.customerList = res;
          })
          .finally(() => {
            this.customerLoading = false;
          });
      } else {
        this.customerList = [];
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
      this.fetchChannelData();
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