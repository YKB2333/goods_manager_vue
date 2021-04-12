export default {
  data() {
    return {
      searchQuery: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      // 跨页勾选
      isSelectMore: true,
      tempSelectList: [],
      selectList: []
    }
  },

  created() {
    this.getList()
  },

  methods: {
    onChange() {
      this.searchQuery.pageIndex = 1
      this.searchQuery.pageSize = 10
      this.selectList = []
      this.getList()
    },

    onResetQuery() {
      this.$refs['searchQuery'].resetFields()
      this.onChange()
    },

    getList() {
      console.error('getList方法一定要实现')
    },

    handleSizeChange(e) {
      this.searchQuery.pageIndex = 1
      this.searchQuery.pageSize = e
      this.getList()
    },

    handleCurrentChange(e) {
      this.searchQuery.pageIndex = e
      this.getList()
    },

    reselect(list = _.cloneDeep(this.selectList)) {
      this.$nextTick(() => {
        if (!this.isSelectMore) {
          return
        }
        if (list.length) {
          this.$refs.table && this.$refs.table.toggleRowSelection({})
          list.forEach((v) => {
            const item = this.list.find((item) => item.id === v.id)
            if (item) {
              this.$refs.table && this.$refs.table.toggleRowSelection(item)
            }
          })
        }
      })
    },

    handleSelectionChange(selection) {
      this.tempSelectList = selection.filter((v) =>
        this.list.find((item) => item.id === v.id)
      )
      // 其他页的选中数据
      const ortherPageList = this.selectList.filter((v) =>
        this.list.every((item) => item.id !== v.id)
      )
      this.selectList = this.isSelectMore
        ? ortherPageList.concat(this.tempSelectList)
        : this.tempSelectList
    }
  }
}