<template>
  <el-select v-model="model" placeholder="请选择" filterable clearable>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import { getCompetitiveProductsList } from '@/api/goods'
export default {
  name: 'newProductSelect',
  data() {
    return {
      options: []
    }
  },
  props: {
    cateCode: {
      type: String,
      default: ''
    },
    value: {
      type:String,
      default: ''
    }
  },
  computed: {
    model: {
      set(e) {
        this.$emit('input', e)
      },
      get(){
        return this.value;
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      let pam = {
        cateCode: this.cateCode
      }
      getCompetitiveProductsList(pam)
        .then(res => {
          // hasQuestionnaire
          this.options = (res || []).map(v => {
            v.label = `${v.name}(${v.codeBar})`;
            v.value = v.id;
            return v;
          })
        })
    }
  }
}
</script>

<style>

</style>