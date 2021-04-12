<template>
  <div class="edit-product-page">
    <el-page-header title="返回列表" @back="returnList"></el-page-header>
    <el-tabs v-model="activeName" @tab-click="onTabClick" :before-leave="beforeLeave">
      <!-- SPU -->
      <el-tab-pane label="编辑SPU" name="spu">
        <h4>基本信息</h4>
        <div>
          <el-form :model="spuData" :rules="rules" ref="spuData" label-width="100px" size="mini">
            <div class="row max-width">
              <div class="flex-2">
                <el-form-item v-if="spuData" label="分类" prop="cateCode">
                  <select-category v-model="spuData.cateCode" :checkStrictly="false" />
                </el-form-item>
                <el-form-item v-if="spuData" label="商品名称" prop="name">
                  <el-input v-model="spuData.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item v-if="spuData" label="副标题" prop="title">
                  <el-input v-model="spuData.title" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item v-if="spuData" label="授权渠道范围" prop="title">
                  <!-- <el-input v-model="spuData.scopeAuthoriza" placeholder="请输入"></el-input> -->
                  <select-add-good-channel-type
                    :multiple="true"
                    v-model="scopeAuthorizas"
                    :clearable="false"
                  />
                </el-form-item>
                <el-form-item v-if="spuData" label="核心卖点描述" prop="productDescribe">
                  <el-input
                    v-model="spuData.productDescribe"
                    placeholder="请输入"
                    type="textarea"
                    resize="none"
                  ></el-input>
                </el-form-item>

                <el-form-item v-if="spuData" label="标签" prop="tag">
                  <tags v-model="spuData.tags" />
                </el-form-item>
              </div>
              <div class="flex-1">
                <el-form-item v-if="spuData" label="品牌" prop="brandId">
                  <select-brand v-model="spuData.brandId" isEnable />
                </el-form-item>
                <el-form-item v-if="spuData" label="产地" prop="producePlace">
                  <el-input v-model="spuData.producePlace" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item v-if="spuData" label="保质期(天)" prop="shelfLife">
                  <el-input-number
                    v-model="spuData.shelfLife"
                    :min="0"
                    :step="1"
                    size="medium"
                    :step-strictly="true"
                    controls-position="right"
                  ></el-input-number>
                </el-form-item>
                <el-form-item v-if="spuData" label="零售单位" prop="retailUnit">
                  <el-select v-model="spuData.retailUnit" clearable filterable placeholder="请选择">
                    <el-option
                      v-for="item in danweis"
                      :key="item.code"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="spuData" label="分类排序" prop="cateOrder">
                  <el-input-number
                    :min="0"
                    :max="999999"
                    v-model="spuData.cateOrder"
                    placeholder="请输入"
                  ></el-input-number>
                </el-form-item>
                <el-form-item v-if="spuData" label="品牌排序" prop="brandOrder">
                  <el-input-number
                    :min="0"
                    :max="999999"
                    v-model="spuData.brandOrder"
                    placeholder="请输入"
                  ></el-input-number>
                </el-form-item>
                <el-form-item v-if="spuData" label="主属性" prop="firstAtbKey">
                  <el-input v-model="spuData.firstAtbKey" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item v-if="spuData" label="副属性" prop="secondAtbKey">
                  <el-input v-model="spuData.secondAtbKey" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="是否进口品">
                  <el-radio v-model="isImportGoods" :label="true">进口品</el-radio>
                  <el-radio v-model="isImportGoods" :label="false">非进口品</el-radio>
                </el-form-item>
                <el-form-item label="是否需授权" v-if="spuData">
                  <el-radio v-model="spuData.isNeedAuthorized" :label="true">是</el-radio>
                  <el-radio v-model="spuData.isNeedAuthorized" :label="false">否</el-radio>
                </el-form-item>
                <el-form-item v-if="spuData" label="贸易类型">
                  <el-checkbox v-model="spuData.isCrossBorderTrade" :disabled="!isImportGoods">跨境贸易</el-checkbox>
                  <br />
                  <el-checkbox v-model="spuData.isGeneralTrade" :disabled="!isImportGoods">一般贸易</el-checkbox>
                </el-form-item>
                <el-form-item label="是否需要上架">
                  <el-radio v-model="spuData.isNeedOnSale" :label="true">是</el-radio>
                  <el-radio v-model="spuData.isNeedOnSale" :label="false">否（中小样/试用装/赠品）</el-radio>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div class="pl100">
          <el-button type="primary" @click="updateSpu('spuData')">保存</el-button>
          <!-- <el-button type="default" @click="returnList">返回列表</el-button> -->
        </div>
      </el-tab-pane>
      <!-- SKU -->
      <el-tab-pane label="编辑SKU" name="sku">
        <div class="row pt20">
          <div class="fw600 fs16px h30 l-h30">属性规格</div>
          <div class="pl30">
            <!-- 主属性 -->
            <div>
              <!-- <div class="row pt10">
                <el-button type="primary" size="mini" style="margin-right: 10px;">主属性</el-button>
                <el-input v-if="spuData" v-model="spuData.firstAtbKey" size="small" placeholder="添加主属性" style="width: 220px;"></el-input>
              </div>-->
              <div class="row pt10" v-if="skuFirstAtbKey">
                <!-- <el-button type="info" size="mini" style="margin-right: 10px;">主属性值</el-button> -->
                <el-button type="info" size="mini" style="margin-right: 10px;">{{ skuFirstAtbKey }}</el-button>
                <el-tag
                  class="mr10"
                  v-for="(item, index) in firstAtbValueArr"
                  :key="index"
                  @close="deleteAtbValue('first', item)"
                >{{ item.firstAtbValue }}</el-tag>
                <!-- <el-button v-if="!firstAtbValueInputVisible && (spuData && spuData.firstAtbKey)" size="small" @click="firstAtbValueInputVisible = true;">+主属性值</el-button> -->
                <el-input
                  v-if="firstAtbValueInputVisible"
                  v-model="firstAtbValueInputValue"
                  ref="firstAtbValueInput"
                  autofocus
                  size="small"
                  @keyup.enter.native="addAtbValueConfirm('first')"
                />
                <el-button
                  v-if="firstAtbValueInputVisible"
                  type="text"
                  size="mini"
                  style="margin-left: 10px;"
                  @click="firstAtbValueInputVisible=false;firstAtbValueInputValue=''"
                >取消</el-button>
              </div>
            </div>
            <!-- 辅属性 -->
            <div>
              <!-- <div class="row pt10">
                <el-button type="primary" size="mini" style="margin-right: 10px;">辅属性</el-button>
                <el-input v-if="spuData" v-model="spuData.secondAtbKey" size="small" placeholder="添加辅属性" style="width: 220px;"></el-input>
              </div>-->
              <div class="row pt10" v-if="skuSecondAtbKey">
                <!-- <el-button type="info" size="mini" style="margin-right: 10px;">辅属性值</el-button> -->
                <el-button type="info" size="mini" style="margin-right: 10px;">{{ skuSecondAtbKey }}</el-button>
                <el-tag
                  class="mr10"
                  v-for="(item, index) in secondAtbValueArr"
                  :key="index"
                  @close="deleteAtbValue('second', item)"
                >{{ item.secondAtbValue }}</el-tag>
                <!-- <el-button v-if="!secondAtbValueInputVisible && (spuData &&spuData.secondAtbKey)" size="small" @click="secondAtbValueInputVisible = true;">+辅属性值</el-button> -->
                <el-input
                  v-if="secondAtbValueInputVisible"
                  v-model="secondAtbValueInputValue"
                  size="small"
                  autofocus
                  @keyup.enter.native="addAtbValueConfirm('second')"
                />
                <el-button
                  v-if="secondAtbValueInputVisible"
                  type="text"
                  size="mini"
                  style="margin-left: 10px;"
                  @click="secondAtbValueInputVisible=false;secondAtbValueInputValue=''"
                >取消</el-button>
              </div>
            </div>
          </div>
        </div>
        <div></div>
        <!-- sku列表 -->
        <div class="row fs13 mt20" style="overflow-x: auto;">
          <el-card v-for="(item, index) in skuList" :key="index" class="sku-form-wrapper">
            <div slot="header">
              <div class="row center-y" v-if="skuFirstAtbKey">
                <span class="pr4">{{ skuFirstAtbKey }}</span>
                <el-input
                  v-model="item.firstAtbValue"
                  placeholder="请输入主属性值"
                  class="flex-1"
                  size="mini"
                ></el-input>
              </div>
              <div class="row center-y mt10" v-if="skuSecondAtbKey">
                <span class="pr4">{{ skuSecondAtbKey }}</span>
                <el-input
                  v-model="item.secondAtbValue"
                  placeholder="请输入副属性值"
                  class="flex-1"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div>
              <el-form
                label-width="120px"
                :model="item"
                :rules="formSkuRules"
                :ref="`skuData${index}`"
              >
                <el-form-item v-show="false">
                  <template slot="label">
                    <el-tooltip class="item" effect="dark" content="NC编码" placement="top">
                      <span>
                        规格编码
                        <i class="el-icon-info ml6"></i>
                      </span>
                    </el-tooltip>
                  </template>
                  <el-input v-model="item.skuSn" placeholder="输入规格编码" size="mini" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="商品助记码（屈臣氏商品必填）">
                  <el-input v-model="item.mnemonicCode" placeholder="请输入助记码" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="商品条码" prop="codeBar" :show-message="false">
                  <el-input v-model="item.codeBar" placeholder="输入商品条码" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="建议零售价" prop="msrp" :show-message="false">
                  <el-input
                    type="number"
                    step="0.01"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    v-model="item.msrp"
                    placeholder="输入建议零售价"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <!--
                <el-form-item label="库存">
                  <el-input v-model="item.stock" placeholder="输入库存" size="mini"></el-input>
                </el-form-item>
                -->
                <el-form-item label="箱规" prop="wholesaleSpec" :show-message="false">
                  <el-input v-model="item.wholesaleSpec" placeholder="输入箱规" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="零售起订量（零售单位）">
                  <el-input
                    v-model="item.retailMinOrder"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入零售起订量"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="批发起订量（箱）">
                  <el-input
                    v-model="item.wholesaleMinOrder"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入批发起订量"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="长(mm)">
                  <el-input
                    v-model="item.skuLength"
                    v-on:input="calculateVolume(index)"
                    placeholder="输入长"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="宽(mm)">
                  <el-input
                    v-model="item.skuWeight"
                    v-on:input="calculateVolume(index)"
                    placeholder="输入宽"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="高(mm)">
                  <el-input
                    v-model="item.skuHeight"
                    v-on:input="calculateVolume(index)"
                    placeholder="输入高"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="单品体积（立方米）">
                  <el-input
                    v-model="item.unitvolume"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入体积"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="单品重量（KG）">
                  <el-input
                    v-model="item.skuScale"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入单品重量"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="外箱规格长(mm)">
                  <el-input
                    v-model="item.longCartonSize"
                    v-on:input="calculateCartonVolum('outside', index)"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入外箱规格长"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="外箱规格宽(mm)">
                  <el-input
                    v-model="item.widthCartonSize"
                    v-on:input="calculateCartonVolum('outside', index)"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入外箱规格宽"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="外箱规格高(mm)">
                  <el-input
                    v-model="item.highCartonSize"
                    v-on:input="calculateCartonVolum('outside', index)"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入外箱规格高"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="外箱体积（立方米）">
                  <el-input
                    v-model="item.cartonVolum"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入体积"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="外箱重量（KG）">
                  <el-input
                    v-model="item.cartonScale"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入单品重量"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <!-- todo ... -->
                <el-form-item label="中箱规格长(mm)">
                  <el-input
                    v-model="item.longMiddleCartonSize"
                    v-on:input="calculateCartonVolum('mid', index)"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入中箱规格长"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="中箱规格宽(mm)">
                  <el-input
                    v-model="item.widthMiddleCartonSize"
                    v-on:input="calculateCartonVolum('mid', index)"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入中箱规格宽"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="中箱规格高(mm)">
                  <el-input
                    v-model="item.highMiddleCartonSize"
                    v-on:input="calculateCartonVolum('mid', index)"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入中箱规格高"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="中箱体积（立方米）">
                  <el-input
                    v-model="item.middleCartonVolume"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入体积"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="中箱重量（KG）">
                  <el-input
                    v-model="item.middleCartonScale"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    placeholder="输入单品重量"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="分销建议价(一般合作)">
                  <el-input v-model="item.distributionPrice" placeholder="输入分销定价" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="分销建议价(战略合作)">
                  <el-input
                    v-model="item.distributionPriceStrategy"
                    placeholder="输入分销定价"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="最低控价">
                  <el-input v-model="item.minPrice" placeholder="输入最低控价" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="一件代发建议价(一般合作)">
                  <el-input v-model="item.dropShippingPrice" placeholder="输入价" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="一件代发建议价(战略合作)">
                  <el-input
                    v-model="item.dropShippingPriceStrategy"
                    placeholder="输入一件代发建议价"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="代发费用">
                  <el-input v-model="item.dropShippingExpense" placeholder="输入代发费用" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="所属部门（屈臣氏商品必填）" prop="departmentName">
                  <el-select v-model="item.departmentName" clearable filterable placeholder="请选择">
                    <el-option
                      v-for="item in departments"
                      :key="item.code"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="合作状态">
                  <el-radio v-model="item.workStatus" label="正常销售">正常销售</el-radio>
                  <el-radio v-model="item.workStatus" label="清货">清货</el-radio>
                </el-form-item>
                <div>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="updateSku(item, 'skuData', index)"
                    :disabled="!spuData.id"
                    class="w-full"
                  >保存</el-button>
                </div>
              </el-form>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加sku弹窗 -->
    <el-dialog title="添加sku" :visible.sync="showAddSkuItem" @close="cancelAddSku">
      <el-form :model="addSkuItem" ref="addSkuItem" inline label-width="120px">
        <el-form-item :label="skuFirstAtbKey" prop="firstAtbValue" v-if="skuFirstAtbKey">
          <el-input v-model="addSkuItem.firstAtbValue" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item :label="skuSecondAtbKey" prop="secondAtbValue" v-if="skuSecondAtbKey">
          <el-input v-model="addSkuItem.secondAtbValue" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="skuSn">
          <template slot="label">
            <el-tooltip class="item" effect="dark" content="NC编码" placement="top">
              <span>
                规格编码
                <i class="el-icon-info ml6"></i>
              </span>
            </el-tooltip>
          </template>
          <el-input v-model="addSkuItem.skuSn" placeholder="规格编码"></el-input>
        </el-form-item>
        <el-form-item prop="codeBar" label="商品条码">
          <el-input v-model="addSkuItem.codeBar" placeholder="商品条码"></el-input>
        </el-form-item>
        <el-form-item prop="msrp" label="零售价">
          <el-input
            type="number"
            step="0.01"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            v-model="addSkuItem.msrp"
            placeholder="零售价"
          ></el-input>
        </el-form-item>
        <el-form-item prop="stock" label="库存">
          <el-input v-model="addSkuItem.stock" placeholder="库存"></el-input>
        </el-form-item>
        <el-form-item prop="wholesaleSpec" label="箱规">
          <el-input v-model="addSkuItem.wholesaleSpec" placeholder="箱规"></el-input>
        </el-form-item>
        <el-form-item prop="skuLength" label="长(mm)">
          <el-input v-model="addSkuItem.skuLength" placeholder="长"></el-input>
        </el-form-item>
        <el-form-item prop="skuWeight" label="宽(mm)">
          <el-input v-model="addSkuItem.skuWeight" placeholder="宽"></el-input>
        </el-form-item>
        <el-form-item prop="skuHeight" label="高(mm)">
          <el-input v-model="addSkuItem.skuHeight" placeholder="高"></el-input>
        </el-form-item>
        <el-form-item label="分销建议价(一般合作)">
          <el-input v-model="addSkuItem.distributionPrice" placeholder="输入分销定价"></el-input>
        </el-form-item>
        <el-form-item label="分销建议价(战略合作)">
          <el-input v-model="addSkuItem.distributionPriceStrategy" placeholder="输入分销定价"></el-input>
        </el-form-item>

        <el-form-item label="最低控价">
          <el-input v-model="addSkuItem.minPrice" placeholder="输入最低控价"></el-input>
        </el-form-item>
        <el-form-item label="一件代发建议价(一般合作)">
          <el-input v-model="addSkuItem.dropShippingPrice" placeholder="输入价"></el-input>
        </el-form-item>
        <el-form-item label="一件代发建议价(战略合作)">
          <el-input v-model="addSkuItem.dropShippingPriceStrategy" placeholder="输入一件代发建议价"></el-input>
        </el-form-item>
        <el-form-item label="代发费用">
          <el-input v-model="addSkuItem.dropShippingExpense" placeholder="输入代发费用"></el-input>
        </el-form-item>
        <el-form-item label="合作状态">
          <el-radio v-model="addSkuItem.workStatus" label="正常销售">正常销售</el-radio>
          <el-radio v-model="addSkuItem.workStatus" label="清货">清货</el-radio>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" size="mini" @click="addSku" style="width: 300px;">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uniqueArrByKey, isEmpty, deepClone, toNumberStr } from '@/utils'
