<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="12" v-permission-button="'syncOutbill'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>出库单（同步）</span>
            <el-button style="float: right;" type="primary" size="mini" @click="syncOutbill">开始</el-button>
          </div>
          <div>
            <el-date-picker
              v-model="syncOutbillDateScope"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" v-permission-button="'statOutbill'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>出库单（统计）</span>
            <el-button style="float: right;" type="primary" size="mini" @click="statOutbill">开始</el-button>
          </div>
          <div>
            <el-date-picker
              v-model="statOutbillDateScope"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="12">
      <el-col :span="12" v-permission-button="'syncCgOrder'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>采购单（同步）</span>
            <el-button style="float: right;" type="primary" size="mini" @click="syncCgOrder">开始</el-button>
          </div>
          <div>
            <el-date-picker
              v-model="syncCgOrderDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" v-permission-button="'statCgOrder'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>采购单（供应商合作商品）</span>
            <el-button style="float: right;" type="primary" size="mini" @click="statCgOrder">开始</el-button>
          </div>
          <div>
            <el-date-picker
              v-model="statCgOrderDateScope"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider></el-divider>
  </div>
</template>

<script>
import { syncOutbill, statOutbill, syncCgOrder, statCgOrder } from '@/api/setting'

export default {
  name: 'ReportManager',
  components: {},
  data() {
    return {
      syncOutbillDateScope: [],
      statOutbillDateScope: [],
      syncCgOrderDate: '',
      statCgOrderDateScope: [],
    }
  },
  methods: {
    syncOutbill() {
      if (this.syncOutbillDateScope == null || this.syncOutbillDateScope.length != 2) {
        this.$message.warning('日期范围不能为空')
      } else {
        this.$confirm('确定开启任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            syncOutbill(this.syncOutbillDateScope).then((res) => {
              this.$message.success('任务开始')
            })
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    statOutbill() {
      if (this.statOutbillDateScope == null || this.statOutbillDateScope.length != 2) {
        this.$message.warning('日期范围不能为空')
      } else {
        this.$confirm('确定开启任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            statOutbill(this.statOutbillDateScope).then((res) => {
              this.$message.success('任务开始')
            })
          })
          .catch(() => {})
      }
    },
    syncCgOrder() {
      if (this.syncCgOrderDate == null || this.syncCgOrderDate == '') {
        this.$message.warning('日期不能为空')
      } else {
        this.$confirm('确定开启任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            syncCgOrder(this.syncCgOrderDate).then((res) => {
              this.$message.success('任务开始')
            })
          })
          .catch(() => {})
      }
    },
    statCgOrder() {
      if (this.statCgOrderDateScope == null || this.statCgOrderDateScope.length != 2) {
        this.$message.warning('日期范围不能为空')
      } else {
        this.$confirm('确定开启任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            statCgOrder(this.statCgOrderDateScope).then((res) => {
              this.$message.success('任务开始')
            })
          })
          .catch(() => {})
      }
    },
  },
  watch: {},
  mounted() {},
  created() {},
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>