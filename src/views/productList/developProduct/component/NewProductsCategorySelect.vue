<template>
  <div style="display: inline-block;">
    <el-cascader 
      ref="elcascader"
      clearable
      v-model="bindValue"
      :disabled="disabled"
      :options="categoryOptions" 
      :props="{ value: 'id', label: 'name', expandTrigger: 'hover', checkStrictly: checkStrictly, emitPath: returnVal === 'code' }"
    />
    <!-- <el-button tabindex="-1" v-if="refresh" type="default" icon="el-icon-refresh" size="mini" @click="fetchAllCategoryList"></el-button> -->
  </div>
</template>

<script>
import { getNewProductsCategoryList } from '@/api/category'
import { translateDataToTree } from '@/utils'

export default {
  name: 'NewProductsCategorySelect',
  props: {
    checkStrictly: { // 是否可选择任一级
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    refresh: {
      type: Boolean,
      default: true,
    },
    value: {
      type: [String, Array, Number]
    },
    returnVal: {
      type: String,
      default: 'code'
    }
  },
  data() {
    return {
      // bindValue: [],
      categoryOptions: []
    }
  },
  computed: {
    bindValue: {
      get() {
        if (this.returnVal === 'code') {
          if (typeof this.value === 'string') {
            return this.value.split('-').filter(v => (v===0) || v).map(Number)
          }
        }
        return this.value;
      },
      set(val) {
        let res = '';
        if (this.returnVal === 'code') {
          if (Array.isArray(val)) {
            res = val.join('-');
            if (val.length !== 3) {
              if (res !== '') {
                res = res + '-';
              }
            }
          }
        } else {
          res = val;
        }
        this.$emit('input', res);
        this.$emit('change', res);
        if (this.$refs.elcascader) {
          this.$refs.elcascader.dropDownVisible = false
        }
      }
    }
  },
  created() {
    this.fetchAllCategoryList()
  },
  mounted() {},
  methods: {
    fetchAllCategoryList() {
      getNewProductsCategoryList({
        pageIndex: 1,
        pageSize: this.$maxNumber,
      }).then(res => {
        let allList = _.cloneDeep(res)
        this.categoryOptions = translateDataToTree(allList, 'superId')
      })
    },
  },
}
</script>

<style lang="scss" scoped>
</style>