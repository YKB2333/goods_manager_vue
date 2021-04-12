<template>
  <div>
    <el-cascader @visible-change="onCateSelectVisible" @change="onCateSelectChange" style="width: 250px;"
      :options="cascaderOptions"
      v-model="selectVal"
      :props="{ expandTrigger : expandTrigger, checkStrictly: checkStrictly }"
      :clearable="clearable">
    </el-cascader>
    <el-button type="primary" :loading="isLoadingCateList" v-if="showLoading&&isLoadingCateList">加载中</el-button>
  </div>
</template>

<script>
import { getMaxNumber, generateCategoryCascader } from '@/utils'

export default {
  name: 'CateCascader',
  components: {},
  props: {
    value: [String, Number],
    checkStrictly: { // true选择任意一级选项, false只能选择最后一级
      type: Boolean,
      default: true
    },
    cateList: {
      type: Array,
      default: () => {[]}
    },
    returnValue: {
      type: String,
      default: 'cateCode'
    },
    expandTrigger: {
      type: String,
      default: 'click'
    },
    showLoading:{
      type: Boolean,
      default: true
    },
    clearable:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLoadingCateList: false,
      cascaderOptions: [],
      selectVal: []
    }
  },
  computed: {},
  created() {},
  mounted() {
    // 已有分类列表, 显示当前分类
    if (this.cateList && this.cateList.length) {
      this.isLoadingCateList = false
      this.cascaderOptions = generateCategoryCascader(this.cateList, 'cateId')
      let arr = this.value.split('-') // 将字符串分割成数组
      this.selectVal = arr.map(Number) // 将数组里的字符串改为number
      console.log(this.selectVal)
    }
  },
  methods: {
    onCateSelectVisible(show) {
      if (show) {
        if (this.cascaderOptions.length) {
          this.isLoadingCateList = false
        } else {
          this.isLoadingCateList = true
          this.$post('/goods/category/getCategoryPager', {
            pageIndex: 1,
            pageSize: getMaxNumber(),
            isShow: true
          }).then(res => {
            // console.log('分类列表=>', res.list)
            let list = res.list
            this.cascaderOptions = generateCategoryCascader(list, this.returnValue)
            // console.log(this.cascaderOptions)
          }).finally(() => {
            this.isLoadingCateList = false
          })
        }
      }
    },
    onCateSelectChange(currentVal) {
      console.log(currentVal, this.returnValue)
      let result = ''
      if (currentVal.length) {
        if (this.returnValue === 'cateCode') {
          if (this.cateList && this.cateList.length) {
            result = currentVal.join('-')
          } else {
            if (currentVal.length === 3) {
              result = currentVal[currentVal.length - 1]
            } else {
              result = currentVal[currentVal.length - 1] + '-'
            }
          }
        } else if (this.returnValue === 'cateId') {
          result = Number(currentVal[currentVal.length - 1])
        }
      }
      console.log(result)
      this.$emit('input', result)
      this.$emit('change', result)
    },
    clear() {
      this.selectVal = []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
