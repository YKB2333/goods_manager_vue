<template>
  <the-dialog width="80%" :closeOnClickModal="false" ref="dialog" :title="pageTitle">
    <el-table :data="logList" border stripe size="mini">
      
      <el-table-column label="操作时间" prop="createDate" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | formatDate('Y/M/D h:m') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作用户ID" prop="userId" width="200"></el-table-column>
            <el-table-column label="操作用户" prop="userName" width="200"></el-table-column>
      <el-table-column label="更改内容" prop="title">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column type="expand" label="更多">
        <template slot-scope="props">
          <el-form label-position="left" size="mini">
            <template v-if="isJsonObject(props.row.content)">
              <el-form-item v-for="(value, key, index) of JSON.parse(props.row.content)" :key="index" :label="key">
                <span>{{ value }}</span>
              </el-form-item>
            </template>
            <template v-else>
              <span>{{ props.row.content }}</span>
            </template>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <the-pagination
      :pageIndex="searchQuery.pageIndex"
      :pageSize="searchQuery.pageSize"
      :total="searchQuery.total"
      @onPageSizeChange="handleSizeChange"
      @onPageIndexChange="handleCurrentChange"
    />
  </the-dialog>
</template>

<script>
import TheDialog from '@/components/TheDialog'
import { getLogList } from '@/api/log'
import ThePagination from '@/components/ThePagination'

export default {
  name: 'LOG',
  components: { TheDialog, ThePagination },
  props: {
    logType: { // 1商品，2品牌
      type: String
    },
    relationKey: { // spuId或品牌ID
      type: Number
    }
  },
  data() {
    return {
      searchQuery: {
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'createDate desc',
        total: 0
      },
      logList: []
    }
  },
  computed: {
    pageTitle() {
      let arr = [
        { logType: '1', title: '商品操作日志' },
        { logType: '2', title: '品牌操作日志' }
      ]
      let result = ''
      arr.every(item => {
        if (item.logType === this.logType) {
          result = item.title
          return false
        } else {
          return true
        }
      })
      return result
    }
  },
  created() {},
  mounted() {},
  methods: {
    init() {
      this.$refs['dialog'].show()
      this.fetchTableData()
    },
    fetchTableData() {
      let params = _.cloneDeep(this.searchQuery)
      params['logType'] = this.logType
      params['relationKey'] = this.relationKey
      getLogList(params).then(res => {
        console.log('日志列表', res.list)
        this.logList = res.list
        this.searchQuery['total'] = res.count
      })
    },
    handleSizeChange(val) { // 每页条数改变时
      this.searchQuery['pageSize'] = val
      this.searchQuery['pageIndex'] = 1
      this.fetchTableData()
    },
    handleCurrentChange(val) { // 页码改变时
      this.searchQuery['pageIndex'] = val
      this.fetchTableData()
    },
    isJsonObject(val){
      try{
        return typeof JSON.parse(val) == 'object'
      }catch(err){

      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
