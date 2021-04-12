<template>
  <div class="price-maintaining-page">
    <h4>基本信息</h4>
    <div>
      <el-form
        :rules="rules"
        :model="priceListData"
        ref="priceListData"
        label-width="100px"
        size="mini">
        <div class="row max-width">
          <div class="flex-1">
            <el-form-item v-if="priceListData" label="模版名称" prop="title">
              <el-input v-model="priceListData.title" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-if="priceListData" label="维护人" prop="modifyUserId">
              <el-input v-model="priceListData.modifyUserId" placeholder="请输入" :readonly=true></el-input>
            </el-form-item>
          </div>
          <div class="flex-1">
            <el-form-item v-if="priceListData" label="状态" prop="isEnable">
              <el-select v-model="priceListData.isEnable">
                <el-option label="启用" :value="true"></el-option>
                <el-option label="禁用" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="priceListData" label="维护时间" prop="modifyTimestamp">
              <el-input v-model="modifyDate" placeholder="请输入" readonly class="w200"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row max-width">
          <el-form-item v-if="priceListData" label="备注" prop="remark">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="priceListData.remark" class="w400"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <template v-if="priceListId > 0">
      <!-- priceListItem列表 -->
      <h4>基础价格信息</h4>
      <el-button style="margin-left: 20px;" type="primary" icon="el-icon-plus" size="small" round @click="openSpuDialog">添加</el-button>
      <el-button style="margin-left: 20px;" type="danger" icon="el-icon-delete" size="small" round @click="onBatchRemovePriceListItem">移除</el-button>
      <el-table
        :loading="priceListItemLoading"
        class="mt20"
        :data="priceListItemList"
        @selection-change="priceListItemHandleSelectionChange">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column label="序号" width="60">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品条码" prop="codeBar" width="120">
        </el-table-column>
        <el-table-column label="商品分类" prop="cateName" width="120">
        </el-table-column>
        <el-table-column label="商品信息" prop="name">
          <template slot-scope="scope">
            <p>
              <span>{{ scope.row.skuSn }}</span>
            </p>
            <p>
              <span>{{ scope.row.name }}</span>
            </p>
            <!--<span>{{ '(' + scope.row.skuId + ')' + scope.row.name }}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="品牌" prop="brandName" width="100">
        </el-table-column>
        <el-table-column label="状态" prop="isEnable" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.isEnable ? '启用' : '停用' }}</span>
          </template>
        </el-table-column>
        <!--
        <el-table-column label="成本价" prop="costPrice" width="90">
          <template slot-scope="scope">
            <el-input placeholder="请输入成本价" v-model="scope.row.costPrice"></el-input>
          </template>
        </el-table-column>
        -->
        <el-table-column label="一级分销建议价" prop="distributionPriceOne" width="90">
          <template slot-scope="scope">
            <el-input placeholder="请输入一级分销建议价" v-model="scope.row.distributionPriceOne"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="二级分销建议价" prop="distributionPriceTwo" width="90">
          <template slot-scope="scope">
            <el-input placeholder="请输入二级分销建议价" v-model="scope.row.distributionPriceTwo"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="三级分销建议价" prop="distributionPriceThree" width="90">
          <template slot-scope="scope">
            <el-input placeholder="请输入三级分销建议价" v-model="scope.row.distributionPriceThree"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="建议零售价" prop="msrp" width="90">
          <template slot-scope="scope">
            <el-input placeholder="请输入建议零售价" v-model="scope.row.msrp"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="savePriceListItem(scope.row, scope.$index)">保存</el-button>
            <el-button type="text" size="small" @click="removePriceListItem(scope.row, scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <the-pagination style="text-align: right;"
        :pageIndex="priceListItemListQuery.pageIndex"
        :pageSize="priceListItemListQuery.pageSize"
        :total="priceListItemListTotal"
        @onPageSizeChange="handleSizeChangePriceListItemList"
        @onPageIndexChange="handleCurrentChangePriceListItemList"
      />
      <!-- 弹窗 -->
      <el-dialog :visible.sync="dialogVisible" width="1000px" center :show-close="true" :close-on-click-modal="false" :before-close="clearSpuData"
        custom-class="dialog-class">
        <!-- 搜索区域 -->
        <the-search @onSearch="onSearch" @onReset="resetSearch">
          <el-form
            :model="searchQuery"
            ref="searchQuery"
            inline
            size="mini">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="searchQuery.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="skuSn">
              <template slot="label">
                <el-tooltip class="item" effect="dark" content="NC编码" placement="top">
                  <span>规格编码<i class="el-icon-info ml6"></i></span>
                </el-tooltip> 
              </template>
              <el-input v-model="searchQuery.skuSn" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="商品条码" prop="codeBar">
              <el-input v-model="searchQuery.codeBar" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="品牌" prop="brandId">
              <el-select v-model="searchQuery.brandId" multiple @focus="onBrandSelectFocus" :loading="isLoadingBrandList">
                <el-option
                  v-for="item in brandList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品分类" prop="cateCode">
              <!-- <el-select v-model="searchQuery.cateId" @focus="onCateSelectFocus" :loading="isLoadingCateList">
                <el-option
                  v-for="item in cateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select> -->
              <cate-cascader v-model="searchQuery.cateCode" ref="cascader"></cate-cascader>
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
        <!-- 列表节点 -->
        <div class="col">
          <el-button-group class="pb14">
            <el-button type="success" icon="el-icon-link" :loading="batchSpuBindLoading" @click="onBatchBindSpuClick()">绑定</el-button>
          </el-button-group>
          <div class="max-width">
            <!-- 表格 -->
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 100%;"
              @selection-change="spuHandleSelectionChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column type="index" :index="indexMethod" label="序号" width="50">
              </el-table-column>
              <el-table-column width="150">
                <template slot="header">
                  <el-tooltip class="item" effect="dark" content="NC编码" placement="top">
                    <span>规格编码<i class="el-icon-info ml6"></i></span>
                  </el-tooltip> 
                </template>
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.skuSn" :key="index">{{ item }}</div>
                </template>
              </el-table-column>
              <el-table-column label="商品分类" prop="cateName" width="100">
              </el-table-column>
              <el-table-column label="商品信息" >
                <template slot-scope="scope">
                  <div class="row center-y">
                    <img :src="scope.row.titleImage" width="100" height="100" />
                    <div>
                      <span class="pl10">{{ scope.row.name }}</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="品牌" prop="brandName" width="100">
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="align-l">
              <the-pagination
                :pageIndex="searchQuery.pageIndex"
                :pageSize="searchQuery.pageSize"
                :total="spuTotal"
                @onPageSizeChange="handleSizeChange"
                @onPageIndexChange="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </el-dialog>
    </template>
    <div class="el-footer footer">
      <el-button type="primary" size="small" :loading="saveBtnLoading" @click="submitForm('priceListData')">保存</el-button>
      <el-button type="info" size="small" @click="resetForm('priceListData')" plain>重置</el-button>
      <el-button size="small" @click="returnList">返回</el-button>
    </div>
  </div>
