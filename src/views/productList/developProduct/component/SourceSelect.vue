<template>
  <el-select :value="value" @change="onChange" :placeholder="placeholder"  :clearable="clearable">
    <el-option
      v-for="item in options"
      :key="item"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
import {getSources} from '@/api/goods'

export default {
  name: 'SourceSelect',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择来源'
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      options: []
    }
  },
  methods: {
    onChange(e) {
      this.$emit('input', e);
      this.$emit('change', e)
    }
  },
  created() {
    getSources()
      .then(res => {
        this.options = res;
      })
  }
}
</script>

<style>

</style>