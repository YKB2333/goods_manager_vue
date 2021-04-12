<template>
  <el-popover placement="right" trigger="hover" @show="onHoverCheckedStatus(id)">
    <div class="pr10">
      <div class="fw600 pl8 pb8 mb10" style="border-bottom: 1px solid #dcdfe6">
        审批日志
        <span class="fs12 pl4 fw400" v-if="requestId">(流程ID:{{requestId}})</span>
      </div>
      <div>
        <el-timeline v-loading="isLoading">
          <div v-if="list && list.length>0">
            <el-timeline-item
              v-for="(activity, index) in list"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
              placement="top"
            >
              <div class="row center-y">
                <div class="mr8" @click="open" style="cursor:pointer;">{{ activity.content }}</div>
                <img class="w22 h6 mr8" :src="require('@/assets/images/next.png')" />
                <div>{{ activity.receivedPersons }}</div>
              </div>
              <div
                v-if="activity.remark"
                class="fs12 mt6"
                style="color: #909399;"
              >{{ activity.remark }}</div>
            </el-timeline-item>
          </div>
          <div v-else>暂无数据</div>
        </el-timeline>
      </div>
    </div>
    <div slot="reference">
      <slot></slot>
    </div>
  </el-popover>
</template>

<script>
export default {
  name: 'ApproveTimeline',
  props: {
    id: {
      type: Number,
      required: true
    },
    list: {
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    requestId: {
      type: String
    }
  },
  data() {
    return {}
  },
  methods: {
    onHoverCheckedStatus(id) {
      this.$emit('hoverCheckedStatus', id)
    },
    open() {
      window.open(this.$config.oaURL)
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-timeline {
  padding: 8px 8px 0;
}
</style>
