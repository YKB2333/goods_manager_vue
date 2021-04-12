<template>
  <div>
    <el-tabs  v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="已发布" name="release"></el-tab-pane>
      <el-tab-pane label="已下架" name="unsale"></el-tab-pane>
    </el-tabs>
    <product-list :productFlags="activeName"></product-list>
  </div>
</template>


<script>
import ProductList from './ProductComponent'

export default {
  name: 'ProductMeans',
  title: '商品资料',
  components: { ProductList },
  data() {
    return {
      activeName: 'all'
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {},
  methods: {
    handleClick() {}
  }
}
</script>

<style lang="scss" scoped>
// .el-tabs {
//   background: #fff;
// }

/deep/ .el-tabs__nav {
  background: #fff;
}

/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item {
  border-bottom: 1px solid #E4E7ED
}

/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
  border-bottom-color: #fff
}

/deep/ .el-tabs__header {
  margin: 0;
}
</style>
