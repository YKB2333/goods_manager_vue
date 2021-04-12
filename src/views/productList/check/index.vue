<template>
  <div>
    <div class="white-bg pt4 plr16">
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane name="CheckUncheck">
          <template #label>
            <span class="p8">待复核({{ reviewCount }})</span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="CheckRecord">
          <template #label>
            <span class="p8">修改记录</span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <keep-alive>
      <component :is="activeTab" @reviewCount="reviewCount = $event"></component>
    </keep-alive>
  </div>
</template>

<script>
import CheckUncheck from './component/check-uncheck.vue'
import CheckRecord from './component/check-record'
import { isCanReview } from '@/api/goods'

export default {
  components: { CheckUncheck, CheckRecord },
  name: 'ProductCheck',

  data() {
    return {
      activeTab: 'CheckUncheck',
      reviewCount: 1
    }
  },

  created() {
    this.getReviewCount()
  },

  methods: {
    getReviewCount() {
      isCanReview().then((res) => {
        this.reviewCount = res.count || 0
      })
    },

    handleClick(e) {
      // console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>