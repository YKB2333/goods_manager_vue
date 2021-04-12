<template>
  <div>
    <the-search @onSearch="onChange" @onReset="onResetQuery"  >
      <el-form class="form_wapper" :model="searchQuery" ref="searchQuery" label-width="100px" inline size="mini">
        <el-form-item prop="codeBar" label="市面竞品条码">
            <id-batch-query-input v-model="searchQuery.codeBar"  @keyup.enter.native="onChange" ></id-batch-query-input>
        </el-form-item>
        <el-form-item  label="市面竞品名称" prop="name">
          <el-input v-model="searchQuery.name" placeholder="请输入" clearable  @keyup.enter.native="onChange" ></el-input>
        </el-form-item>
        <el-form-item label="试用分类" prop="cateCode">
          <new-products-category-select v-model="searchQuery.cateCode"></new-products-category-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brandName">
          <el-input v-model="searchQuery.brandName" placeholder="请输入" clearable @keyup.enter.native="onChange" ></el-input>
        </el-form-item>
        <el-form-item prop="producePlace" label="产地">
          <country-select v-model="searchQuery.producePlace"  clearable checkStrictly />
        </el-form-item>
      </el-form>
    </the-search>
    <div class="pb8">
      <el-button  type="primary" v-permission-button="'add'"  @click="add" >新增</el-button>
      <el-button  type="primary" v-permission-button="'edit'"  @click="edit" >编辑</el-button>
      <el-button  type="primary" v-permission-button="'delete'"  @click="remove" >删除</el-button>
      <el-button v-permission-button="'export'" type="primary"   @click="exportProductInfo" >导出</el-button>
    </div>

    <el-table
       ref="spuTableData"
      :data="tableData"
      style="width: 100%;"
      border stripe
      size="mini"
      @selection-change="handleSelectionChange"
      >
      <el-table-column type="selection" width="40px"></el-table-column>
      <el-table-column label="序号" type="index"  width="50px"></el-table-column>
      <el-table-column label="商品图片"  min-width="75px">
        <template slot-scope="scope">
          <div class="row center-y">
            <el-popover placement="top" trigger="click">
              <img slot="reference" :src="scope.row.titleImage || require('@/assets/images/logo.png')" style="max-width: 40px; max-height: 40px;">
              <el-image :src="scope.row.titleImage || require('@/assets/images/logo.png')" style="max-width: 600px; max-height: 600px;"></el-image>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="市面竞品名称" width="250px" >
        <template slot-scope="scope">
          <el-button type="text" @click="view(scope.row)" style="user-select: unset;">
            {{ scope.row.name }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cateName" width="190px" ></el-table-column>
      <el-table-column label="品牌" prop="brandName"  ></el-table-column>
      <el-table-column label="产地" prop="producePlace" width="130"  ></el-table-column>
      <el-table-column label="创建人" prop="creatorName"  ></el-table-column>
      <el-table-column label="创建时间" prop="createDate" width="90" >
        <template slot-scope="scope">
          <div v-if="scope.row.createDate">{{ scope.row.createDate | formatDate('Y/M/D h:m') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="修改人" prop="editorName"  ></el-table-column>
      <el-table-column label="修改时间" prop="updateDate" width="90" >
        <template slot-scope="scope">
          <div v-if="scope.row.updateDate">{{ scope.row.updateDate | formatDate('Y/M/D h:m') }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button   type="text" size="small" @click="preview(scope.row)">操作日志</el-button>
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

    <!-- detail -->
    <el-dialog
      title="查看"
      :visible.sync="detailDialog"
      width="900px"
      >
      <div>
        <Detail :competitiveProducts="currentData" />
      </div>
      <div slot="footer">
        <el-button @click="detailDialog = false">取 消</el-button>
        <el-button type="primary" @click="detailDialog = false">确 定</el-button>
      </div>
    </el-dialog>
    

    <!-- 日志dialog -->
    <el-dialog
      title="成本价操作日志"
      :visible.sync="logDialog"
      @close="close"
      border
      close-on-press-escape
      close-on-click-modal>
      <el-table :data="logTableData" style="width: 100%" max-height="400">
        <el-table-column  prop="creatorName" label="操作人" width="140"></el-table-column>
        <el-table-column  prop="operationName" label="操作名称" width="140"></el-table-column>
        <el-table-column  label="操作时间" width="140">
          <template slot-scope="scope">
            <div>{{ scope.row.createDate | formatDate('Y/M/D h:m') }}</div>
          </template>
        </el-table-column>
        <el-table-column  fixed="right"  label="备注" width="400">
          <template slot-scope="scope" >
            <div v-for="item in scope.row.opt" :key="item" >
              {{item}}
            </div>
            <!-- ${scope.row.beforeBean} -->
            <!-- {{ "成本价：将{" + scope.row.beforeBean +"}改为{" + scope.row.afterBean + "}" }} -->
          </template>
        </el-table-column>
      </el-table>
      <the-pagination
        :pageIndex="logQuery.pageIndex"
        :pageSize="logQuery.pageSize"
        :total="logQuery.total"
        @onPageSizeChange="logTableSizeChange"
        @onPageIndexChange="logTableIndexChange"
      />
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="close" size="small" >取 消</el-button>
        <el-button type="primary" @click="onConfirm" size="small" :loading="loading">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import IdBatchQueryInput from '@/components/IdBatchQueryInput'
import ThePagination from '@/components/ThePagination'
import TheSearch from '@/components/TheSearch'
import CountrySelect from "@/components/CountrySelect";
import NewProductsCategorySelect from '../developProduct/component/NewProductsCategorySelect.vue'
import Detail from '@/views/productList/competitiveProducts/detail'
import { getCompetitiveProductstPager, getModifyLogPages, batchDeleteCompetitiveProducts, getCompetitiveProductsById } from '@/api/goods'
import { formatDate } from '@/utils'
import FileSaver from 'file-saver'

import { exportCompetitiveProducts } from '@/api/excel'

export default {
  name: 'competitiveProducts',
  title: '市面竞品资料',
  components: { TheSearch, ThePagination, IdBatchQueryInput, CountrySelect, NewProductsCategorySelect, Detail, },
  data() {
    return {
      detailDialog: false,
      currentData: null, // 当前查看的id
      tableData: [],
      searchQuery: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        brandName: '',
        cateCode: '',
        creator: '',
        codeBar: [],
        name: '',
        orderStr: 'updateDate desc',
        producePlace: '',
        source: '',
        status: '',
      },
      selectAllList: [], // 选中的行数据 item
      selectList: [], // 选中的item.id 注意分页选中

      // #region 日志
      logTableData: [],
      logDialog: false,
      logQuery: {
        pageSize: 10,
        pageIndex: 1,
        logType: 'goodsCompetitiveProducts',
        systemType: 'goods',
        relationField: '',
        total: 0
      }
      // #endregion
    }
  },
  created() {
    this.getTableData();
  },
  methods: {
    // #region 查询相关
    getTableData() {
      this.$store.commit('SHOW_LOADING')
      getCompetitiveProductstPager(this.searchQuery).then(res => {
        this.searchQuery.total = Number(res && res.total || 0)
        // this.searchQuery.skuTotal = res && res.skuTotal || 0
        this.tableData = res && res.records || []
        this.reSelectSpu(this.selectList)
      }).finally(() => {
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    reSelectSpu(selectTempList){
      this.$nextTick(()=> {
        if(selectTempList&& selectTempList.length>0){
            this.tableData.forEach(item=> {
                selectTempList.forEach(item2 => {
                    if(item2===item.id){
                      this.$refs['spuTableData'].toggleRowSelection(item);
                    }
                });
              })
              selectTempList=[]
          }
      });
    },
    onChange() {
      this.searchQuery['pageIndex'] = 1
      this.selectAllList=[]
      this.selectList=[]
      this. getTableData()
    },
    onResetQuery() {
      this.$refs['searchQuery'].resetFields()
      this.searchQuery['searchDegree']=100
      this.onChange()
    },
    handleSelectionChange(e) {
      this.selectList = this.selectList.filter(v => !this.tableData.find(item => item.id === v )) // 非当前页的选中的id
      this.selectList = this.selectList.concat(e.map(v => v.id)); // 非当前页选中的id + 当前选中的id
      this.selectAllList = this.selectAllList.filter(v => !this.tableData.find(item => item.id === v.id ) );
      this.selectAllList = this.selectAllList.concat(e);
    },

    handleSizeChange(val) { // 每页条数改变时 
      this.searchQuery['pageSize'] = val
      this.searchQuery['pageIndex'] = 1
      this. getTableData()
    },
    handleCurrentChange(val) { // 页码改变时
      this.searchQuery['pageIndex'] = val
      this. getTableData()
    },
    // #endregion 查询结束

    // #region 导出 
    exportProductInfo() {
      let downloadTotal =  this.searchQuery.total || 0
      if (!downloadTotal ) {
        this.$message.error('当前导出的数据为空')
        return;
      }
      let msg="当前无勾选商品，将下载全部市面竞品数据，是否确认下载？"
      if(this.selectAllList && this.selectAllList.length >0){
      msg="当前待下载的商品数量："+this.selectAllList.length+"，是否确认下载？"
      }
      this.$confirm(msg, {
        type: 'warning'
      }).then(() => {
        this.doExport()
      }).catch(() => {
        return;
      })
    },
    doExport() {
      this.$store.commit('SHOW_LOADING')
      if (Array.isArray(this.selectList)) {
        this.searchQuery.productsIds = this.selectList;
      }
      exportCompetitiveProducts(this.searchQuery).then((blob) => {
        let fileName = `市面竞品信息-${formatDate(new Date().getTime(), 'YMDhm')}`
        FileSaver.saveAs(blob, fileName+'.xlsx')
      }).finally(() => {
        this.searchQuery.skuIds = [];
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    // #endregion
  
    // #region 操作
    view(row) {
      this.currentData = row;
      console.log(row)
      this.$store.commit('SHOW_LOADING')
      getCompetitiveProductsById(row.id).then(res=>{
        this.detailDialog = true;
        this.currentData = res;
      }).finally(()=>{
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    add() {
      this.$router.push('/productlist/competitiveProducts/edit')
    },
    edit() {
      if (!Array.isArray(this.selectList) || this.selectList.length === 0 ) {
        this.$message.error('未选中数据进行操作！')
        return ;
      }
      if (!Array.isArray(this.selectList) || this.selectList.length !== 1) {
        this.$message.error('只能选择一条数据进行操作!')
        return ;
      }
      this.$router.push({
        path: '/productlist/competitiveProducts/edit',
        query: {
          id: this.selectList[0]
        }
      })
    },
    remove() {
      if (!Array.isArray(this.selectList) || this.selectList.length === 0 ) {
        this.$message.error('未选中数据进行操作！')
        return ;
      }

      let c = this.selectAllList.find(v => v.hasQuestionnaire)
      if (c) {
        this.$message.error(`${c.name}已关联问卷无法删除！`)
        return ;
      }
      this.$confirm('确认删除选中数据？', '提示', {
        type: 'warning'
      }).then(() => {
        batchDeleteCompetitiveProducts(this.selectList)
          .then(res => {
            this.$message.success('删除成功！')
            this.getTableData();
          })
      }).catch(() => {
      })
    },
    // #endregion

    // #region 日志相关
    close() {
      this.logDialog = false;
      this.logTableData = [];
      this.logQuery.pageIndex = 1;
      this.logQuery.pageSize = 10;
    },
    preview(data) {
      this.logQuery.relationField = data.id + '';
      this.getLogData();
      this.logDialog = true;
    },
    getLogData() {
      getModifyLogPages(this.logQuery)
        .then(res => {
          let arr;
          if (res && res.records) {
            arr = res.records.map(v => {
              let opt = (v.afterBean || '').replace(/};/g, '};>>>').split('>>>')
              return {
                ...v,
                opt
              }
            });
          }
          this.logTableData = arr || [];
          this.logQuery.total = res.total || 0;
        })
    },
    logTableSizeChange(e) {
      this.logQuery.pageIndex = 1;
      this.logQuery.pageSize = e;
      this.getLogData();
    },
    logTableIndexChange(e) {
      this.logQuery.pageIndex = e;
      this.getLogData();
    }
    // #endregion
  }
}
</script>

<style scoped lang="scss" >
</style>