import { getDepartmentList, getDanweiList } from '@/api/channel'
import { baseURL, headersTokenKey } from '@/config'
import SelectBrand from '@/components/SelectBrand'
import SelectCategory from '@/components/SelectCategory'
import SelectAddGoodChannelType from '@/components/SelectAddGoodChannelType'
import Tags from '@/components/Tags'
import { addSpu } from '@/api/excel'

export default {
  name: 'importProductMaintainingEdit',
  title: '商品编辑',
  components: { SelectBrand, SelectCategory, Tags, SelectAddGoodChannelType },
  data() {
    return {
      rules: {
        cateCode: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ],
        goodsType: [
          { required: true, message: '请选择商品类型', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        brandId: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
        firstAtbKey: [
          { required: true, message: '请输入主属性', trigger: 'blur' }
        ],
        productDescribe: [
          { required: true, message: '请输入核心卖点描述', trigger: 'blur' }
        ],
        producePlace: [
          { required: true, message: '请输入产地', trigger: 'blur' }
        ],
        shelfLife: [
          {
            required: true,
            validator: (rule, value, callback) => {
              setTimeout(() => {
                if (value < 1) {
                  callback(
                    new Error('保质期只能填写1-30内的数字、30的倍数、或者365')
                  )
                } else if (value >= 1 && value <= 30) {
                  callback()
                } else if (value == 365) {
                  callback()
                } else if (value % 30 <= 0) {
                  callback()
                } else {
                  callback(
                    new Error('保质期只能填写1-30内的数字、30的倍数、或者365')
                  )
                }
              }, 100)
            },
            trigger: 'change'
          }
        ],
        retailUnit: [
          { required: true, message: '请输入零售单位', trigger: 'blur' }
        ]
      },
      formSkuRules: {
        codeBar: [
          { required: true, message: '请填写商品条码', trigger: 'blur' }
        ],
        msrp: [
          { required: false, message: '请填写商品建议零售价', trigger: 'blur' }
        ],
        firstAtbValue: [
          { required: true, message: '请填写商品主属性值', trigger: 'blur' }
        ],
        wholesaleSpec: [
          { required: true, message: '请填写箱规', trigger: 'blur' }
        ]
      },
      activeName: 'spu',
      firstClickSkuTab: true,
      spuId: null,
      spuData: null,
      skuList: [],
      isLoadingCateList: false,
      isLoadingBrandList: false,
      firstAtbValueArr: [], // 主属性值数组
      secondAtbValueArr: [], // 辅属性值数组
      firstAtbValueInputVisible: false, // 是否显示主属性值输入框
      firstAtbValueInputValue: '', // 主属性值
      secondAtbValueInputVisible: false, // 是否显示辅属性值输入框
      secondAtbValueInputValue: '', // 辅属性值
      // 图片tab页的相关数据
      skuListOfImages: [],
      firstAtbListOfImages: [],
      colRadio: 'spu', // 侧边栏当前按钮，默认spu
      rowRadio: '1', // 横向切换按钮，默认商品展示图(1商品展示图, 2商品详情图)
      currentImageList: [],
      baseURL: baseURL,
      skuFirstAtbKey: '',
      skuSecondAtbKey: '',
      addSkuItem: {
        // 为新增的sku对象添加空属性
        firstAtbValue: '',
        secondAtbValue: '',
        skuSn: '',
        codeBar: '',
        msrp: 0,
        wholesaleSpec: '',
        skuLength: 0,
        skuWeight: 0,
        skuHeight: 0,
        isOnSale: true,
        stock: 0,
        workStatus: '',
        distributionPrice: 0,
        distributionPriceStrategy: 0,
        innerPrice: 0,
        minPrice: 0,
        dropShippingPrice: 0,
        dropShippingPriceStrategy: 0,
        dropShippingExpense: 0
      },
      showAddSkuItem: false,
      titleImageId: null,
      isImportGoods: false, // 是否进口品
      addSkuDialog: false,
      localData: [],
      snowflake: null,
      skuSnowflake: null,
      spuIds: null,
      departments: [], //所属公司
      danweis: [], //计量单位
      scopeAuthorizas: [],
      index: '' //记录的索引
    }
  },
  computed: {
    fileList() {
      let arr = this.currentImageList.filter((item) => {
        return item.imageType === this.rowRadio
      })
      arr.forEach((item) => {
        item['name'] = item.id
        item['url'] = item.imagePath
      })
      // console.log('fileList', arr)
      return arr
    },
    uploadHeaders() {
      let headers = {}
      headers[headersTokenKey] = this.$store.getters.token
      return headers
    },
    hideUploadIcon() {
      if (this.rowRadio === '1') {
        if (this.fileList.length >= 5) {
          return true
        } else {
          return false
        }
      } else if (this.rowRadio === '2') {
        if (this.fileList.length >= 20) {
          return true
        } else {
          return false
        }
      }
    }
  },
  created() {
    console.info(this.$route.query)
    if (localStorage.getItem('importSpuData')) {
      this.spuData = JSON.parse(localStorage.getItem('importSpuData'))[
        this.$route.query.sid
      ]
      this.index = this.$route.query.index
      console.log(this.spuData, 'spuData')
      this.scopeAuthorizas = this.spuData.scopeAuthoriza.split(',')
      this.spuId = this.spuData.id
      this.init()
    }
  },
  mounted() {},
  methods: {
    async init() {
      try {
        this.$store.commit('SHOW_LOADING')
        this.isImportGoods =
          this.spuData.isCrossBorderTrade === true ||
          this.spuData.isGeneralTrade === true

        getDepartmentList().then((res) => {
          this.departments = res
        })

        getDanweiList().then((res) => {
          this.danweis = res
        })
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },
    beforeLeave(activeName, oldActiveName) {
      if (activeName === 'sku') {
        return this.$refs['spuData'].validate()
      } else {
        return true
      }
    },
    async onTabClick(tab, event) {
      // console.log(tab, event)
      if (tab.name === 'sku') {
        try {
          this.$store.commit('SHOW_LOADING')
          this.skuList = await this.fetchSkuList()
          this.initAtbValueArr()
          this.firstClickSkuTab = false

          this.$refs['spuData'].validate(async (valid) => {
            if (valid) {
              console.log(valid, 'valid')
              this.skuList = await this.fetchSkuList()
              this.initAtbValueArr()
              this.firstClickSkuTab = false
              this.isSpuCompleted = true
            } else {
              this.isSpuCompleted = false
              this.$message.error('SPU必填项未填或格式不正确')
            }
          })
        } finally {
          this.$store.commit('SHOW_LOADING', false)
        }
      } else if (tab.name === 'images') {
        try {
          this.$store.commit('SHOW_LOADING')
          let list = await this.fetchSkuList()
          this.skuListOfImages = list
          // this.firstAtbListOfImages = uniqueArrByKey(list, 'firstAtbValue')
          let firstAtbListOfImages = uniqueArrByKey(list, 'firstAtbValue')
          this.firstAtbListOfImages = firstAtbListOfImages.filter((item) => {
            return !isEmpty(item.firstAtbValue)
          })
          // console.log('图片主属性值', this.firstAtbListOfImages)
          this.fetchImagesPager('spu', this.spuId)
        } finally {
          this.$store.commit('SHOW_LOADING', false)
        }
      }
    },
    // sku列表
    fetchSkuList() {
      for (let index in this.spuData.skus) {
        this.spuData.skus[index].cartonVolum = toNumberStr(
          this.spuData.skus[index].cartonVolum,
          20
        )
        this.spuData.skus[index].unitvolume = toNumberStr(
          this.spuData.skus[index].unitvolume,
          20
        )
      }
      return this.spuData.skus
    },

    // 删除属性值
    deleteAtbValue(type, data) {
      // console.log(type, data)
      if (type === 'first') {
        this.firstAtbValueArr.splice(
          this.firstAtbValueArr.findIndex(
            (item) => item.firstAtbValue === data.firstAtbValue
          ),
          1
        )
        this.deleteOnSkuList(type, data.firstAtbValue, 'value')
      } else if (type === 'second') {
        this.secondAtbValueArr.splice(
          this.secondAtbValueArr.findIndex(
            (item) => item.secondAtbValue === data.secondAtbValue
          ),
          1
        )
        this.deleteOnSkuList(type, data.secondAtbValue, 'value')
      }
    },
    // 添加属性值enter事件
    addAtbValueConfirm(type) {
      if (type === 'first') {
        // 主
        let inputValue = this.firstAtbValueInputValue.trim()
        // console.log('添加主属性值=>', inputValue)
        // console.log('添加主属性值数组=>', this.firstAtbValueArr)
        let isSameValue = this.firstAtbValueArr.some((item) => {
          return item.firstAtbValue === inputValue
        })
        if (isSameValue) {
          this.$alert('该主属性值已存在，不能添加')
          return
        }
        if (inputValue) {
          this.addOnSkuList('first', inputValue)
          this.firstAtbValueArr.push({ firstAtbValue: inputValue })
        }
        this.firstAtbValueInputVisible = false
        this.firstAtbValueInputValue = ''
      } else if (type === 'second') {
        // 辅
        let inputValue = this.secondAtbValueInputValue.trim()
        // console.log('添加辅属性值=>', inputValue)
        let isSameValue = this.secondAtbValueArr.some((item) => {
          return item.secondAtbValue === inputValue
        })
        if (isSameValue) {
          this.$alert('该辅属性值已存在，不能添加')
          return
        }
        if (inputValue) {
          this.addOnSkuList('second', inputValue)
          this.secondAtbValueArr.push({ secondAtbValue: inputValue })
        }
        this.secondAtbValueInputVisible = false
        this.secondAtbValueInputValue = ''
      }
    },
    // 属性值列表（主、辅）
    initAtbValueArr() {
      // this.firstAtbValueArr = this.getUniqueAtbList('first')
      // this.secondAtbValueArr = this.getUniqueAtbList('second')
      let firstAtbValueArr = this.getUniqueAtbList('first')
      let secondAtbValueArr = this.getUniqueAtbList('second')
      if (firstAtbValueArr.length) {
        this.skuFirstAtbKey = firstAtbValueArr[0].firstAtbKey
      }
      if (secondAtbValueArr.length) {
        this.skuSecondAtbKey = secondAtbValueArr[0].secondAtbKey
      }
      this.firstAtbValueArr = firstAtbValueArr.filter((item) => {
        return !isEmpty(item.firstAtbValue)
      })
      this.secondAtbValueArr = secondAtbValueArr.filter((item) => {
        return !isEmpty(item.secondAtbValue)
      })
      // console.log('主属性值列表', this.firstAtbValueArr)
      // console.log('辅属性值列表', this.secondAtbValueArr)
    },
    // 属性值去重后的数组
    getUniqueAtbList(type) {
      if (type === 'first') {
        // let filter = this.skuList.filter(item => {
        //   return item.firstAtbKey === this.spuData.firstAtbKey
        // })
        let filter = _.cloneDeep(this.skuList)
        // 属性值去重
        return uniqueArrByKey(filter, 'firstAtbValue')
      } else if (type === 'second') {
        // let filter = this.skuList.filter(item => {
        //   return item.secondAtbKey === this.spuData.secondAtbKey
        // })
        let filter = _.cloneDeep(this.skuList)
        // 属性值去重
        return uniqueArrByKey(filter, 'secondAtbValue')
      }
    },
    // 修改spu
    updateSpu(formName) {
      this.spuData.scopeAuthoriza = this.scopeAuthorizas.toString()
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let spuSid = this.spuData.sid
          let cateIds = this.spuData.cateCode.split('-')
          let params = _.cloneDeep(this.spuData)
          params['cateId'] = Number(cateIds[cateIds.length - 1])
          if (this.spuData.id) {
            this.$store.commit('SHOW_LOADING', '修改spu')
            this.$post('/goods/spu/updateSpu', params)
              .then((res) => {
                this.spuData['updateDate'] = new Date().getTime()
                this.$message.success('修改成功')
                //修改缓存数据
                var _arr = JSON.parse(localStorage.getItem('importSpuData'))
                _arr[spuSid] = this.spuData
                localStorage.setItem('importSpuData', JSON.stringify(_arr))
              })
              .finally(() => {
                this.$store.commit('SHOW_LOADING', false)
              })
          } else {
            this.$store.commit('SHOW_LOADING', '新增spu')
            // params.skus = []
            this.$post('/goods/spu/addSpu', params)
              .then((res) => {
                this.spuData = res
                this.spuData['sid'] = spuSid
                this.spuData['updateDate'] = new Date().getTime()
                this.$message.success('新增成功')
                //修改缓存数据
                var _arr = JSON.parse(localStorage.getItem('importSpuData'))
                _arr[spuSid] = res
                localStorage.setItem('importSpuData', JSON.stringify(_arr))
              })
              .finally(() => {
                this.$store.commit('SHOW_LOADING', false)
              })
          }
        }
      })
    },
    onAddSkuClick() {
      this.showAddSkuItem = true
    },
    cancelAddSku() {
      this.showAddSkuItem = false
      this.$refs['addSkuItem'].resetFields()
    },
    // 添加sku
    addSku() {
      this.$store.commit('SHOW_LOADING', '添加SKU')
      this.addSkuItem['spuId'] = this.spuId
      this.addSkuItem['firstAtbKey'] = this.skuFirstAtbKey
      this.addSkuItem['secondAtbKey'] = this.skuSecondAtbKey
      this.$post('/goods/sku/addSku', this.addSkuItem)
        .then((res) => {
          // console.log(res)
          this.$message.success('添加sku成功')
          this.$refs['addSkuItem'].resetFields()
          this.showAddSkuItem = false
          this.refreshSkuTab()
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    },

    // 修改sku
    updateSku(sku, formName, index) {
      formName += index
      this.$refs[formName][0].validate((valid) => {
        this.$store.commit('SHOW_LOADING', '修改sku')
        if (!sku.id) {
          sku['spuId'] = this.spuData.id
          /*  console.log("spuId")
            console.log(sku.spuId)*/
        }
        sku.msrp = sku.msrp || 0
        this.$post(`/goods/sku/${sku.id ? 'updateSku' : 'addSku'}`, sku)
          .then((res) => {
            //修改缓存数据
            var _arr = JSON.parse(localStorage.getItem('importSpuData'))
            // var len2 = _arr2.length
            let spuSid = this.spuData.sid
            _arr[spuSid] = this.spuData
            localStorage.setItem('importSpuData', JSON.stringify(_arr))
            this.$message.success('保存sku成功')
            this.initAtbValueArr()
          })
          .finally(() => {
            this.$store.commit('SHOW_LOADING', false)
          })
      })
    },
    // 禁用启用sku
    clickOnUnSale(item, index) {
      let url, tip
      if (item.isOnSale) {
        url = `/goods/sku/outSale/${item.id}`
        tip = '禁用'
      } else {
        url = `/goods/sku/onSale/${item.id}`
        tip = '启用'
      }
      this.$store.commit('SHOW_LOADING', tip)
      this.$put(url)
        .then((res) => {
          this.$message.success('操作成功')
          item.isOnSale = !item.isOnSale
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    },
    // 从sku列表中删除对应的数据
    deleteOnSkuList(type, value, flag) {
      // 主/辅属性， 删除对应值，根据key还是value删除
      if (type === 'first') {
        if (flag === 'value') {
          // this.skuList.splice(this.skuList.findIndex(item => item.firstAtbValue === value), 1)
          this.skuList = this.skuList.filter((item) => {
            return item.firstAtbValue !== value
          })
        } else if (flag === 'key') {
          // console.log(this.skuList)
          this.skuList = this.getUniqueAtbList('second')
          // console.log(this.skuList)
          this.skuList.forEach((item) => {
            item['firstAtbValue'] = ''
          })
        }
      } else if (type === 'second') {
        if (flag === 'value') {
          // this.skuList.splice(this.skuList.findIndex(item => item.secondAtbValue === value), 1)
          this.skuList = this.skuList.filter((item) => {
            return item.secondAtbValue !== value
          })
        } else if (flag === 'key') {
          this.skuList = this.getUniqueAtbList('first')
          this.skuList.forEach((item) => {
            item['secondAtbValue'] = ''
          })
        }
      }
    },
    // 将数据添加到sku列表
    addOnSkuList(type, value) {
      let obj = {
        // 为新增的sku对象添加空属性
        skuSn: '',
        codeBar: '',
        msrp: 0,
        wholesaleSpec: '',
        skuLength: 0,
        skuWeight: 0,
        skuHeight: 0,
        isDelete: false
      }
      if (type === 'first') {
        // 获取去重后辅属性值数组
        let values = this.secondAtbValueArr.map((item) => {
          return item.secondAtbValue
        })
        // console.log(values)
        values.forEach((item) => {
          let skuItem = _.cloneDeep(obj)
          skuItem['secondAtbValue'] = item
          skuItem['firstAtbValue'] = value
          skuItem['firstAtbKey'] = this.spuData.firstAtbKey
          this.skuList.push(skuItem)
        })
      } else if (type === 'second') {
        let values = this.firstAtbValueArr.map((item) => {
          return item.firstAtbValue
        })
        // console.log(values)
        values.forEach((item) => {
          let skuItem = _.cloneDeep(obj)
          skuItem['firstAtbValue'] = item
          skuItem['secondAtbValue'] = value
          skuItem['secondAtbKey'] = this.spuData.secondAtbKey
          this.skuList.push(skuItem)
        })
      }
    },
    // 返回列表
    returnList() {
      this.$router.back(-1)
    },
    // 刷新sku页面
    async refreshSkuTab() {
      try {
        this.$store.commit('SHOW_LOADING')
        this.skuList = await this.fetchSkuList()
        this.initAtbValueArr()
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },

    // 侧边切换时
    async onColRadioChange(id) {
      // console.log(id)
      // this.colRadio = id
      if (id === 'spu') {
        this.fetchImagesPager('spu', this.spuId)
      } else {
        this.fetchImagesPager('sku', id)
      }
    },
    onRowRadioChange(imagesType) {
      // this.rowRadio = imagesType
    },
    // 删除钩子
    onRemoveImage(file) {
      // console.log('删除')
      // console.log(file)
      this.$confirm('确定删除？', {
        type: 'warning'
      })
        .then(() => {
          this.deleteImage(file.id)
        })
        .catch(() => {})
      // if (file && file.status==="success") {
      //   this.deleteImage(file.id)
      // }
    },
    calculateVolume(index) {
      let item = this.skuList[index]
      let tskuLength = item.skuLength / 1000
      let tskuWeight = item.skuWeight / 1000
      let tskuHeight = item.skuHeight / 1000
      item.unitvolume = toNumberStr(
        this.accMul(this.accMul(tskuLength, tskuWeight), tskuHeight),
        20
      )
    },

    calculateCartonVolum(type, index) {
      let item = this.skuList[index]
      let {
        longCartonSize,
        widthCartonSize,
        highCartonSize,
        highMiddleCartonSize,
        widthMiddleCartonSize,
        longMiddleCartonSize
      } = item
      if (type === 'mid') {
        item.middleCartonVolume = toNumberStr(
          this.accMul(
            this.accMul(
              longMiddleCartonSize / 1000,
              widthMiddleCartonSize / 1000
            ),
            highMiddleCartonSize / 1000
          ),
          20
        )
      } else {
        item.cartonVolum = toNumberStr(
          this.accMul(
            this.accMul(longCartonSize / 1000, widthCartonSize / 1000),
            highCartonSize / 1000
          ),
          20
        )
      }
    },

    accMul(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) {}
      try {
        m += s2.split('.')[1].length
      } catch (e) {}
      return (
        (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
        Math.pow(10, m)
      )
    }
  },
  watch: {
    isImportGoods(val) {
      if (val === false) {
        this.spuData['isCrossBorderTrade'] = false
        this.spuData['isGeneralTrade'] = false
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log(from, ' My Party Gal舒适两用绵柔巾100')
    this.$store.dispatch('delView', from).then((res) => {
      next()
    })
  }
}
</script>

<style lang="scss" scoped>
.max-width {
  max-width: 1200px;
}
.sku-form-wrapper {
  width: 340px;
  min-width: 320px;
  margin-right: 20px;
  /deep/ .el-card__body {
    padding: 10px;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss">
.edit-product-page {
  .el-textarea__inner {
    height: 170px;
  }
  .tag-textarea .el-textarea__inner {
    height: 70px;
  }
  .col-radio-box {
    .el-radio-button__inner {
      width: 100px;
      white-space: pre-wrap;
    }
  }
  .upload-box {
    .el-upload--picture-card {
      background-color: transparent;
      border: none;
      width: auto;
      height: auto;
      line-height: 0;
      display: block;
      text-align: left;
    }
    &.hide {
      .el-upload--picture-card {
        display: none;
      }
    }
    .el-upload-list__item {
      width: auto;
      height: auto;
      overflow: visible;
      margin-bottom: 44px;
      .el-upload-list__item-thumbnail {
        max-width: 130px;
        max-height: 180px;
        vertical-align: middle;
      }
    }
  }
}
</style>
