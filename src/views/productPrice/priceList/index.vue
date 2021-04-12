<template>
  <div>
    <!-- 搜索区域 -->
    <the-search @onSearch="onSearch" @onReset="resetSearch">
      <el-form
        :model="searchQuery"
        ref="searchQuery"
        label-width="100px"
        inline
        size="mini">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="searchQuery.name" placeholder="输入搜索" @keyup.enter.native="onSearch" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item prop="skuSn">
          <template slot="label">
            <el-tooltip class="item" effect="dark" content="NC编码" placement="top">
              <span>规格编码<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
          <el-input v-model="searchQuery.skuSn" placeholder="输入搜索" @keyup.enter.native="onSearch" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="商品条码" prop="codeBar">
          <el-input v-model="searchQuery.codeBar" placeholder="“,”分隔，最多500个" @keyup.enter.native="onSearch" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brandId">
          <el-select v-model="searchQuery.brandId" multiple style="width: 250px;" @focus="onBrandSelectFocus" :loading="isLoadingBrandList">
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类" prop="cateCode">
          <!-- <el-select v-model="searchQuery.cateCode" style="width: 200px;" @focus="onCateSelectFocus" :loading="isLoadingCateList">
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select> -->
          <cate-cascader v-model="searchQuery.cateCode" ref="cascader"></cate-cascader>
        </el-form-item>
        <el-form-item label="价格清单模版" prop="title">
          <el-input v-model="searchQuery.title" placeholder="模版名称" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" prop="goodsType">
          <el-select v-model="searchQuery.goodsType">
            <el-option label="全部" value=""></el-option>
            <el-option label="ODM商品" value="1"></el-option>
            <el-option label="品牌商品" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </the-search>
    <div class="col">
      <div class="pb14">
        <span class="fs22 black">查询结果</span>
      </div>
      <el-button-group class="pb14">
        <el-button v-permission-button="'ceases'"  type="info" icon="el-icon-remove-outline" :loading="batchStatusLoading" @click="onBatchClick('disable')">停用</el-button>
        <el-button v-permission-button="'add'" type="primary" icon="el-icon-plus" :loading="batchDeleteLoading" @click="add">新增</el-button>
        <el-button v-permission-button="'delete'" type="danger" icon="el-icon-delete" :loading="batchDeleteLoading" @click="onBatchClick('delete')">删除</el-button>
        <!-- <el-button type="primary">批量导出</el-button>
        <el-button type="success">商品导入</el-button> -->
      </el-button-group>
      <div class="">
        <!-- 表格 -->
        <el-table
          :data="tableData"
          style="width: 100%;"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="index" :index="indexMethod" label="序号" width="60">
          </el-table-column>
          <el-table-column label="价格清单模版" prop="title">
          </el-table-column>
          <el-table-column label="模版编号" prop="id" width="100">
          </el-table-column>
          <el-table-column label="状态" prop="isEnable" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.isEnable ? '启用' : '停用' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="维护人" prop="modifyUserId" width="150">
          </el-table-column>
          <el-table-column label="上次维护时间" prop="modifyTimestamp" width="150">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.modifyTimestamp, '{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button v-permission-button="'cease'"  type="text" size="small" v-if="scope.row.isEnable" @click="disable(scope.row, scope.$index)">停用</el-button>
              <el-button v-permission-button="'start'" type="text" size="small" v-else @click="enable(scope.row, scope.$index)">启用</el-button>
              <el-button v-permission-button="'edit'" type="text" size="small" @click="edit(scope.row, scope.$index)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="align-l">
          <the-pagination
            :pageIndex="searchQuery.pageIndex"
            :pageSize="searchQuery.pageSize"
            :total="total"
            @onPageSizeChange="handleSizeChange"
            @onPageIndexChange="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TheSearch from '@/components/TheSearch'
  import ThePagination from '@/components/ThePagination'
  import CateCascader from '@/components/CateCascader'
  import { getMaxNumber, deepClone, parseTime } from '@/utils'

  export default {
    name: 'ProductPriceList',
    title: '商品价格清单',
    components: { TheSearch, ThePagination, CateCascader },
    data() {
      return {
        searchQuery: {
          pageIndex: 1,
          pageSize: 10,
          name: '',
          skuSn: '',
          codeBar: '',
          brandId: [],
          cateCode: '',
          title: '',
          goodsType: ''
        },
        brandList: [],  // 品牌列表
        cateList: [],  // 分类列表
        total: 0, // 总数
        tableData: [], // 表格数据
        isLoadingCateList: false, // 分类下拉框加载状态
        isLoadingBrandList: false, // 品牌下拉框加载状态
        selectionList: [], // 选中的行数据
        batchStatusLoading: false,
        batchDeleteLoading: false
      }
    },
    computed: {
      selectionIds() {
        let ids = this.selectionList.map(item => item.id)
        return ids
      }
    },
    created() {
      this.fetchPriceList()
    },
    mounted() {},
    methods: {
      async fetchPriceList() {
        this.$store.commit('SHOW_LOADING')
        await this.$post('/goods/priceList/getPriceListPager', this.searchQuery)
          .then(res => {
//            console.log(res)
            this.tableData = res.records
            this.total = Number(res.total)
          }).finally(() => {
            this.$store.commit('SHOW_LOADING', false)
          })
      },
      indexMethod(index) { // 序号
        return this.searchQuery.pageSize * (this.searchQuery.pageIndex - 1) + (index + 1)
      },
      // 搜索
      onSearch() {
//        console.log(this.searchQuery)
        this.searchQuery.pageIndex = 1
        this.fetchPriceList()
      },
      // 重置
      resetSearch() {
        this.$refs['searchQuery'].resetFields()
        // console.log(this.searchQuery)

        this.$refs['cascader'].clear()

        this.searchQuery.pageIndex = 1
        this.fetchPriceList()
      },
      //
      handleSizeChange(val) { // 每页条数改变时
        this.searchQuery['pageSize'] = val
        this.searchQuery['pageIndex'] = 1
        this.fetchPriceList()
      },
      handleCurrentChange(val) { // 页码改变时
        this.searchQuery['pageIndex'] = val
        this.fetchPriceList()
      },
      handleSelectionChange(selection) {
//        console.log(selection)
        this.selectionList = selection
//        console.log(this.selectionIds)
      },
      disable(data, index) {
        // 弹窗确认
        this.$confirm('是否确认停用？', {
          type: 'warning'
        }).then(() => {
          this.$store.commit('SHOW_LOADING')
          this.$put('/goods/priceList/disable/' + data.id)
          .then(async (res) => {
            this.$message.success('停用成功')
            this.fetchPriceList()
          }).finally(() => {
            this.$store.commit('SHOW_LOADING', false)
          })
        }).catch(() => {
        })
      },
      enable(data, index) {
        // 弹窗确认
        this.$confirm('是否确认启用？', {
          type: 'warning'
        }).then(() => {
          this.$store.commit('SHOW_LOADING')
          this.$put('/goods/priceList/enable/' + data.id)
          .then(async (res) => {
            this.$message.success('启用成功')
            this.fetchPriceList()
          }).finally(() => {
            this.$store.commit('SHOW_LOADING', false)
          })
        }).catch(() => {
        })
      },
      edit(data, index) {
        this.$router.push({
          name: 'ProductPriceMaintaining',
          query: {
            id: data.id
          }
        })
      },
      // 点击分类下拉框时
      onCateSelectFocus() {
        if (this.cateList.length) {
          this.isLoadingCateList = false
        } else {
          this.isLoadingCateList = true
          this.$post('/goods/category/getCategoryPager', {
            pageIndex: 1,
            pageSize: getMaxNumber(),
            cateLevel: '1'
          }).then(res => {
//             console.log('分类列表=>', res.list)
            this.cateList = [{id:0, name:'全部', code:''}].concat(res.list)
          }).finally(() => {
            this.isLoadingCateList = false
          })
        }
      },
      // 点击品牌下拉框时
      onBrandSelectFocus() {
        if (this.brandList.length) {
          this.isLoadingBrandList = false
        } else {
          this.isLoadingBrandList = true
          this.$post('/goods/brand/getBrandPager', {
            pageIndex: 1,
            pageSize: getMaxNumber()
          }).then(res => {
            // console.log('品牌列表=>', res.list)
            this.brandList = res.list
          }).finally(() => {
            this.isLoadingBrandList = false
          })
        }
      },
      // 批量操作：下架、删除
      onBatchClick(type) {
        if (!this.selectionIds.length) {
          this.$message('未选中数据！')
          return
        }
        let tips, url
        if (type === 'disable') {
          tips = '确定停用吗？'
          url = `/goods/priceList/disable/batch`
        } else if (type === 'delete') {
          tips = '确定删除吗？'
          url = `/goods/priceList/delete/batch`
        }
        // 弹窗确认
        this.$confirm(tips, {
          type: 'warning'
        }).then(() => {
          if (type === 'disable') {
            this.batchStatusLoading = true
          } else if (type === 'delete') {
            this.batchDeleteLoading = true
          }
          this.$post(url, this.selectionIds).then(res => {
            this.$message.success('操作成功')
            this.fetchPriceList()
          }).finally(() => {
            if (type === 'disable') {
              this.batchStatusLoading = false
            } else if (type === 'delete') {
              this.batchDeleteLoading = false
            }
          })
        }).catch(() => {
        })
      },
      parseTime,
      add() {
        this.$router.push({
          name: 'ProductPriceMaintaining',
          query: {
            id: 0
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .max-width{
    max-width: 1200px;
  }
</style>
<style lang="scss">
</style>
