<template>
  <div>
    <el-input placeholder="请输入内容" v-model="v" @blur="toValue" @keyup.enter.native="toValue" >
      <id-batch-query v-model="v" slot="append"  @onConfirm="toValue" ></id-batch-query>
    </el-input>
  </div>
</template>

<script>
import idBatchQuery from '@/components/idBatchQuery'
import { isEmpty } from '@/utils'
export default {
  name: 'IdBatchQueryInput',
  components: { idBatchQuery },
  data() {
    return {
      v: '',
      isUpdateV: true,
    }
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
  },
  methods: {
    isEmpty,
    handleV(val) {
      if (typeof val === 'string') {
        return val.split(/[，.,\s\v\n\t\r]/).filter(item => !this.isEmpty(item))
      }
      return []
    },
    toValue(event) {
      this.isUpdateV = false;
      let arr = this.handleV(this.v);
      let isEmit = false;
      if (arr.length !== this.value.length) {
        isEmit = true;
      }
      arr.forEach((v, i) => {
        if (v !== (this.value || this.value[i])) {
          isEmit = true;
        }
      } )
      if (isEmit) {
        this.$emit('input', arr)
        this.$emit('change', arr)
      }
      setTimeout(() => {
        this.v = this.value.join(',\n')
      }, 10);
    }
  },
  watch: {
    value: {
      handler(val, oldVal) { // 外部改变绑定的数组时,需要更新v的值
        if (!this.isUpdateV) {
          this.isUpdateV = true;
          return;
        }
        if (Array.isArray(val)) {
          this.v = val.join(',\n')
        }
        this.v = '';
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
