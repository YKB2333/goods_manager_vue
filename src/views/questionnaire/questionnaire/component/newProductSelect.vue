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
import { getNewProductList } from '@/api/goods'
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
      getNewProductList(pam)
        .then(res => {
          // hasQuestionnaire
          this.options = (res || []).filter(v => !v.hasQuestionnaire).map(v => {
            v.label = `${v.name}(${v.formulaId})`;
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