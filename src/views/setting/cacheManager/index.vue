<template>
  <div>
    <!-- 表格数据 -->
    <div class="col">
      <div class="align-self-start">
        <el-table
          id="table"
          :data="cacheList"
          border
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="area" label="缓存区域" width="250"></el-table-column>
          <el-table-column prop="name" label="缓存名称" width="250"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button v-permission-button="'refresh'" type="text" size="small" @click="flush(scope.row)">刷新</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CacheManager',
  components: {},
  data() {
    return {
      tableLoading: false,
      searchQuery: {},
      cacheList: [
        { area: '商品中心 - 一二级分类', key: 'BRAND', name: '品牌商品专区' },
        { area: '商品中心 - 一二级分类', key: 'ODM', name: 'ODM商品专区' },
        { area: '商品中心 - 一二级分类', key: 'JAPAN', name: '日本进口专区' },
        {
          area: '商品中心 - 一二级分类',
          key: 'CROSS_BORDER',
          name: '跨境购专区'
        },
        { area: '商品中心 - 一二级分类', key: 'ALL', name: '全部商品' },
        {
          area: '商品中心 - 一二级分类',
          key: 'BRAND_ALL_SPU',
          name: '全部商品有效品牌'
        },
        {
          area: '商品中心 - 用户信息',
          key: 'QYWX_ACCOUNT',
          name: '企业微信用户信息'
        }
      ] // 品牌列表
    }
  },
  created() {},
  computed: {},
  methods: {
    flush(data) {
      this.$confirm(`确定要刷新缓存“${data.name}”吗？`)
        .then(async () => {
          if (data.key === 'QYWX_ACCOUNT') {
            this.$put('/goods/setting/qywxUser/reflush')
              .then(() => {
                this.$message({
                  message: `缓存刷新成功`,
                  type: 'success'
                })
              })
              .catch(() => {
                //ajax请求已经处理了异常返回提示
              })
          } else {
            this.$delete('/goods/setting/clearWxNavCache/' + data.key)
              .then(() => {
                this.$message({
                  message: `缓存刷新成功`,
                  type: 'success'
                })
              })
              .catch(() => {
                //ajax请求已经处理了异常返回提示
              })
          }
        })
        .catch(() => {})
    }
  }
}
</script>