</template>

<script>
import TheSearch from '@/components/TheSearch'
import ThePagination from '@/components/ThePagination'
import { getMaxNumber, parseTime, uniqueArrByKey } from '@/utils'
import { validMoney  } from '@/utils/validate'
import CateCascader from '@/components/CateCascader'

export default {
  name: 'ProductPriceMaintaining',
  title: '商品价格清单维护',
  components: { TheSearch, ThePagination, CateCascader },
  data() {
    return {
      selectIds: null,
      priceListId: 0,
      priceListData: {
        title: '',
        isEnable: true,
        modifyUserId: '',
        modifyTimestamp: new Date().getTime(),
        remark: ''
      },
      currentEditItem: {},
      rules: {
        title: [
          { required: true, message: '请输入模版名称', trigger: 'blur' }
        ]
      },
      priceListItemListQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      priceListItemListTotal: 0,
      searchQuery: {
        pageIndex: 1,
        pageSize: 5,
        name: '',
        skuSn: '',
        codeBar: '',
        brandId: [],
        // cateId: '',
        cateCode: '',
        goodsType: '',
        orderStr: 'id desc',
        isOnSale: true
      },
      brandList: [],  // 品牌列表
      cateList: [],  // 分类列表
      tableData: [], // 商品表格数据
      spuTotal: 0, // 总数
      priceListItemList: null,
      isLoadingCateList: false, // 分类下拉框加载状态
      isLoadingBrandList: false, // 品牌下拉框加载状态
      dialogVisible: false,
      batchSpuBindLoading: false,
      priceListItemLoading: false,
      saveBtnLoading: false, // 保存按钮的loading状态
      spuSelectionList: [],
      priceListItemSelectionList: []
    }
  },
  computed: {
    modifyDate:{
      get(){
        return parseTime(this.priceListData.modifyTimestamp)
      }
    },
    selectionSpuIds() {
      let ids = this.spuSelectionList.map(item => item.id)
      return ids
    },
    selectionPriceListItemIds() {
      let ids = this.priceListItemSelectionList.map(item => item.id)
      return ids
    }
  },
  created() {
    this.priceListId = this.$route.query.id
    if(this.priceListId > 0) {
      this.init()
      console.log('>0')
    } else {
      let modifyUserId
      // 有账号取账号，没有取手机
      if (this.$store.getters.userInfo.loginAcount) {
        modifyUserId = this.$store.getters.userInfo.loginAcount
      } else if (this.$store.getters.userInfo.mobile) {
        modifyUserId = this.$store.getters.userInfo.mobile
      }
      this.priceListData.modifyUserId = modifyUserId
    }
  },
  mounted() {},
  methods: {
    async init() {
      try {
        this.$store.commit('SHOW_LOADING')
        //获取价格清单模版明细信息
        await this.$get(`/goods/priceList/getOne/${this.priceListId}`)
        .then(async (res) => {
//          console.log('priceList=>', res)
          this.priceListData = res
        })
        //获取清单明细项信息
        this.fetchPriceListItemList()
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },
    fetchPriceListItemList() {
      return new Promise((resolve, reject) => {
        this.priceListItemLoading = true
        this.$post('/goods/priceListItem/getPriceListItemPager', {
          pageIndex: this.priceListItemListQuery['pageIndex'],
          pageSize: this.priceListItemListQuery['pageSize'],
          priceListId: this.priceListId
        }).then(res => {
          // console.log('分类列表=>', res.list)
          this.priceListItemList = res.records
          this.priceListItemListTotal = Number(res.total)
        }).finally(() => {
          this.priceListItemLoading = false
        })
      })
    },
    parseTime,
    uniqueArrByKey,
    validMoney,
    // 保存提交
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.saveBtnLoading = true
          let url
          if (this.priceListId <= 0) { // 添加
            url = '/goods/priceList/addPriceList'
          } else { // 编辑
            url = '/goods/priceList/updatePriceList'
          }

          await this.$post(url, this.priceListData).then(res => {
            let result = '保存成功'
            this.priceListId = res
            this.priceListData.id = this.priceListId
            this.$message({
              message: `${result}`,
              type: 'success'
            })
          }).catch((ex) => {
//            console.info(ex)
          }).finally(() => {
            this.saveBtnLoading = false
          })

        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    openSpuDialog() {
      this.searchQuery.pageIndex = 1
      this.fetchSpuList()
      this.dialogVisible = true
    },
    closeSpuDialog() {
      this.dialogVisible = false
    },
    // 搜索
    onSearch() {
//      console.log(this.searchQuery)
      this.searchQuery.pageIndex = 1
      this.fetchSpuList()
    },
    // 重置
    resetSearch() {
      this.$refs['searchQuery'].resetFields()
      this.$refs['cascader'].clear()
      // console.log(this.searchQuery)
      this.searchQuery.pageIndex = 1
      this.fetchSpuList()
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
          // console.log('分类列表=>', res.list)
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
    spuHandleSelectionChange(selection) {
//      console.log(selection)
      this.spuSelectionList = selection
//      console.log(this.selectionSpuIds)
    },
    priceListItemHandleSelectionChange(selection) {
      this.priceListItemSelectionList = selection
    },
    indexMethod(index) { // 序号
      return this.searchQuery.pageSize * (this.searchQuery.pageIndex - 1) + (index + 1)
    },
    //
    handleSizeChange(val) { // 每页条数改变时
      this.searchQuery['pageSize'] = val
      this.searchQuery['pageIndex'] = 1
      this.fetchSpuList()
    },
    handleCurrentChange(val) { // 页码改变时
      this.searchQuery['pageIndex'] = val
      this.fetchSpuList()
    },
    handleSizeChangePriceListItemList(val) {
      this.priceListItemListQuery['pageSize'] = val
      this.priceListItemListQuery['pageIndex'] = 1
      this.fetchPriceListItemList()
    },
    handleCurrentChangePriceListItemList(val) {
      this.priceListItemListQuery['pageIndex'] = val
      this.fetchPriceListItemList()
    },
    async fetchSpuList() {
      this.$store.commit('SHOW_LOADING')
      await this.$post('/goods/spu/getSpuPager', this.searchQuery)
        .then(res => {
//          console.log(res)
          this.tableData = res.records
          this.spuTotal = Number(res.total)
        }).finally(() => {
          //把已绑定商品checkbox勾上
          this.toggleSpuSelection()
          this.$store.commit('SHOW_LOADING', false)
        })
    },
    clearSpuData(done) {
      this.$refs['searchQuery'].resetFields()
      this.tableData = []
      this.spuTotal = 0
      done()
    },
    // 批量操作：绑定商品bindSpu
    onBatchBindSpuClick() {
      if (!this.selectionSpuIds.length) {
        this.$message('未选中数据！')
        return
      }
      let tips = '确认添加吗？'
      // 弹窗确认
      this.$confirm(tips, {
        type: 'warning'
      }).then(() => {
        this.batchSpuBindLoading = true
        let priceListItemArr = []
        this.selectionSpuIds.map((item)=>{
          priceListItemArr.push({
            spuId: item,
            priceListId: this.priceListId
          })
        })
        this.$post('/goods/priceListItem/addPriceListItem', {
          priceListId: this.priceListId,
          priceListItemList: priceListItemArr
        }).then(res => {
          this.$message.success('操作成功')
          this.fetchPriceListItemList()
          this.closeSpuDialog()
        }).finally(() => {
          this.batchSpuBindLoading = false
        })
      }).catch(() => {
      })
    },
    // 批量删除价格清单项
    onBatchRemovePriceListItem() {
      if (!this.selectionPriceListItemIds.length) {
        this.$message('未选中数据！')
        return
      }
      let tips = '确认移除吗？'
      // 弹窗确认
      this.$confirm(tips, {
        type: 'warning'
      }).then(() => {
        this.priceListItemLoading = true
        let priceListItemArr = []
        this.selectionPriceListItemIds.map((item)=>{
          priceListItemArr.push({
            id: item
          })
        })
        this.$delete('/goods/priceListItem/batchDelete', {
          priceListId: this.priceListId,
          priceListItemList: priceListItemArr
        }).then(res => {
          this.$message.success('移除成功')
          this.fetchPriceListItemList()
          this.closeSpuDialog()
        }).finally(() => {
          this.priceListItemLoading = false
        })
      }).catch(() => {
      })
    },
    // 返回列表
    returnList() {
      this.$router.back(-1)
    },
    isEmpty(str){
      return str == null || str.toString() == ''
    },
    savePriceListItem(row, index) {
      //手工校验数据是否合规则
      let costPrice = row.costPrice
      let distributionPriceOne = row.distributionPriceOne
      let distributionPriceTwo = row.distributionPriceTwo
      let distributionPriceThree = row.distributionPriceThree
      let msrp = row.msrp

      if(this.isEmpty(costPrice) || !this.validMoney(costPrice)) {
        this.$alert('请正确填写“成本价”')
        return
      }
      if(this.isEmpty(distributionPriceOne) || !this.validMoney(distributionPriceOne)) {
        this.$alert('请正确填写“一级分销建议价”')
        return
      }
      if(this.isEmpty(distributionPriceTwo) || !this.validMoney(distributionPriceTwo)) {
        this.$alert('请正确填写“二级分销建议价”')
        return
      }
      if(this.isEmpty(distributionPriceThree) || !this.validMoney(distributionPriceThree)) {
        this.$alert('请正确填写“三级分销建议价”')
        return
      }
      if(this.isEmpty(msrp) || !this.validMoney(msrp)) {
        this.$alert('请正确填写“建议零售价”')
        return
      }

      this.$confirm('确认保存吗？', {
        type: 'warning'
      }).then(() => {
        this.priceListItemLoading = true
        this.$post('/goods/priceListItem/updatePriceListItem', {
          id: row.id,
          costPrice: costPrice,
          distributionPriceOne: distributionPriceOne,
          distributionPriceTwo: distributionPriceTwo,
          distributionPriceThree: distributionPriceThree,
          msrp: msrp
        }).then(res => {
          this.$message.success(res);
//          this.fetchPriceListItemList()
        }).finally(() => {
          this.priceListItemLoading = false
        })
      }).catch(() => {
      })

    },
    removePriceListItem(row, index) {
      this.$confirm('确认移除吗？', {
        type: 'warning'
      }).then(() => {
        //更新单个价格清单项记录
        this.$delete('/goods/priceListItem/delete/' + row.id)
          .then(res => {
            this.$message.success('移除成功')
            this.fetchPriceListItemList()
          }).finally(() => {
          this.batchSpuBindLoading = false
        })
      }).catch(() => {
      })
    },
    toggleSpuSelection() {
      //拿当前table的spuId数据，跟清单项的ID对比，如果值相同，则勾上checkbox
      if(this.priceListItemList && this.priceListItemList.length > 0
        && this.tableData && this.tableData.length > 0) {
        this.tableData.forEach(tableRow => {
          this.uniqueArrByKey(this.priceListItemList, 'spuId').forEach(priceListItemRow => {
            if(tableRow.id === priceListItemRow.spuId){
              this.$refs.multipleTable.toggleRowSelection(tableRow)
            }
          })
        })
      }else{
        this.$refs.multipleTable.clearSelection()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.max-width{
  max-width: 1000px;
}
.footer{
  margin-top: 15px;
}
</style>
<style lang="scss">
.price-maintaining-page{
  .dialog-class{
    height: 80%;
    overflow-y: scroll;
  }
  .el-textarea__inner{
    height: 170px;
  }
}
</style>
