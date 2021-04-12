<template>
  <div style="display: inline-block;">
    <el-select 
      v-model="brandValue"
      :filterable="search" 
      :multiple="multiple"
      :disabled="disabled"
      clearable
      @change="onChange">
      <el-option
        v-for="item in allBrandList"
        :key="item.id"
        :disabled="item.disabled"
        :label="item.name"
        :value="item[returnVal]"
      />
    </el-select>
    <el-button v-if="reflush" type="default" icon="el-icon-refresh" size="mini" @click="fetchAllBrandList"></el-button>
  </div>
</template>

<script>
import { getBrandList } from '@/api/brand'

export default {
  name: 'BrandSelect',
  props: {
    search: { // 搜索选项
      type: Boolean,
      default: true
    },
    reflush: { // 多选
      type: Boolean,
      default: true
    },
    multiple: { // 多选
      type: Boolean,
      default: false
    },
    returnVal: { // 返回值
      type: String,
      default: 'id'
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array],
      default: ''
    },
    isEnable: { // 是否展示启用品牌
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      allBrandList: [],
      brandValue: ''
    }
  },
  computed: {},
  created() {
    this.fetchAllBrandList()
  },
  methods: {
    onChange(val) {
      // console.log(val)
      this.$emit('input', val)
      this.$emit('change', val)
    },
    fetchAllBrandList() {
       this.allBrandList = []
      getBrandList({
        pageIndex: 1,
        pageSize: this.$maxNumber
      }).then(res => {
       
        if (this.isEnable) {
          this.allBrandList = res.list.map(item => {
            item.disabled = !item.isEnable
            if (!item.isEnable) item.name = `${item.name}(已禁用)`
            return item
          })
          this.allBrandList.sort((a, b) => b.isEnable - a.isEnable)
          return
        }
        this.allBrandList = res.list
      })
    }
  },
  watch: {
    value: {
      handler: function(val) {
        this.brandValue = val
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
