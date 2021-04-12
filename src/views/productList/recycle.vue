<template>
  <div>
      <product-list :productFlags="'recycle'"></product-list>
  </div>
</template>


<script>
import ProductList from './ProductComponent'

export default {
  name: 'ProductRecycle',
  title: '回收站',
  components: { ProductList},
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {},
  methods: {
  },

}
</script>

<style lang="scss" scoped>

</style>
