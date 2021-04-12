<template>
  <div>
    <my-table v-model="query" :searchForm="searchForm" @change="onChange">
      <el-table
        :data="tableData"
        border size="small" stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column label="附件ID" prop="id" width="100"></el-table-column>
        <el-table-column label="附件名称" prop="fileName" min-width="200"></el-table-column>
        <el-table-column label="附件类型" prop="fileType" width="80"></el-table-column>
        <el-table-column label="附件大小" prop="size" width="120" :formatter="(row)=>$formatFileSize(row.size)"></el-table-column>
        <!-- <el-table-column label="spuID" prop="spuId"></el-table-column> -->
        <!-- <el-table-column label="品牌ID" prop="brandId"></el-table-column> -->
        <el-table-column label="是否受保护" prop="isProtect" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isProtect" type="success">是</el-tag>
            <el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTimestamp" width="140" :formatter="(row)=>$formatDate(row.createTimestamp, 'Y/M/D h:m')">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- 下载 -->
            <download :attaId="scope.row.id" :fileName="scope.row.fileName"></download>
            <el-button type="danger" size="mini" @click="onDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
  </div>
</template>

<script>
import MyTable from '@/components/Table'
import Download from '@/components/download'
import { getAttachmentList, deleteAtta } from '@/api/attachment'

export default {
  name: 'AttachmentIndex',
  components: { MyTable, Download },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 10,
        spuId: '',
        fileName: '',
        isProtect: null,
        total: 0
      },
      searchForm: [
        {
          key: 'fileName',
          label: '附件名称',
          type:'input'
        },
        // {
        //   key: 'spuId',
        //   label: 'spuID',
        //   type:'input'
        // },
        // {
        //   key: 'brandId',
        //   label: '品牌ID',
        //   type:'input'
        // },
        {
          key: 'isProtect',
          label: '是否受保护',
          options: [
            { label: '全部', value: null },
            { label: '是', value: true },
            { label: '否', value: false },
          ],
          type: "select"
        }
      ],
      tableData: [],
      tableLoading: false,
    }
  },
  computed: {},
  created() {
    this.fetchTableData()
  },
  mounted() {},
  methods: {
    fetchTableData() {
      this.tableLoading = true
      getAttachmentList(this.query).then(res => {
        // console.log(res)
        this.query.total = Number(res.total)
        this.tableData = res.records
      }).finally(() => {
        this.tableLoading = false
      })
    },
    onChange(val) {
      // console.log(val)
      // console.log(this.query)
      this.fetchTableData()
    },
    // 删除附件
    onDelete(id) {
      this.$confirm('确认删除该附件？', '提示', {
        type: 'warning'
      }).then(() => {
        deleteAtta(id).then(res => {
          this.$message.success('删除成功')
          this.fetchTableData()
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
