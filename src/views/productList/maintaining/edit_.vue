<template>
  <div class="edit-product-page">
    <el-tabs v-model="activeName" @tab-click="onTabClick" :before-leave="beforeLeave">
      <!-- SPU -->
      <el-tab-pane label="编辑SPU" name="spu">
        <h4>基本信息</h4>
        <div>
          <el-form
            :model="spuData"
            :rules="formRules"
            ref="spuData"
            label-width="110px"
            size="mini"
          >
            <div class="row max-width">
              <div class="flex-2">
                <el-form-item v-if="spuData" label="分类" prop="cateCode">
                  <div class="col">
                    <select-category v-model="spuData.cateCode" :checkStrictly="false" />
                    <select-category
                      v-if="spuModifyData && oldSpuData.cateCode != spuData.cateCode"
                      v-model="oldSpuData.cateCode"
                      :checkStrictly="false"
                      :refresh="false"
                      :disabled="true"
                      class="mHis"
                    />
                  </div>
                </el-form-item>
                <el-form-item v-if="spuData" label="商品名称" prop="name">
                  <el-input v-model="spuData.name" placeholder="请输入"></el-input>
                  <el-input
                    class="mHis"
                    v-if="spuModifyData && oldSpuData.name != spuData.name"
                    v-model="oldSpuData.name"
                    placeholder="待审批商品名称"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item v-if="spuData" label="副标题" prop="title">
                  <el-input v-model="spuData.title" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item v-if="spuData" label="授权渠道范围" prop="scopeAuthorizas">
                  <select-add-good-channel-type
                    :multiple="true"
                    v-model="spuData.scopeAuthorizas"
                    ref="selectAddGoods"
                    :clearable="false"
                  />
                  <el-button
                    type="primary"
                    @click="selectAll"
                  >{{ selectAllType == 'all' ? '全选' : '反选' }}</el-button>
                </el-form-item>
                <el-form-item label="商品服务类型" prop="brandCategory">
                  <el-select v-model="spuData.brandCategory" @change="onGoodsTypeChange">
                    <el-option
                      v-for="item in brandCategoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="spuData" label="核心卖点描述" prop="productDescribe">
                  <el-input
                    v-model="spuData.productDescribe"
                    placeholder="请输入核心卖点描述(16个汉字内，包括标点符号)"
                    type="textarea"
                    resize="none"
                  ></el-input>
                </el-form-item>
                <el-form-item v-if="spuData" label="标签" prop="tag">
                  <tags v-model="spuData.tag" />
                  <el-tag
                    @click="addTag(item)"
                    style="cursor:pointer;margin-top:4px;"
                    size="medium"
                    type="info"
                    v-for="(item,index) in tagHistory"
                    :key="index"
                  >{{item}}</el-tag>
                </el-form-item>
              </div>
              <div class="flex-1">
                <el-form-item v-if="spuData" label="品牌" prop="brandId">
                  <select-brand v-model="spuData.brandId" isEnable />
                  <select-brand
                    v-if="spuModifyData && oldSpuData.brandId != spuData.brandId"
                    :reflush="false"
                    :disabled="true"
                    v-model="oldSpuData.brandId"
                    class="mHis"
                  />
                </el-form-item>
                <el-form-item v-if="spuData" label="产地" prop="producePlace">
                  <country-select v-model="spuData.producePlace" checkStrictly />
                </el-form-item>
                <el-form-item v-if="spuData" label="保质期(天)" prop="shelfLife">
                  <!-- <el-input v-model="spuData.shelfLife" placeholder="请输入"   onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input> -->
                  <el-input-number
                    v-model="spuData.shelfLife"
                    :min="0"
                    :step="1"
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
                  <el-radio
                    v-model="spuData.isNeedOnSale"
                    :label="true"
                    :disabled="spuData.isOnSale"
                  >是</el-radio>
                  <el-radio
                    v-model="spuData.isNeedOnSale"
                    :label="false"
                    :disabled="spuData.isOnSale"
                  >否（中小样/试用装/赠品）</el-radio>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div class="pl100">
          <el-button type="primary" @click="updateSpu('spuData')">保存</el-button>
          <el-button type="default" @click="returnList">返回列表</el-button>
        </div>
      </el-tab-pane>
      <!-- SKU -->
      <el-tab-pane label="编辑SKU" name="sku">
        <el-page-header title="返回列表" @back="returnList"></el-page-header>
        <div class="row pt20">
          <div class="fw600 fs16px h30 l-h30">属性规格</div>
          <div class="pl30">
            <!-- 主属性 -->
            <div>
              <!-- <div class="row pt10">
                <el-button type="primary" size="mini" style="margin-right: 10px;">主属性</el-button>
                <el-input v-if="spuData" v-model="spuData.firstAtbKey" size="small" placeholder="添加主属性" style="width: 220px;"></el-input>
              </div>-->
              <div class="row pt10" v-if="skuFirstAtbKey || spuData.firstAtbKey">
                <!-- <el-button type="info" size="mini" style="margin-right: 10px;">主属性值</el-button> -->
                <el-button
                  type="info"
                  size="mini"
                  style="margin-right: 10px;"
                >{{ skuFirstAtbKey || spuData.firstAtbKey }}</el-button>
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
              <div class="row pt10" v-if="skuSecondAtbKey || spuData.secondAtbKey">
                <!-- <el-button type="info" size="mini" style="margin-right: 10px;">辅属性值</el-button> -->
                <el-button
                  type="info"
                  size="mini"
                  style="margin-right: 10px;"
                >{{ skuSecondAtbKey || spuData.secondAtbKey }}</el-button>
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
        <div class="pt30">
          <!-- <el-button icon="el-icon-refresh" size="mini" circle title="刷新" @click="refreshSkuTab"></el-button> -->
          <el-button icon="el-icon-plus" size="mini" type="primary" @click="onAddSkuClick">添加SKU</el-button>
        </div>
        <!-- sku列表 -->
        <div class="row fs13 mt20" style="overflow-x: auto;">
          <el-card
            v-for="(item, index) in skuList"
            :key="index"
            :class="!item.isFiled || (item.skuModifyData && item.skuModifyData.isDelete) ? 'sku-form-wrapper skuHis' : 'sku-form-wrapper'"
          >
            <div slot="header">
              <div class="row center-y" style="justify-content: space-between">
                <div>
                  <el-tag v-if="item.isFiled" type="info">已建档</el-tag>
                  <el-tag v-else type="danger">未建档</el-tag>
                  <el-tag v-if="item.skuModifyData && item.skuModifyData.isDelete">待删除</el-tag>
                </div>
                <el-button type="text" @click="copySku(index)" class="fs14">
                  <i class="el-icon-document-copy"></i>
                </el-button>
              </div>
              <el-divider />
              <div class="row center-y" v-if="skuFirstAtbKey || spuData.firstAtbKey">
                <span class="pr4 must">{{ skuFirstAtbKey || spuData.firstAtbKey }}</span>
                <el-input
                  v-model="item.firstAtbValue"
                  placeholder="请输入主属性值"
                  class="flex-1"
                  size="mini"
                ></el-input>
              </div>
              <div class="row center-y mt10" v-if="skuSecondAtbKey || spuData.secondAtbKey">
                <span class="pr4">{{ skuSecondAtbKey || spuData.secondAtbKey }}</span>
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
                class="mt10"
                label-width="120px"
                :model="item"
                :rules="formSkuRules"
                :ref="`skuData${index}`"
              >
                <el-form-item>
                  <template slot="label">
                    <el-tooltip class="item" effect="dark" content="NC编码" placement="top">
                      <span>
                        规格编码
                        <i class="el-icon-info ml6"></i>
                      </span>
                    </el-tooltip>
                  </template>
                  <el-input v-model="item.skuSn" placeholder size="mini" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="商品助记码（屈臣氏商品必填）" prop="mnemonicCode">
                  <el-input v-model="item.mnemonicCode" placeholder="请输入助记码" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="商品条码" prop="codeBar" :show-message="false">
                  <el-input
                    v-model="item.codeBar"
                    placeholder="输入商品条码"
                    size="mini"
                    @blur="getSkuByCodeBar(index)"
                  ></el-input>
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
                  <el-input
                    type="number"
                    step="0.01"
                    v-if="item.skuModifyData && oldSkuList[index].msrp != item.msrp"
                    v-model="oldSkuList[index].msrp"
                    placeholder="输入建议零售价"
                    size="mini"
                    class="mHis"
                    disabled
                  ></el-input>
                </el-form-item>
                <!-- <el-form-item label="库存">
                  <el-input v-model="item.stock" placeholder="输入库存" size="mini"></el-input>
                </el-form-item>-->
                <el-form-item label="箱规" prop="wholesaleSpec" :show-message="false">
                  <el-input
                    v-model="item.wholesaleSpec"
                    placeholder="输入箱规(只能输入数字)"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="零售起订量（零售单位）">
                  <el-input
                    v-model="item.retailMinOrder"
                    placeholder="输入零售起订量"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="批发起订量（箱）">
                  <el-input
                    v-model="item.wholesaleMinOrder"
                    placeholder="输入批发起订量"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="长(mm)" prop="skuLength">
                  <el-input
                    v-model="item.skuLength"
                    v-on:input="calculateVolume(index)"
                    placeholder="输入长"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="宽(mm)" prop="skuWeight">
                  <el-input
                    v-model="item.skuWeight"
                    v-on:input="calculateVolume(index)"
                    placeholder="输入宽"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="高(mm)" prop="skuHeight">
                  <el-input
                    v-model="item.skuHeight"
                    v-on:input="calculateVolume(index)"
                    placeholder="输入高"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="单品体积（立方米）">
                  <el-input
                    v-model="item.unitvolume"
                    min="0"
                    placeholder="输入体积"
                    size="mini"
                    type="number"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item label="单品重量（KG）" prop="skuScale">
                  <el-input
                    v-model="item.skuScale"
                    placeholder="输入单品重量"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="外箱规格长(mm)" prop="longCartonSize">
                  <el-input
                    v-model="item.longCartonSize"
                    v-on:input="calculateCartonVolum('outside', index)"
                    placeholder="输入外箱规格长"
                    size="mini"
                    controls-position="right"
                    step="1"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="外箱规格宽(mm)" prop="widthCartonSize">
                  <el-input
                    v-model="item.widthCartonSize"
                    v-on:input="calculateCartonVolum('outside', index)"
                    placeholder="输入外箱规格宽"
                    size="mini"
                    step="1"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="外箱规格高(mm)" prop="highCartonSize">
                  <el-input
                    v-model="item.highCartonSize"
                    v-on:input="calculateCartonVolum('outside', index)"
                    placeholder="输入外箱规格高"
                    size="mini"
                    step="1"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="外箱体积（立方米）">
                  <el-input
                    v-model="item.cartonVolum"
                    placeholder="输入体积"
                    size="mini"
                    min="0"
                    type="number"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item label="外箱重量（KG）" prop="cartonScale">
                  <el-input
                    v-model="item.cartonScale"
                    placeholder="输入外箱重量"
                    size="mini"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="中箱规格长(mm)" prop="longMiddleCartonSize" :show-message="false">
                  <el-input
                    v-model="item.longMiddleCartonSize"
                    v-on:input="calculateCartonVolum('mid', index)"
                    placeholder="输入中箱规格长"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="中箱规格宽(mm)" prop="widthMiddleCartonSize" :show-message="false">
                  <el-input
                    v-model="item.widthMiddleCartonSize"
                    v-on:input="calculateCartonVolum('mid', index)"
                    placeholder="输入中箱规格宽"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="中箱规格高(mm)" prop="highMiddleCartonSize" :show-message="false">
                  <el-input
                    v-model="item.highMiddleCartonSize"
                    v-on:input="calculateCartonVolum('mid', index)"
                    placeholder="输入中箱规格高"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="中箱体积（立方米）">
                  <el-input
                    v-model="item.middleCartonVolume"
                    placeholder="输入体积"
                    size="mini"
                    min="0"
                    type="number"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item label="中箱重量（KG）" prop="middleCartonScale" :show-message="false">
                  <el-input
                    v-model="item.middleCartonScale"
                    placeholder="输入中箱重量"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="分销建议价(一般合作)">
                  <el-input
                    v-model="item.distributionPrice"
                    placeholder="输入分销定价"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                  <el-input
                    v-if="item.skuModifyData && oldSkuList[index].distributionPrice != item.distributionPrice"
                    v-model="oldSkuList[index].distributionPrice"
                    placeholder="输入分销定价"
                    size="mini"
                    class="mHis"
                    min="0"
                    type="number"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item label="分销建议价(战略合作)">
                  <el-input
                    v-model="item.distributionPriceStrategy"
                    placeholder="输入分销定价"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                  <el-input
                    v-if="item.skuModifyData && oldSkuList[index].distributionPriceStrategy != item.distributionPriceStrategy"
                    v-model="oldSkuList[index].distributionPriceStrategy"
                    placeholder="输入分销定价"
                    size="mini"
                    class="mHis"
                    disabled
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="最低控价" prop="minPrice">
                  <el-input
                    v-model="item.minPrice"
                    placeholder="输入最低控价"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                  <el-input
                    v-if="item.skuModifyData && oldSkuList[index].minPrice != item.minPrice"
                    v-model="oldSkuList[index].minPrice"
                    placeholder="输入最低控价"
                    size="mini"
                    class="mHis"
                    disabled
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="一件代发建议价(一般合作)" prop="dropShippingPrice">
                  <el-input
                    v-model="item.dropShippingPrice"
                    placeholder="输入一件代发建议价"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                  <el-input
                    v-if="item.skuModifyData && oldSkuList[index].dropShippingPrice != item.dropShippingPrice"
                    v-model="oldSkuList[index].dropShippingPrice"
                    placeholder="输入一件代发建议价"
                    size="mini"
                    class="mHis"
                    disabled
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="一件代发建议价(战略合作)">
                  <el-input
                    v-model="item.dropShippingPriceStrategy"
                    placeholder="输入一件代发建议价"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                  <el-input
                    v-if="item.skuModifyData && oldSkuList[index].dropShippingPriceStrategy != item.dropShippingPriceStrategy"
                    v-model="oldSkuList[index].dropShippingPriceStrategy"
                    placeholder="输入一件代发建议价"
                    size="mini"
                    class="mHis"
                    disabled
                    min="0"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="一件代发费用">
                  <el-input
                    v-model="item.dropShippingExpense"
                    placeholder="输入一件代发费用"
                    size="mini"
                    min="0"
                    type="number"
                  ></el-input>
                  <el-input
                    v-if="item.skuModifyData && oldSkuList[index].dropShippingExpense != item.dropShippingExpense"
                    v-model="oldSkuList[index].dropShippingExpense"
                    placeholder="输入一件代发费用"
                    size="mini"
                    class="mHis"
                    disabled
                    min="0"
                    type="number"
                  ></el-input>
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
                <el-form-item label="状态">
                  <el-radio v-model="item.isOnSale" :label="true" @change="onSaleClick(item.id)">启用</el-radio>
                  <el-radio
                    v-model="item.isOnSale"
                    :label="false"
                    @change="onOutSaleClick(item.id)"
                  >禁用</el-radio>
                </el-form-item>
                <el-form-item label="主推商品">
                  <el-radio v-model="item.isMainPush" :label="true" @change="onMainPush(item.id)">是</el-radio>
                  <el-radio
                    v-model="item.isMainPush"
                    :label="false"
                    @change="onOutMainPush(item.id)"
                  >否</el-radio>
                </el-form-item>
                <div>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="updateSku(item, 'skuData', index)"
                    class="w-full"
                  >保存</el-button>
                </div>
                <div>
                  <el-button
                    type="warning"
                    size="mini"
                    @click="deleteSku(item, index)"
                    class="w-full"
                  >删除</el-button>
                </div>
              </el-form>
            </div>
          </el-card>
        </div>
        <!-- 添加sku -->
      </el-tab-pane>
      <!-- 图片 -->
      <el-tab-pane label="商品图" name="images">
        <el-page-header title="返回列表" @back="returnList"></el-page-header>
        <div class="row pt20 pl20">
          <el-radio-group v-model="colRadio" class="col col-radio-box" @change="onColRadioChange">
            <el-radio-button label="spu">商品款图</el-radio-button>
            <el-radio-button v-for="(item, j) in skuList" :key="j" :label="item.id">
              {{ item.firstAtbValue }}
              <span v-if="item.secondAtbValue">：{{ item.secondAtbValue }}</span>
            </el-radio-button>
          </el-radio-group>
          <div class="pl20">
            <el-radio-group v-model="rowRadio" @change="onRowRadioChange">
              <el-radio-button label="1">商品轮播图</el-radio-button>
              <el-radio-button label="2">商品详情图</el-radio-button>
            </el-radio-group>
            <div
              class="pt20 upload-box"
              :class="{ 'hide': hideUploadIcon }"
              v-loading="imgListloading"
            >
              <upload-draggable
                :action="`${baseURL}/uploadGoodsImages`"
                :headers="uploadHeaders"
                :multiple="true"
                :before-upload="beforeUpload"
                :http-request="uploadRequest"
                @touch-change="touch_change"
                @on-remove="onRemoveImage"
                accept=".jpg, .jpeg, .png, .gif"
                v-model="fileList"
                is_touch_change
                :labelSelectName="rowRadio==1 ?'主图' : null"
                @on-select="onTitleImageChange"
                :labelSelectId="titleImageId"
              ></upload-draggable>
            </div>
            <div class="pt20 fs12">1、单张图片大小不超过10M，商品展示图不超过5张，商品详情图不超过20张</div>
            <div class="pt20 fs12">2、点击图片并拖动图片可调整展示顺序</div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="视频" name="video">
        <el-upload
          ref="spuShowUpload"
          :action="`${baseURL}/uploadGoodsVideo`"
          :headers="uploadHeaders"
          :on-success="handleVideoSuccess"
          :multiple="false"
          :limit="10"
          :show-file-list="false"
          :before-upload="beforeUploadVideo"
          :httpRequest="uploadVideoRequest"
        >
          <el-button slot="default" size="small" type="primary">选择展示视频</el-button>
          <el-button
            v-if="videoAttaList.length>0 && videoAttaList[0].attaUrl"
            @click.stop="onRemoveVideo"
            size="small"
            type="danger"
          >删除视频</el-button>
          <div slot="tip" class="el-upload__tip">只能上传视频文件，且不超过100M</div>
          <!-- <div v-if="videoUrl ==''" slot="default" style="position: absolute;top:10px">
                <div  class="product-trunk-btn">
                  <i class="el-icon-plus"></i>
                  <span>选择展示视频</span>
                </div>
          </div>-->
        </el-upload>
        <video
          style="width:560px;"
          v-if="videoAttaList.length>0 && videoAttaList[0].attaUrl"
          :src="videoAttaList[0].attaUrl"
          class="avatar"
          controls="controls"
        >您的浏览器不支持视频播放</video>
      </el-tab-pane>
    </el-tabs>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogImgVisible" width="fit-content">
      <img :src="dialogImageUrl" style="max-width: 600px; max-height: 600px;" />
    </el-dialog>

    <!-- 添加sku弹窗 -->
    <el-dialog title="添加sku" :visible.sync="showAddSkuItem" @close="cancelAddSku">
      <el-form
        :model="addSkuItem"
        :rules="formSkuRules"
        ref="addSkuItem"
        inline
        label-width="160px"
      >
        <el-form-item
          :label="skuFirstAtbKey || spuData.firstAtbKey"
          prop="firstAtbValue"
          v-if="skuFirstAtbKey || spuData.firstAtbKey"
        >
          <el-input v-model="addSkuItem.firstAtbValue" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item
          :label="skuSecondAtbKey || spuData.secondAtbKey"
          prop="secondAtbValue"
          v-if="skuSecondAtbKey || spuData.secondAtbKey"
        >
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
          <el-input v-model="addSkuItem.skuSn" placeholder="规格编码" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="codeBar" label="商品条码">
          <el-input v-model="addSkuItem.codeBar" placeholder="商品条码" @blur="getSkuByCodeBar(-1)"></el-input>
        </el-form-item>
        <el-form-item label="商品助记码（屈臣氏商品必填）" prop="mnemonicCode">
          <el-input v-model="addSkuItem.mnemonicCode" placeholder="请输入助记码" size="mini"></el-input>
        </el-form-item>
        <el-form-item prop="wholesaleSpec" label="箱规">
          <el-input-number
            v-model="addSkuItem.wholesaleSpec"
            placeholder="箱规"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="msrp" label="零售价">
          <el-input-number
            controls-position="right"
            :min="0"
            v-model="addSkuItem.msrp"
            placeholder="零售价"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="retailMinOrder" label="零售起订量（零售单位）">
          <el-input-number
            controls-position="right"
            :min="0"
            v-model="addSkuItem.retailMinOrder"
            placeholder="零售起订量（零售单位）"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="wholesaleMinOrder" label="批发起订量（箱）">
          <el-input-number
            controls-position="right"
            :min="0"
            v-model="addSkuItem.wholesaleMinOrder"
            placeholder="批发起订量（箱）"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="skuLength" label="长(mm)">
          <el-input
            controls-position="right"
            min="0"
            v-model="addSkuItem.skuLength"
            v-on:input="addCalculateVolume(addSkuItem)"
            placeholder="输入单品长度"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item prop="skuWeight" label="宽(mm)">
          <el-input
            controls-position="right"
            min="0"
            v-model="addSkuItem.skuWeight"
            v-on:input="addCalculateVolume(addSkuItem)"
            placeholder="输入单品宽度"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item prop="skuHeight" label="高(mm)">
          <el-input
            controls-position="right"
            min="0"
            v-model="addSkuItem.skuHeight"
            v-on:input="addCalculateVolume(addSkuItem)"
            placeholder="输入单品高度"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="单品体积（立方米）">
          <el-input
            v-model="addSkuItem.unitvolume"
            placeholder="输入体积"
            min="0"
            size="mini"
            type="number"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="单品重量（KG）" prop="skuScale">
          <el-input
            v-model="addSkuItem.skuScale"
            placeholder="输入单品重量"
            min="0"
            size="mini"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="外箱规格长(mm)" prop="longCartonSize">
          <el-input
            v-model="addSkuItem.longCartonSize"
            v-on:input="addCalculateCartonVolum(addSkuItem)"
            placeholder="输入外箱规格长"
            min="0"
            size="mini"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="外箱规格宽(mm)" prop="widthCartonSize">
          <el-input
            v-model="addSkuItem.widthCartonSize"
            v-on:input="addCalculateCartonVolum(addSkuItem)"
            placeholder="输入外箱规格宽"
            min="0"
            size="mini"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="外箱规格高(mm)" prop="highCartonSize">
          <el-input
            v-model="addSkuItem.highCartonSize"
            v-on:input="addCalculateCartonVolum(addSkuItem)"
            placeholder="输入外箱规格高"
            min="0"
            size="mini"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="外箱体积（立方米）">
          <el-input
            v-model="addSkuItem.cartonVolum"
            placeholder="输入体积"
            min="0"
            size="mini"
            type="number"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="外箱重量（KG）" prop="cartonScale">
          <el-input
            v-model="addSkuItem.cartonScale"
            placeholder="输入外箱重量"
            min="0"
            size="mini"
            type="number"
          ></el-input>
        </el-form-item>

        <el-form-item label="分销定价(一般合作)">
          <el-input-number
            controls-position="right"
            v-model="addSkuItem.distributionPrice"
            placeholder="输入分销定价"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="分销定价(战略合作)">
          <el-input-number
            controls-position="right"
            v-model="addSkuItem.distributionPriceStrategy"
            placeholder="输入分销定价"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="最低控价" prop="minPrice">
          <el-input-number
            controls-position="right"
            v-model="addSkuItem.minPrice"
            :min="0"
            placeholder="输入最低控价"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="一件代发建议价(一般合作)">
          <el-input-number
            controls-position="right"
            :min="0"
            v-model="addSkuItem.dropShippingPrice"
            placeholder="输入价"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="一件代发建议价(战略合作)">
          <el-input-number
            controls-position="right"
            :min="0"
            v-model="addSkuItem.dropShippingPriceStrategy"
            placeholder="输入价"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="代发费用">
          <el-input-number
            controls-position="right"
            :min="0"
            v-model="addSkuItem.dropShippingExpense"
            placeholder="输入代发费用"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="合作状态">
          <el-radio v-model="addSkuItem.workStatus" label="正常销售">正常销售</el-radio>
          <el-radio v-model="addSkuItem.workStatus" label="清货">清货</el-radio>
        </el-form-item>
        <el-form-item label="所属部门（屈臣氏商品必填）" prop="departmentName">
          <el-select v-model="addSkuItem.departmentName" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in departments"
              :key="item.code"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="addSkuItem.isOnSale" :label="true">启用</el-radio>
          <el-radio v-model="addSkuItem.isOnSale" :label="false">禁用</el-radio>
        </el-form-item>
        <el-form-item label="主推商品">
          <el-radio v-model="addSkuItem.isMainPush" :label="true">是</el-radio>
          <el-radio v-model="addSkuItem.isMainPush" :label="false">否</el-radio>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" size="mini" @click="addSku('addSkuItem')" style="width: 300px;">添加</el-button>
        <!-- <el-button size="mini" @click="cancelAddSku">取消</el-button> -->
      </div>
    </el-dialog>

    <el-dialog
      title="已存在重复商品条码信息"
      :visible.sync="codeBarShow"
      width="1000px"
      :close-on-click-modal="false"
      @close="cancelCodeBarShow"
    >
      <div>
        <el-form label-width="100px" size="mini">
          <div class="row max-width">
            <div class="flex-1">
              <el-form-item label="商品条码" prop="codeBar">
                <el-input v-model="tempSku.codeBar" style="width: 140px;" disabled></el-input>
              </el-form-item>

              <el-form-item
                :label="tempSku.firstAtbKey"
                prop="firstAtbValue"
                v-if="tempSku.firstAtbKey"
              >
                <el-input v-model="tempSku.firstAtbValue" style="width: 140px;" disabled></el-input>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="tempSku.name" style="width: 140px;" disabled></el-input>
              </el-form-item>

              <el-form-item
                :label="tempSku.secondAtbKey"
                prop="secondAtbValue"
                v-if="tempSku.secondAtbKey"
              >
                <el-input v-model="tempSku.secondAtbValue" style="width: 140px;" disabled></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <el-table :data="codeBarList" border stripe>
        <el-table-column label="nc码" prop="skuSn">
          <template slot-scope="scope">
            <span>{{ scope.row.skuSn }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品名称" prop="name">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="主属性名称" prop="firstAtbKey">
          <template slot-scope="scope">
            <span>{{ scope.row.firstAtbKey }}</span>
          </template>
        </el-table-column>

        <el-table-column label="主属性值" prop="firstAtbKey">
          <template slot-scope="scope">
            <span>{{ scope.row.firstAtbValue }}</span>
          </template>
        </el-table-column>

        <el-table-column label="副属性名称" prop="secondAtbKey">
          <template slot-scope="scope">
            <span>{{ scope.row.secondAtbKey }}</span>
          </template>
        </el-table-column>

        <el-table-column label="副属性" prop="secondAtbValue">
          <template slot-scope="scope">
            <span>{{ scope.row.secondAtbValue }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品条码" prop="codeBar">
          <template slot-scope="scope">
            <span>{{ scope.row.codeBar }}</span>
          </template>
        </el-table-column>

        <el-table-column label="所属部门" prop="departmentName">
          <template slot-scope="scope">
            <span>{{ scope.row.departmentName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- sku删除确认框 -->
    <el-dialog
      title="SKU删除提示"
      :visible.sync="showDeleteSkuConfirmDialog"
      width="1000px"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          label-width="100px"
          size="mini"
          :model="skuDeleteForm"
          ref="skuDeleteForm"
          :rules="{
              reason: [
                { required: true, message: '请填写删除原因', trigger: 'blur' }
              ]
            }"
        >
          <div class="row max-width">
            <div class="flex-1">
              <el-form-item label="删除原因" prop="reason">
                <el-input type="textarea" :rows="6" v-model="skuDeleteForm.reason"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="row max-width" v-if="currentSkuDeleteForm.sku.isFiled">
            <h3 style="color:red;">备注：修改信息后，商品需要提交OA审批后生效</h3>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDeleteSkuConfirmDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uniqueArrByKey, isEmpty, deepClone, toNumberStr } from '@/utils'
import { getDepartmentList, getDanweiList } from '@/api/channel'
import { baseURL, headersTokenKey } from '@/config'
import SelectBrand from '@/components/SelectBrand'
import SelectAddGoodChannelType from '@/components/SelectAddGoodChannelType'
import SelectCategory from '@/components/SelectCategory'
import Tags from '@/components/Tags'
import BigNumber from 'bignumber.js'
import { getBrandById } from '@/api/brand'
import { getSpuTagList } from '@/api/goods'
import CountrySelect from '@/components/CountrySelect'
import { brandCategory } from '@/const/goods'
import UploadDraggable from '@/components/UploadDraggable'
export default {
  name: 'ProductMaintainingEdit',
  title: '商品编辑',
  components: {
    SelectBrand,
    SelectCategory,
    SelectAddGoodChannelType,
    Tags,
    CountrySelect,
    UploadDraggable
  },
  data() {
    return {
      radio: 0,
      activeName: 'spu',
      firstClickSkuTab: true,
      spuId: null,
      oldSpuData: {},
      spuData: {},
      spuModifyData: null,
      oldSkuList: [],
      skuList: [],
      isLoadingCateList: false,
      isLoadingBrandList: false,
      videoAttaList: [],
      firstAtbValueArr: [], // 主属性值数组
      secondAtbValueArr: [], // 辅属性值数组
      firstAtbValueInputVisible: false, // 是否显示主属性值输入框
      firstAtbValueInputValue: '', // 主属性值
      secondAtbValueInputVisible: false, // 是否显示辅属性值输入框
      secondAtbValueInputValue: '', // 辅属性值
      colRadio: 'spu', // 侧边栏当前按钮，默认spu
      rowRadio: '1', // 横向切换按钮，默认商品展示图(1商品展示图, 2商品详情图)
      currentImageList: [],
      baseURL: baseURL,
      skuFirstAtbKey: '',
      skuSecondAtbKey: '',
      sysTag: [],
      addSkuItem: {
        // 为新增的sku对象添加空属性
        wholesaleMinOrder: 0,
        retailMinOrder: 0,
        firstAtbValue: '',
        secondAtbValue: '',
        skuSn: '',
        codeBar: '',
        msrp: '',
        wholesaleSpec: '',
        skuLength: '',
        skuWeight: '',
        skuHeight: '',
        isOnSale: true,
        workStatus: '正常销售',
        distributionPrice: 0,
        distributionPriceStrategy: 0,
        innerPrice: 0,
        minPrice: '',
        dropShippingPrice: 0,
        dropShippingPriceStrategy: 0,
        dropShippingExpense: 0,
        mnemonicCode: '', //商品助记码（屈臣氏商品必填）
        longCartonSize: '', //外箱规格高
        widthCartonSize: '', //外箱规格宽
        highCartonSize: '', //外箱规格高
        cartonVolum: 0, //外箱体积
        unitvolume: 0, //单品体积
        skuScale: '', //单品体重
        cartonScale: '', //外箱重量
        isMainPush: false
      },
      backupAddItem: {},
      showAddSkuItem: false,
      dialogImgVisible: false, // 显示预览图片弹窗
      dialogImageUrl: '', // 弹窗内图片
      imgListloading: false, // 图片列表loading
      titleImageId: null,
      isImportGoods: false, // 是否进口品
      addSkuDialog: false,
      formRules: {
        cateCode: [
          {
            required: true,
            type: 'string',
            message: '请选择商品分类',
            trigger: 'change'
          }
        ],
        brandCategory: [
          { required: true, message: '请选择商品服务类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入商品名称', trigger: 'change' }
        ],
        brandId: [{ required: true, message: '请选择品牌', trigger: 'change' }],
        firstAtbKey: [
          { required: true, message: '请输入主属性', trigger: 'change' }
        ],
        scopeAuthorizas: [
          {
            required: true,
            validator: (rule, value, callback) => {
              setTimeout(() => {
                console.log(this.spuData.scopeAuthorizas)
                if (
                  !this.spuData.scopeAuthorizas ||
                  this.spuData.scopeAuthorizas.length === 0
                ) {
                  callback(new Error('请选择授权渠道范围'))
                } else {
                  callback()
                }
              }, 100)
            },
            trigger: 'change'
          }
        ],
        productDescribe: [
          {
            required: true,
            message: '请输入核心卖点描述(16个汉字内，包括标点符号)',
            trigger: 'change'
          },
          {
            min: 0,
            max: 16,
            message: '核心卖点描述已超过16个汉字，包括标点符号。',
            trigger: 'change'
          }
        ],
        producePlace: [
          { required: true, message: '请输入产地', trigger: 'change' }
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
          { required: true, message: '请输入零售单位', trigger: 'change' }
        ]
      },
      formSkuRules: {
        codeBar: [
          { required: true, message: '请填写商品条码', trigger: 'change' }
        ],
        msrp: [
          { required: true, message: '请填写商品建议零售价', trigger: 'change' }
        ],
        firstAtbValue: [
          { required: true, message: '请填写商品主属性值', trigger: 'change' }
        ],
        wholesaleSpec: [
          { required: true, message: '请填写箱规', trigger: 'change' }
        ],
        skuScale: [
          { required: true, message: '请填写单品重量', trigger: 'change' }
        ],
        cartonScale: [
          { required: true, message: '请填写外箱重量', trigger: 'change' }
        ],
        skuLength: [
          { required: true, message: '请填写单品长度', trigger: 'change' }
        ],
        skuWeight: [
          { required: true, message: '请填写单品宽度', trigger: 'change' }
        ],
        skuHeight: [
          { required: true, message: '请填写单品高度', trigger: 'change' }
        ],
        longCartonSize: [
          { required: true, message: '请填写外箱长度', trigger: 'change' }
        ],
        widthCartonSize: [
          { required: true, message: '请填写外箱宽度', trigger: 'change' }
        ],
        highCartonSize: [
          { required: true, message: '请填写外箱高度', trigger: 'change' }
        ],
        minPrice: [
          { required: true, message: '请填写最低控价', trigger: 'change' }
        ],
        departmentName: [
          { required: false, message: '请填写所属部门', trigger: 'change' }
        ]
      },
      departments: [], //所属公司
      danweis: [], //计量单位
      selectAllType: 'all',
      tempSku: {},
      codeBarList: [],
      codeBarShow: false,
      selectSpuIndex: 0,
      brandCategoryOptions: brandCategory.properties,
      needRefresh: false, // 是否需要刷新
      isSpuCompleted: false,
      countSku: 0,
      skuDeleteForm: {
        spuId: '',
        skuId: '',
        reason: ''
      },
      showDeleteSkuConfirmDialog: false,
      currentSkuDeleteForm: {
        sku: {},
        index: 0
      },
      backupSkuAttributeList: [] // 属性列表备份
    }
  },
  computed: {
    tagHistory() {
      let arr = this.sysTag
      if (this.spuData.tag) {
        this.spuData.tag.forEach((items) => {
          arr.forEach((item, index) => {
            if (item == items) {
              arr.splice(index, 1)
            }
          })
        })
      }
      return arr
    },
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
    this.spuId = Number(this.$route.query.id)
    this.backupAddItem = JSON.parse(JSON.stringify(this.addSkuItem))
    this.init()
  },
  mounted() {},
  methods: {
    // #region 商品图 tab
    touch_change(e) {
      let arr = e.map((key) => key.id)
      this.$post('/goods/images/move', arr).then((res) => {})
      this.currentImageList = e
      console.log(e, 'touch_change')
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
      this.deleteImage(file.id)
    },
    // 上传前校验格式和大小
    beforeUpload(file) {
      let type = ['image/png', 'image/jpeg', 'image/jpg']
      const isType = type.includes(file.type)
      const isSize = file.size / 1024 / 1024 < 10
      if (!isType) {
        this.$message.error('图片格式只能是png，jpg， jpeg')
      }
      if (!isSize) {
        this.$message.error('图片大小不能超过 10MB!')
      }
      // console.log(isType && isSize)
      return isType && isSize
    },
    // uploadRequest(data) {
    //   console.info("自定义上传");
    //   const _file = data.file;
    //   var formData = new FormData();
    //   formData.append("file", _file);
    //   return new Promise((resolve, reject) => {
    //     this.$post(data.action, formData)
    //       .then((res) => {
    //         resolve(res);
    //       })
    //       .catch((err) => {
    //         reject();
    //       });
    //   });
    // },
    async uploadRequest(data) {
      console.info('自定义上传')
      const _file = data.file
      var formData = new FormData()
      formData.append('file', _file)
      this.$store.commit('SHOW_LOADING', '上传')
      let responseUrl
      await this.$post(data.action, formData)
        .then((res) => {
          responseUrl = res
        })
        .catch((err) => {
          this.$message.error('上传失败，请重新上传')
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
      if (responseUrl) {
        this.addImage(responseUrl)
      }
    },
    // 添加图片URL到后台
    async addImage(imageUrl) {
      let url = '/goods/images/add' // 接口地址
      let params = {
        // 参数
        imagePath: imageUrl
      }
      if (this.colRadio === 'spu') {
        // spu
        if (this.rowRadio === '1') {
          // 展示图
          url += 'SpuShowImage'
        } else if (this.rowRadio === '2') {
          // 详情图
          url += 'SpuDetailsImages'
        }
        params['spuId'] = this.spuId
      } else {
        // sku
        if (this.rowRadio === '1') {
          // 展示图
          url += 'SkuShowImage'
        } else if (this.rowRadio === '2') {
          // 详情图
          url += 'SkuDetailsImages'
        }
        params['skuId'] = this.colRadio
      }
      this.$store.commit('SHOW_LOADING', '添加图片中')
      await this.$post(url, params)
        .then((res) => {
          // console.log(res)
          this.$message.success('添加成功')
          if (this.colRadio === 'spu') {
            this.fetchImagesPager('spu', this.spuId)
          } else {
            this.fetchImagesPager('sku', this.colRadio)
          }
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    },
    // 删除图片
    async deleteImage(imageId) {
      this.$store.commit('SHOW_LOADING', '删除图片中')
      await this.$delete(`/goods/images/delete/${imageId}`)
        .then((res) => {
          // console.log(res)
          this.$message.success('删除成功')
          this.currentImageList = this.currentImageList.filter((item) => {
            return item.id !== imageId
          })
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    },
    // 设置主图
    onTitleImageChange(item) {
      this.$put(`/goods/images/enableTitleImage/${item.id}`).then((res) => {
        this.$message.success('设置成功')
      })
    },
    // #endregion

    // #region 视频tab
    onRemoveVideo() {
      this.$store.commit('SHOW_LOADING')
      this.$delete(
        `/goods/video/delAttachment/${this.videoAttaList[0].id}`
      ).then((res) => {
        this.videoAttaList = []
        this.$message.success('删除成功')
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    fetchVideoPager() {
      this.$get(`/goods/video/videoAttaList/${this.spuId}`).then((res) => {
        this.videoAttaList = res
      })
    },
    handleVideoSuccess(res, file) {
      if (file && file.response) {
        this.$post('/goods/video/addAttachment', {
          spuId: this.spuId,
          attaUrl: file.response.url,
          snapshot: file.response.snapshot
        }).then((res) => {
          this.videoAttaList = [
            {
              attaUrl: file.response.url,
              snapshot: file.response.snapshot,
              id: res
            }
          ]
          this.$store.commit('SHOW_LOADING', false)
          this.$message.success('视频上传成功')
        })
      } else {
        this.$message.error('视频上传失败，请重新上传！')
      }
    },
    beforeUploadVideo(file) {
      const isLt100M = file.size / 1024 / 1024 < 100
      if (
        [
          'video/mp4',
          'video/ogg',
          'video/flv',
          'video/avi',
          'video/wmv',
          'video/rmvb'
        ].indexOf(file.type) == -1
      ) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLt100M) {
        this.$message.error('上传视频大小不能超过100MB哦!')
        return false
      }
      this.$store.commit('SHOW_LOADING', '视频上传中')
    },
    uploadVideoRequest(data) {
      console.info('自定义上传')
      const _file = data.file
      var formData = new FormData()
      formData.append('file', _file)

      return new Promise((resolve, reject) => {
        this.$post(data.action, formData)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject()
          })
      })
    },
    // #endregion

    // #region sputab
    addTag(item) {
      this.spuData.tag.push(item)
    },
    // 删除属性
    deleteAtbKey(type) {
      if (type === 'first') {
        this.deleteOnSkuList('first', this.spuData.firstAtbKey, 'key')
        this.spuData.firstAtbKey = ''
        this.firstAtbValueArr = []
      } else if (type === 'second') {
        this.deleteOnSkuList('second', this.spuData.secondAtbKey, 'key')
        this.spuData.secondAtbKey = ''
        this.secondAtbValueArr = []
      }
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
      this.$refs[formName].validate((valid) => {
        console.info('开始校验spu')
        if (valid) {
          let isNeed = false
          if (this.isSpuNeedOAApproval(this.oldSpuData, this.spuData)) {
            isNeed = true
          }
          this.$confirm(
            isNeed
              ? '信息变更如涉及名称、分类、品牌，需要提交OA审批后生效，确认更新吗？'
              : '确认更新吗？',
            {
              type: 'warning'
            }
          ).then(() => {
            let cateIds = this.spuData.cateCode.split('-')
            let params = _.cloneDeep(this.spuData)
            console.log('spu', params)
            params['cateId'] = Number(cateIds[cateIds.length - 1])
            params['tags'] = this.spuData['tag']
            if (params.scopeAuthorizas && params.scopeAuthorizas.length > 0) {
              params.scopeAuthoriza = params.scopeAuthorizas.join(',')
            }
            this.$store.commit('SHOW_LOADING', '修改spu')
            this.$post('/goods/spu/updateSpu', params)
              .then((res) => {
                this.needRefresh = true
                this.init()
                this.$message.success(
                  isNeed ? '保存成功，请返回列表页刷新后提交审批' : '修改成功'
                )
              })
              .finally(() => {
                this.$store.commit('SHOW_LOADING', false)
              })
          })
        } else {
          this.$message.error('必填项未填或格式不正确')
        }
      })
    },
    isSpuNeedOAApproval(oldSpuData, spuData) {
      return (
        oldSpuData.isFiled &&
        (oldSpuData.name != spuData.name ||
          oldSpuData.cateCode != spuData.cateCode ||
          oldSpuData.brandId != spuData.brandId)
      )
    },
    onGoodsTypeChange(val) {
      if (['2', '5'].includes(this.spuData.brandCategory)) {
        this.formSkuRules.msrp[0].required = false
        this.formSkuRules.minPrice[0].required = false
      } else {
        this.formSkuRules.msrp[0].required = true
        this.formSkuRules.minPrice[0].required = true
      }
    },
    selectAll() {
      this.$refs.selectAddGoods.selectAll(this.selectAllType)
      this.selectAllType = this.selectAllType == 'all' ? 'cancel' : 'all'
    },
    // #endregion sputab

    // #region 获取数据
    async init() {
      try {
        this.$store.commit('SHOW_LOADING')
        await this.$get(`/goods/spu/getOne/${this.spuId}`).then(async (res) => {
          console.log('spu=>', res)
          // console.log(res)
          this.spuData = res
          if (this.spuData.scopeAuthoriza) {
            this.spuData['scopeAuthorizas'] = this.spuData.scopeAuthoriza.split(
              ','
            )
          } else {
            this.spuData['scopeAuthorizas'] = []
          }
          this.isImportGoods =
            res.isCrossBorderTrade === true || res.isGeneralTrade === true
          console.log(this.spuData.cateCode)

          //拷贝数据到历史变更，用于表单提交时，判断是否有OA审批字段变更
          Object.assign(this.oldSpuData, this.spuData)

          this.fetchVideoPager()
          // console.info('init() -> spuDetail', this.spuData.cateCode)
        })

        this.$get(`/goods/spu/getSpuModify/${this.spuId}`).then((res) => {
          if (res) {
            this.spuModifyData = res
            this.spuData.name = this.spuModifyData.name
            this.spuData.cateCode = this.spuModifyData.cateCode
            this.spuData.brandId = this.spuModifyData.brandId
          }
          // console.info('init() -> spuModify', this.spuModifyData.cateCode)
        })
        this.onGoodsTypeChange()
        getDepartmentList().then((res) => {
          this.departments = res
        })

        getDanweiList().then((res) => {
          this.danweis = res
        })
        this.getSysTag()
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },
    async onTabClick(tab, event) {
      // console.log(tab, event)
      if (tab.name === 'sku') {
        try {
          this.$store.commit('SHOW_LOADING')
          this.$refs['spuData'].validate(async (valid) => {
            if (valid) {
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
          this.skuList = await this.fetchSkuList()
          this.fetchImagesPager('spu', this.spuId)
        } finally {
          this.$store.commit('SHOW_LOADING', false)
        }
      }
    },
    // spu
    fetchSpuData() {
      return new Promise((resolve, reject) => {
        this.$get(`/goods/spu/getOne/${this.spuId}`)
          .then(async (res) => {
            this.spuData = res
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // sku列表
    fetchSkuList() {
      return new Promise((resolve, reject) => {
        this.$post('/goods/sku/getSkuPager', {
          spuId: this.spuId,
          pageIndex: 1,
          pageSize: this.$maxNumber,
          isDelete: false
        })
          .then(async (res) => {
            let skuList = res.list || []
            // for (let index in skuList) {
            //   let sku = skuList[index];
            //   let oldSkuData = {};
            //   Object.assign(oldSkuData, sku);
            //   this.oldSkuList.push(oldSkuData);
            //   let skuModifyData = await this.$get(
            //     `/goods/sku/getSkuModify/${sku.id}`
            //   );
            //   sku["skuModifyData"] = skuModifyData;
            // }

            // for (let index in skuList) {
            //   let sku = skuList[index];
            //   skuList[index].cartonVolum=toNumberStr(skuList[index].cartonVolum,20);
            //   skuList[index].unitvolume=toNumberStr(skuList[index].unitvolume,20);
            //   let skuModifyData = sku["skuModifyData"];
            //   if (skuModifyData) {
            //     sku.msrp = skuModifyData.msrp;
            //     sku.distributionPrice = skuModifyData.distributionPrice;
            //     sku.distributionPriceStrategy =
            //       skuModifyData.distributionPriceStrategy;
            //     sku.minPrice = skuModifyData.minPrice;
            //     sku.dropShippingPrice = skuModifyData.dropShippingPrice;
            //     sku.dropShippingPriceStrategy =
            //       skuModifyData.dropShippingPriceStrategy;
            //     sku.dropShippingExpense = skuModifyData.dropShippingExpense;
            //   }
            // }

            let skuModifyDataList = await Promise.all(
              skuList.map((sku) =>
                this.$get(`/goods/sku/getSkuModify/${sku.id}`)
              )
            )
            this.oldSkuList = JSON.parse(JSON.stringify(skuList))
            skuList = skuList.map((sku, sku_i) => {
              let skuModifyData = skuModifyDataList[sku_i]
              if (!skuModifyData) {
                sku.cartonVolum = toNumberStr(sku.cartonVolum, 20)
                sku.unitvolume = toNumberStr(sku.unitvolume, 20)
                return sku
              }
              let {
                msrp,
                distributionPrice,
                distributionPriceStrategy,
                minPrice,
                dropShippingPrice,
                dropShippingExpense
              } = skuModifyData
              return {
                ...sku,
                skuModifyData,
                cartonVolum: toNumberStr(sku.cartonVolum, 20),
                unitvolume: toNumberStr(sku.unitvolume, 20),
                msrp,
                distributionPrice,
                distributionPriceStrategy,
                minPrice,
                dropShippingPrice,
                dropShippingExpense
              }
            })
            console.log(this.oldSkuList)
            console.log('===')
            this.backupSkuAttributeList = (skuList || []).map((v) => ({
              firstAtbValue: v.firstAtbValue,
              secondAtbValue: v.secondAtbValue
            }))
            resolve(skuList)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取图片列表
    fetchImagesPager(type, id) {
      // type:'spu/sku', id:skuId,spuId
      return new Promise((resolve, reject) => {
        let params = {
          pageIndex: 1,
          pageSize: 1000
        }
        if (type === 'spu') {
          params['spuId'] = id
        } else if (type === 'sku') {
          params['skuId'] = id
        }
        this.imgListloading = true
        this.$post('/goods/images/getImagesPager', params)
          .then((res) => {
            // console.log(res)
            this.currentImageList = res.list
            this.currentImageList.forEach((item) => {
              if (item.isTitleImage) {
                this.titleImageId = item.id
              }
            })
            resolve(res.list)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            this.imgListloading = false
          })
      })
    },
    getSysTag() {
      let param = { type: '1' }
      getSpuTagList(param).then((res) => {
        if (res && res.length > 0) {
          this.sysTag = []
          res.forEach((item) => {
            this.sysTag.push(item.name)
          })
        }
      })
    },
    // #endregion 获取数据

    // #region skutab
    onAddSkuClick() {
      this.showAddSkuItem = true
      this.addSkuItem = JSON.parse(JSON.stringify(this.backupAddItem))
    },
    copySku(index) {
      this.showAddSkuItem = true
      setTimeout(() => {
        console.log(this.skuList[index])
        let newSku = JSON.parse(JSON.stringify(this.skuList[index]))
        this.addSkuItem = newSku
        this.addSkuItem.id = '' // 清空助记码
        this.addSkuItem.mnemonicCode = '' // 清空助记码
        this.addSkuItem.codeBar = '' // 清空条码
        this.addSkuItem.skuSn = '' // 清空规格编码
        this.addSkuItem.isMainPush = false // 是否主推清空
      }, 10)
    },
    cancelAddSku() {
      this.$refs['addSkuItem'].resetFields()
      this.addSkuItem.unitvolume = 0
      this.addSkuItem.cartonVolum = 0
      this.showAddSkuItem = false
    },
    // 添加sku
    addSku(formName) {
      // #region 校验规格
      let skus = JSON.parse(JSON.stringify(this.backupSkuAttributeList))
      let isSkuAttrEqual = skus.some(
        (sku, sku_i) =>
          sku.firstAtbValue === this.addSkuItem.firstAtbValue &&
          sku.secondAtbValue === this.addSkuItem.secondAtbValue
      )
      if (isSkuAttrEqual) {
        this.$message.error(`规格名称重复，请重新输入`)
        return
      }
      // #endregion
      this.$refs[formName].validate((valid) => {
        console.info('开始校验新增sku')
        if (valid) {
          this.$confirm('修改信息后，商品会下架待审，确认更新吗？', {
            type: 'warning'
          }).then(() => {
            this.$store.commit('SHOW_LOADING', '添加SKU')
            this.addSkuItem['spuId'] = this.spuId
            this.addSkuItem['firstAtbKey'] =
              this.skuFirstAtbKey || this.spuData.firstAtbKey
            this.addSkuItem['secondAtbKey'] =
              this.skuSecondAtbKey || this.spuData.secondAtbKey
            if (this.addSkuItem.msrp == null || this.addSkuItem.msrp === '') {
              this.addSkuItem['msrp'] = 0
            }
            if (
              this.addSkuItem.minPrice == null ||
              this.addSkuItem.minPrice === ''
            ) {
              this.addSkuItem['minPrice'] = 0
            }

            this.$post('/goods/sku/addSku', this.addSkuItem)
              .then((res) => {
                // console.log(res)
                this.$message.success('添加sku成功')
                this.$refs['addSkuItem'].resetFields()
                this.addSkuItem['cartonVolum'] = 0
                this.addSkuItem['unitvolume'] = 0
                this.showAddSkuItem = false
                this.refreshSkuTab()
              })
              .finally(() => {
                this.$store.commit('SHOW_LOADING', false)
              })
          })
        }
      })
    },
    // 删除sku
    deleteSku(sku, index) {
      // console.log('删除', sku, index)
      this.$confirm(
        sku.isFiled
          ? '修改信息后，商品需要提交OA审批后生效，确认删除吗？'
          : '确认删除吗？',
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.openDeleteSkuConfirmDialog(sku, index)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    openDeleteSkuConfirmDialog(sku, index) {
      this.currentSkuDeleteForm.sku = sku
      this.currentSkuDeleteForm.index = index
      this.skuDeleteForm.spuId = sku.spuId
      this.skuDeleteForm.skuId = sku.id
      this.skuDeleteForm.reason = ''
      this.showDeleteSkuConfirmDialog = true
    },
    deleteSkuConfirm() {
      this.$refs['skuDeleteForm'].validate(async (valid) => {
        if (valid) {
          this.$store.commit('SHOW_LOADING', '删除sku')
          this.$delete(`/goods/sku/delete`, this.skuDeleteForm)
            .then(async (res) => {
              // console.log(res)
              this.$message.success('删除成功')
              this.skuList.splice(this.currentSkuDeleteForm.index, 1)
              this.currentSkuDeleteForm.sku.isDelete = !this
                .currentSkuDeleteForm.sku.isDelete
              this.skuList = await this.fetchSkuList()
              this.initAtbValueArr()
              this.showDeleteSkuConfirmDialog = false
            })
            .finally(() => {
              this.$store.commit('SHOW_LOADING', false)
            })
        }
      })
    },
    resumeSku(sku, index) {
      console.log('恢复', sku, index)
      this.$confirm('确认恢复？', {
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SHOW_LOADING', '恢复sku')
          this.$put(`/goods/sku/resume/${sku.id}`)
            .then((res) => {
              // console.log(res)
              this.$message.success('恢复成功')
              // this.skuList.splice(index, 1)
              sku.isDelete = !sku.isDelete
              // this.initAtbValueArr()
            })
            .finally(() => {
              this.$store.commit('SHOW_LOADING', false)
            })
        })
        .catch(() => {})
    },
    // 修改sku
    updateSku(sku, formName, index) {
      // #region 校验规格
      let skus = JSON.parse(JSON.stringify(this.backupSkuAttributeList))
      let isSkuAttrEqual = skus.some((s, sku_i) => {
        return (
          sku_i !== index &&
          s.firstAtbValue === sku.firstAtbValue &&
          s.secondAtbValue === sku.secondAtbValue
        )
      })
      if (isSkuAttrEqual) {
        this.$message.error(`规格名称重复，请重新输入`)
        return
      }
      // #endregion
      console.info('对比价格字段：', this.oldSkuList[index].msrp, sku.msrp)
      formName += index
      this.$refs[formName][0].validate((valid) => {
        console.info('开始校验sku=>', formName)
        if (valid) {
          if (!sku.workStatus || sku.workStatus === '') {
            this.$message.error('合作状态不能为空')
            return
          }
          if (
            sku.isOnSale === 'undefined' ||
            sku.isOnSale == null ||
            sku.isOnSale === ''
          ) {
            this.$message.error('启用/禁用状态不能为空')
            return
          }
          let isNeed = false
          if (this.isSkuNeedOAApproval(this.oldSkuList[index], sku)) {
            isNeed = true
          }
          this.$confirm(
            isNeed
              ? '资料修改涉及金额字段，需要提交OA审批后生效，确认更新吗？'
              : '确认更新吗？',
            {
              type: 'warning'
            }
          ).then(() => {
            this.$store.commit('SHOW_LOADING', '修改sku')
            sku.msrp = sku.msrp || 0
            sku.minPrice = sku.minPrice || 0
            this.$post('/goods/sku/updateSku', sku)
              .then(async (res) => {
                this.$message.success(
                  isNeed
                    ? '保存成功，请返回列表页刷新后提交审批'
                    : '修改sku成功'
                )
                this.skuList = await this.fetchSkuList()
                // console.info(this.skuList)
                this.initAtbValueArr()
                this.needRefresh = true
              })
              .finally(() => {
                this.$store.commit('SHOW_LOADING', false)
              })
          })
        } else {
          this.$message.error('必填项未填')
        }
      })
    },
    isSkuNeedOAApproval(oldSku, sku) {
      return (
        this.oldSpuData.isFiled &&
        (oldSku.msrp != sku.msrp ||
          oldSku.costPrice != sku.costPrice ||
          oldSku.distributionPrice != sku.distributionPrice ||
          oldSku.distributionPriceStrategy != sku.distributionPriceStrategy ||
          oldSku.dropShippingPriceStrategy != sku.dropShippingPriceStrategy ||
          oldSku.minPrice != sku.minPrice ||
          oldSku.dropShippingPrice != sku.dropShippingPrice ||
          oldSku.dropShippingExpense != sku.dropShippingExpense)
      )
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
    // 启用
    onSaleClick(skuId) {
      this.$put(`/goods/sku/onSale/${skuId}`).then((res) => {
        this.$message.success('已启用')
      })
    },
    // 禁用
    onOutSaleClick(skuId) {
      this.$put(`/goods/sku/outSale/${skuId}`).then((res) => {
        this.$message.success('已禁用')
      })
    },
    // 设置主推商品
    onMainPush(skuId) {
      this.$put(`/goods/sku/mainPush/${skuId}`).then((res) => {
        this.skuList.forEach((item) => {
          if (item.id != skuId) {
            item.isMainPush = false
          }
        })
        this.$message.success('已设置主推')
      })
    },
    // 取消主推商品
    onOutMainPush(skuId) {
      this.$put(`/goods/sku/noMainPush/${skuId}`).then((res) => {
        this.$message.success('已取消主推')
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
    // 刷新sku页面
    async refreshSkuTab() {
      try {
        this.$store.commit('SHOW_LOADING')
        // await this.fetchSpuData()
        // await this.fetchSkuList()
        this.skuList = await this.fetchSkuList()
        this.initAtbValueArr()
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
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

    addCalculateVolume(obj) {
      let tskuLength = (obj.skuLength || 0) / 1000
      let tskuWeight = (obj.skuWeight || 0) / 1000
      let tskuHeight = (obj.skuHeight || 0) / 1000
      obj.unitvolume = toNumberStr(
        this.accMul(this.accMul(tskuLength, tskuWeight), tskuHeight),
        20
      )
    },
    addCalculateCartonVolum(obj) {
      let tlongCartonSize = (obj.longCartonSize || 0) / 1000
      let twidthCartonSize = (obj.widthCartonSize || 0) / 1000
      let thighCartonSize = (obj.highCartonSize || 0) / 1000

      obj.cartonVolum = toNumberStr(
        this.accMul(
          this.accMul(tlongCartonSize, twidthCartonSize),
          thighCartonSize
        ),
        20
      )
    },
    getSkuByCodeBar(index) {
      let item
      if (index == -1) {
        item = _.cloneDeep(this.addSkuItem)
      } else {
        item = _.cloneDeep(this.skuList[index])
      }
      if (item.codeBar == null || item.codeBar === '') {
        return
      }
      this.tempSku = {}
      this.tempSku['firstAtbKey'] = this.spuData.firstAtbKey
      this.tempSku['secondAtbKey'] = this.spuData.secondAtbKey
      this.tempSku['firstAtbValue'] = item.firstAtbValue
      this.tempSku['secondAtbValue'] = item.secondAtbValue
      this.tempSku['name'] = this.spuData.name
      this.tempSku['codeBar'] = item.codeBar
      let param = { id: item.id, codeBar: item.codeBar }
      this.$post('/goods/sku/getSkuByCodeBar', param).then((res) => {
        if (res <= 0) {
          return
        }
        this.codeBarList = res
        this.codeBarShow = true
        this.selectSpuIndex = index
      })
    },
    cancelCodeBarShow() {
      // if(this.selectSpuIndex==-1){
      //    this.addSkuItem.codeBar='';
      // }else{
      //   this.skuList[this.selectSpuIndex].codeBar='';
      // }
      this.codeBarShow = false
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
    },
    // #endregion skutab结束

    // #region 总页面操作
    // 返回列表
    returnList() {
      this.$router.back(-1)
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
          this.$refs['spuData'].validate(async (valid) => {
            if (valid) {
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
          this.skuList = await this.fetchSkuList()
          this.fetchImagesPager('spu', this.spuId)
        } finally {
          this.$store.commit('SHOW_LOADING', false)
        }
      }
    }
    // #endregion 总页面操作
  },
  destroyed() {
    if (this.needRefresh) {
      this.$bus.emit('refresh-page')
    }
  },
  watch: {
    isImportGoods(val) {
      if (val === false) {
        this.spuData['isCrossBorderTrade'] = false
        this.spuData['isGeneralTrade'] = false
      }
    }
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
    margin-bottom: 8px;
  }
}
</style>
<style lang="scss" scoped>
.edit-product-page {
  /deep/ .el-dialog {
    min-width: 800px;
    max-width: 870px;
  }
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
// .edit-product-page /deep/ .el-input__inner {
//   width: 180px;
//   height: 38px;
// }

.must:before {
  content: '* ';
  color: #ff1818;
}
.mHis {
  input.el-input__inner {
    color: #ff1818 !important;
  }
}
.skuHis {
  border: 2px dashed;
  border-color: red;
}
</style>
