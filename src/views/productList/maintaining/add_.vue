<template>
  <div class="add-product-page">
    <h4>基本信息</h4>
    <div>
      <el-form :model="spuData" :rules="formRules" ref="spuData" label-width="120px" size="mini">
        <div class="row max-width">
          <div class="flex-2">
            <el-form-item label="分类" prop="cateCode">
              <!-- <cate-cascader :checkStrictly="false"  :expandTrigger="'hover'"  returnValue="cateId" v-model="spuData.cateId" ref="cascader" ></cate-cascader> -->
              <select-category v-model="spuData.cateCode" :checkStrictly="false" />
            </el-form-item>

            <el-form-item v-if="spuData" label="商品名称" prop="name">
              <el-input v-model="spuData.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-if="spuData" label="副标题" prop="title">
              <el-input v-model="spuData.title" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-if="spuData" label="授权渠道范围" prop="scopeAuthorizas">
              <select-add-good-channel-type
                :multiple="true"
                v-model="spuData.scopeAuthorizas"
                :clearable="false"
                ref="selectAddGoods"
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
            <el-form-item v-if="spuData" label="标签" prop="tags">
              <tags v-model="spuData.tags" />
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
            </el-form-item>
            <el-form-item v-if="spuData" label="产地" prop="producePlace">
              <!-- <el-input v-model="spuData.producePlace" placeholder="请输入"></el-input> -->
              <country-select v-model="spuData.producePlace" checkStrictly />
            </el-form-item>
            <el-form-item v-if="spuData" label="保质期(天)" prop="shelfLife">
              <!-- <el-input v-model="spuData.shelfLife" placeholder="请输入"   onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input> -->
              <el-input-number
                v-model="spuData.shelfLife"
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
              <el-input-number :min="0" :max="999999" v-model="spuData.cateOrder" placeholder="请输入"></el-input-number>
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
              <el-input v-model="spuData.firstAtbKey" placeholder="请输入" ref="firstAtbKeyRef"></el-input>
            </el-form-item>
            <el-form-item v-if="spuData" label="副属性" prop="secondAtbKey">
              <el-input v-model="spuData.secondAtbKey" placeholder="请输入" ref="secondAtbKeyRef"></el-input>
            </el-form-item>
            <el-form-item label="是否进口品">
              <el-radio v-model="isImportGoods" :label="true">进口品</el-radio>
              <el-radio v-model="isImportGoods" :label="false">非进口品</el-radio>
            </el-form-item>
            <el-form-item v-if="spuData" label="是否需授权">
              <el-radio v-model="spuData.isNeedAuthorized" :label="true">是</el-radio>
              <el-radio v-model="spuData.isNeedAuthorized" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item v-if="spuData" label="贸易类型">
              <div style="display: flex;">
                <el-checkbox v-model="spuData.isCrossBorderTrade" :disabled="!isImportGoods">跨境贸易</el-checkbox>
                <br />
                <el-checkbox v-model="spuData.isGeneralTrade" :disabled="!isImportGoods">一般贸易</el-checkbox>
              </div>
            </el-form-item>
            <el-form-item label="是否需要上架">
              <el-radio v-model="spuData.isNeedOnSale" :label="true">是</el-radio>
              <el-radio v-model="spuData.isNeedOnSale" :label="false">否（中小样/试用装/赠品）</el-radio>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <!-- sku -->
    <div class="mt20">
      <span class="fw600 mr20">属性规格</span>
      <el-button type="primary" icon="el-icon-plus" @click="addSku" size="mini" style>添加sku</el-button>
    </div>
    <!-- sku列表 -->
    <div class="row fs13 mt20" style="overflow-x: auto;">
      <el-card v-for="(item, index) in skuList" :key="index" class="sku-form-wrapper">
        <div slot="header" class="row">
          <div class="flex-1">
            <div class="row center-y">
              <span class="pr4">{{ spuData && spuData.firstAtbKey || '未填写主属性' }}</span>
              <el-input
                v-model="item.firstAtbValue"
                prop="firstAtbKey"
                placeholder="请输入主属性值"
                class="flex-1"
                size="mini"
              ></el-input>
            </div>
            <div class="row center-y mt10" v-if="spuData && spuData.secondAtbKey">
              <span class="pr4">{{ spuData && spuData.secondAtbKey || '未填写副属性' }}</span>
              <el-input
                v-model="item.secondAtbValue"
                placeholder="请输入副属性值"
                class="flex-1"
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="ml20">
            <el-button type="text" @click="deleteSku(index)" class="fs14">
              <i class="el-icon-delete"></i>
            </el-button>
            <el-button type="text" @click="copySku(index)" class="fs14">
              <i class="el-icon-document-copy"></i>
            </el-button>
          </div>
        </div>
        <div>
          <el-form label-width="120px" :model="item" :rules="formSkuRules" ref="skuData">
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
            <el-form-item label="商品助记码（屈臣氏商品必填）">
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
            </el-form-item>
            <!-- <el-form-item label="库存">
              <el-input v-model="item.stock" placeholder="输入库存" size="mini"></el-input>
            </el-form-item>-->
            <el-form-item label="箱规" prop="wholesaleSpec" :show-message="false">
              <el-input
                v-model="item.wholesaleSpec"
                placeholder="只能输入数字"
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
            <el-form-item label="长(mm)" prop="skuLength" :show-message="false">
              <el-input
                v-model="item.skuLength"
                v-on:input="calculateVolume(index)"
                placeholder="输入长"
                size="mini"
                min="0"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="宽(mm)" prop="skuWeight" :show-message="false">
              <el-input
                v-model="item.skuWeight"
                v-on:input="calculateVolume(index)"
                placeholder="输入宽"
                size="mini"
                min="0"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="高(mm)" prop="skuHeight" :show-message="false">
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
                placeholder="输入体积"
                size="mini"
                min="0"
                type="number"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="单品重量（KG）" prop="skuScale" :show-message="false">
              <el-input
                v-model="item.skuScale"
                placeholder="输入单品重量"
                size="mini"
                min="0"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="外箱规格长(mm)" prop="longCartonSize" :show-message="false">
              <el-input
                v-model="item.longCartonSize"
                v-on:input="calculateCartonVolum('outside', index)"
                placeholder="输入外箱规格长"
                size="mini"
                min="0"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="外箱规格宽(mm)" prop="widthCartonSize" :show-message="false">
              <el-input
                v-model="item.widthCartonSize"
                v-on:input="calculateCartonVolum('outside', index)"
                placeholder="输入外箱规格宽"
                size="mini"
                min="0"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="外箱规格高(mm)" prop="highCartonSize" :show-message="false">
              <el-input
                v-model="item.highCartonSize"
                v-on:input="calculateCartonVolum('outside', index)"
                placeholder="输入外箱规格高"
                size="mini"
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
            <el-form-item label="外箱重量（KG）" prop="cartonScale" :show-message="false">
              <el-input
                v-model="item.cartonScale"
                placeholder="输入外箱重量"
                size="mini"
                min="0"
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
            <el-form-item label="分销建议价(战略合作)">
              <el-input
                v-model="item.distributionPriceStrategy"
                placeholder="输入分销定价"
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
            </el-form-item>
            <el-form-item label="最低控价" prop="minPrice" :show-message="false">
              <el-input
                v-model="item.minPrice"
                placeholder="输入最低控价"
                size="mini"
                min="0"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="一件代发建议价(一般合作)">
              <el-input
                v-model="item.dropShippingPrice"
                placeholder="输入价"
                size="mini"
                min="0"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="一件代发建议价(战略合作)">
              <el-input
                v-model="item.dropShippingPriceStrategy"
                placeholder="输入价"
                size="mini"
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
              <el-radio v-model="item.isOnSale" :label="true">启用</el-radio>
              <el-radio v-model="item.isOnSale" :label="false">禁用</el-radio>
            </el-form-item>
            <el-form-item label="主推商品">
              <el-radio v-model="item.isMainPush" :label="true" @change="onMainPush(index)">是</el-radio>
              <el-radio v-model="item.isMainPush" :label="false">否</el-radio>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
    <div class="pt30">
      <!-- 商品图片 -->
      <div class="fw700 product-Img">
        商品图片
        <i class="el-icon-picture"></i>
      </div>
      <el-divider></el-divider>
      <div class="row">
        <div>
          <div>
            <span class="fw600">商品轮播图</span>
            <div class="upload-box pt10 product-trunk">
              <upload-draggable
                :action="`${baseURL}/uploadGoodsImages`"
                :headers="uploadHeaders"
                :multiple="true"
                :before-upload="beforeUpload"
                :http-request="uploadRequest"
                @on-remove="(file, fileList) => onRemoveImageSpu(file, fileList, 'show')"
                :on-success="(response) => onSuccessImageSpu(response, 'show')"
                accept=".jpg, .jpeg, .png, .gif"
                v-model="spuShowImages"
                imgKey="imagePath"
                labelSelectName="主图"
                @on-select="getMainPicture"
                :limit="5"
              ></upload-draggable>
            </div>
          </div>
          <div class="pt20">
            <span class="fw600">商品详情图</span>
            <div class="upload-box pt10 product-trunk">
              <upload-draggable
                :action="`${baseURL}/uploadGoodsImages`"
                :headers="uploadHeaders"
                :multiple="true"
                :before-upload="beforeUpload"
                :http-request="uploadRequest"
                @on-remove="(file, fileList) => onRemoveImageSpu(file, fileList, 'detail')"
                :on-success="(response) =>  onSuccessImageSpu(response, 'detail')"
                accept=".jpg, .jpeg, .png, .gif"
                v-model="spuDetailsImages"
                imgKey="imagePath"
                :limit="20"
              ></upload-draggable>
            </div>
          </div>
          <div class="pt20 fs12">1、单张图片大小不超过10M，商品展示图不超过5张，商品详情图不超过20张</div>
          <div class="pt20 fs12">2、点击图片并拖动图片可调整展示顺序</div>
        </div>
      </div>
      <template v-show="skuList.length">
        <el-divider content-position="center" style="font-size: 20px;">主属性图片</el-divider>
        <!-- sku主属性图片 -->
        <div class="pt20">
          <div v-for="(sku, index) in skuList" :key="index" class="row mb30">
            <span class="fw600 green">
              {{ sku.firstAtbValue }}
              <span v-if="sku.secondAtbValue">：{{ sku.secondAtbValue }}</span>
            </span>
            <div>
              <div>
                <span class="fw600">商品轮播图</span>
                <div class="upload-box pt10 product-trunk">
                  <upload-draggable
                    :action="`${baseURL}/uploadGoodsImages`"
                    :headers="uploadHeaders"
                    :multiple="true"
                    :before-upload="beforeUpload"
                    :http-request="uploadRequest"
                    @on-remove="(file, fileList) => onRemoveImageSku(file, fileList, 'show', sku, index)"
                    :on-success="(response) => onSuccessImageSku(response, 'show', sku, index)"
                    accept=".jpg, .jpeg, .png, .gif"
                    v-model="skuList[index].skuShowImages"
                    imgKey="imagePath"
                    labelSelectName="主图"
                    @on-select="(item,mindex) =>getSkuMainPicture(item,mindex,index)"
                    :limit="5"
                  ></upload-draggable>
                </div>
              </div>
              <div class="pt20">
                <span class="fw600">商品详情图</span>
                <div class="upload-box pt10 product-trunk">
                  <upload-draggable
                    :action="`${baseURL}/uploadGoodsImages`"
                    :headers="uploadHeaders"
                    :multiple="true"
                    :before-upload="beforeUpload"
                    :http-request="uploadRequest"
                    @on-remove="(file, fileList) => onRemoveImageSku(file, fileList, 'detail', sku, index)"
                    :on-success="(response) => onSuccessImageSku(response, 'detail', sku, index)"
                    accept=".jpg, .jpeg, .png, .gif"
                    v-model="skuList[index].skuDetailsImages"
                    imgKey="imagePath"
                    :limit="20"
                  ></upload-draggable>
                </div>
                <div class="pt20 fs12">1、单张图片大小不超过10M，商品展示图不超过5张，商品详情图不超过20张</div>
                <div class="pt20 fs12">2、点击图片并拖动图片可调整展示顺序</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="pt30">
      <!-- 商品视频 -->
      <div class="fw700 product-Img">
        商品视频
        <i class="el-icon-video-play"></i>
      </div>
      <div class="row">
        <div>
          <div>
            <div class="upload-box pt10 product-trunk videoBox">
              <el-upload
                ref="spuShowUpload"
                :action="`${baseURL}/uploadGoodsVideo`"
                :headers="uploadHeaders"
                :on-success="handleVideoSuccess"
                :multiple="false"
                :limit="1"
                :show-file-list="false"
                :before-upload="beforeUploadVideo"
                :httpRequest="uploadRequest"
              >
                <el-button slot="default" size="small" type="primary">选择展示视频</el-button>
                <el-button
                  v-if="spuData.videoAttaList.length>0 && spuData.videoAttaList[0].attaUrl"
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
                v-if="spuData.videoAttaList.length>0 && spuData.videoAttaList[0].attaUrl"
                :src="spuData.videoAttaList[0].attaUrl"
                class="avatar"
                controls="controls"
              >您的浏览器不支持视频播放</video>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ptb30">
      <el-button type="primary" @click="addSpu('spuData')" size="small">添加商品</el-button>
      <el-button type="default" @click="returnList" size="small">返回列表</el-button>
    </div>

    <div class="ptb30">
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
    </div>
  </div>
</template>

<script>
import { getMaxNumber, uniqueArrByKey, deepClone, toNumberStr } from '@/utils'
import { getDepartmentList, getDanweiList } from '@/api/channel'
import { baseURL, headersTokenKey } from '@/config'
import CateCascader from '@/components/CateCascader'
import SelectBrand from '@/components/SelectBrand'
import SelectAddGoodChannelType from '@/components/SelectAddGoodChannelType'
import SelectCategory from '@/components/SelectCategory'
import Tags from '@/components/Tags'
import { getBrandById } from '@/api/brand'
import CountrySelect from '@/components/CountrySelect'
import { brandCategory } from '@/const/goods'
import UploadDraggable from '@/components/UploadDraggable'
import { getSpuTagList } from '@/api/goods'
export default {
  name: 'ProductMaintainingAdd',
  title: '商品添加',
  components: {
    SelectCategory,
    SelectBrand,
    SelectAddGoodChannelType,
    Tags,
    CountrySelect,
    UploadDraggable
  },
  data() {
    return {
      // tagHistory:['赠品','中小样','试用装'],
      // tagHistory:[],
      spuData: {
        videoAttaList: [],
        brandId: '',
        brandOrder: 0,
        brandCategory: '',
        cateId: null,
        cateOrder: 0,
        firstAtbKey: '',
        goodsType: '',
        name: '',
        producePlace: '',
        productDescribe: '',
        retailUnit: '',
        secondAtbKey: '',
        shelfLife: '',
        isGeneralTrade: false,
        isCrossBorderTrade: false,
        tags: [],
        isNeedAuthorized: false,
        isNeedOnSale: true,
        levelCooperation: '',
        scopeAuthoriza: '',
        scopeAuthorizas: []
      },
      formRules: {
        cateCode: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
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
                console.log(value, '请选择授权渠道范围')
                if (!this.spuData.scopeAuthorizas.length) {
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
      cateCode: '',
      skuList: [],
      isLoadingCateList: false,
      isLoadingBrandList: false,
      // 图片tab页的相关数据
      skuListOfImages: [],
      firstAtbListOfImages: [],
      spuImageList: [],
      colRadio: 'spu', // 侧边栏当前按钮，默认spu
      rowRadio: '1', // 横向切换按钮，默认商品展示图(1商品展示图, 2商品详情图)
      currentImageList: [],
      baseURL: baseURL,
      addSkuItem: {
        // 为新增的sku对象添加空属性
        firstAtbValue: '',
        secondAtbValue: '',
        firstAtbKey: '',
        secondAtbKey: '',
        skuSn: '',
        codeBar: '',
        msrp: '',
        wholesaleSpec: '',
        skuLength: '',
        skuWeight: '',
        skuHeight: '',
        isOnSale: true,
        skuDetailsImages: [],
        skuShowImages: [],
        workStatus: '正常销售',
        mnemonicCode: '', //商品助记码（屈臣氏商品必填）
        longCartonSize: '', //外箱规格高
        widthCartonSize: '', //外箱规格宽
        highCartonSize: '', //外箱规格高
        cartonVolum: 0, //外箱体积
        unitvolume: 0, //单品体积
        skuScale: '', //单品重量
        cartonScale: '', //外箱重量
        isMainPush: false
      },
      spuVideo: '',
      spuShowImages: [], // spu展示图
      spuDetailsImages: [], // spu详情图
      spuRadio: 0, //spu展示图单选
      isTitleImageFlag: false, // 是否点击主图 监听事件要点击才触发，所以给一个判断值。
      isSkuTitleImageFlag: false,
      isImportGoods: true, // 是否进口品
      departments: [], //所属公司
      danweis: [], //计量单位
      selectAllType: 'all',
      tempSku: {},
      codeBarList: [],
      codeBarShow: false,
      selectSpuIndex: 0,
      brandCategoryOptions: brandCategory.properties,
      needRefresh: false,
      sysTag: []
    }
  },
  computed: {
    tagHistory() {
      // let arr = ["赠品", "中小样", "试用装"];
      let arr = this.sysTag
      console.info('arr:', arr)
      this.spuData.tags.forEach((items) => {
        arr.forEach((item, index) => {
          if (item == items) {
            arr.splice(index, 1)
          }
        })
      })
      return arr
    },
    uploadHeaders() {
      let headers = {}
      headers[headersTokenKey] = this.$store.getters.token
      return headers
    }
  },
  created() {
    getDepartmentList().then((res) => {
      this.departments = res
    })
    getDanweiList().then((res) => {
      this.danweis = res
    })
    this.getSysTag()
  },
  methods: {
    getSysTag() {
      let param = { type: '1' }
      getSpuTagList(param).then((res) => {
        if (res && res.length > 0) {
          res.forEach((item) => {
            this.sysTag.push(item.name)
          })
        }
      })
    },
    addTag(item) {
      this.spuData.tags.push(item)
    },
    // 选择展示图，主图点击事件
    getMainPicture(item, index) {
      if (!this.isTitleImageFlag) {
        this.isTitleImageFlag = true
      }
      for (let i in this.spuShowImages) {
        this.spuShowImages[i].isTitleImage = false
      }
      this.spuShowImages[index].isTitleImage = true
    },
    // 选择展示图，主图点击事件
    getSkuMainPicture(item, mindex, index) {
      if (!this.isSkuTitleImageFlag) {
        this.isSkuTitleImageFlag = true
      }
      for (let i in this.skuList[index].skuShowImages) {
        this.skuList[index].skuShowImages[i].isTitleImage = false
      }
      this.skuList[index].skuShowImages[mindex].isTitleImage = true
    },
    // 添加sku
    addSku() {
      if (this.spuData.firstAtbKey == '') {
        this.$message({
          message: '请填写：主属性',
          type: 'error'
        })
        this.$refs.firstAtbKeyRef.focus()
        return
      }
      this.addSkuItemToTable()
    },
    // sku 复制
    copySku(index) {
      let newSku = deepClone(this.skuList[index]) // JSON.parse(JSON.stringify());
      newSku.skuSn = '' // 清空规格编码
      newSku.codeBar = '' // 清空条码
      newSku.mnemonicCode = '' // 清空助记码
      newSku.isMainPush = false // 是否主推清空
      this.skuList.push(newSku)
    },
    // sku表格添加
    addSkuItemToTable() {
      let item = deepClone(this.addSkuItem)
      item['firstAtbKey'] = this.spuData['firstAtbKey']
      item['secondAtbKey'] = this.spuData['secondAtbKey']
      this.skuList.push(item)
    },
    // sku表格删除
    deleteSku(index) {
      this.skuList.splice(index, 1)
    },
    // 添加spu
    addSpu(formName) {
      console.log('spu', this.spuData)
      console.log('sku', this.skuList)
      this.$refs[formName].validate((valid) => {
        console.info('开始校验spu')
        if (!valid) {
          this.$message.error('必填项未填或格式不正确')
        }
        if (valid) {
          let isValid = true
          for (let skuIndex in this.$refs['skuData']) {
            this.$refs['skuData'][skuIndex].validate((skuValid) => {
              console.info(`开始校验sku${skuIndex}`)
              if (!skuValid) {
                isValid = false
              }
            })
          }
          if (!isValid) {
            this.$message.error('必填项未填')
          }
          if (isValid) {
            let spu = deepClone(this.spuData)
            let skus = deepClone(this.skuList)
            //检查sku的价格是不是大于0
            for (let index in skus) {
              skus[index].msrp = skus[index].msrp || 0
              // if(!skus[index].msrp){
              //   this.$message.error(`SKU建议零售价需大于0`)
              //   return
              // }
            }
            let isSkuAttrNull = skus.some((ele) => !ele.firstAtbValue)
            console.log(isSkuAttrNull)
            if (isSkuAttrNull) {
              this.$message.error(`SKU主属性不能为空`)
              return
            }
            // #region 检查sku规格是否重复
            let isSkuAttrEqual = skus.some((sku, sku_i) => {
              return skus.some((s, s_i) => {
                return (
                  s_i !== sku_i &&
                  sku.firstAtbValue === s.firstAtbValue &&
                  sku.secondAtbValue === s.secondAtbValue
                )
              })
            })
            if (isSkuAttrEqual) {
              this.$message.error(`规格名称重复，请重新输入`)
              return
            }
            // #endregion
            this.$confirm('确定添加？')
              .then(() => {
                // if (!this.isTitleImageFlag && this.spuShowImages.length > 0) {
                //   this.spuShowImages[0].isTitleImage = true;
                // }
                let params = { ...spu }
                params['cateId'] = params['cateCode'].split('-')[2]
                params['skus'] = skus
                params['spuShowImages'] = this.spuShowImages
                params['spuDetailsImages'] = this.spuDetailsImages
                for (let i in params['skus']) {
                  let _sku = params['skus'][i]
                  _sku['firstAtbKey'] = spu.firstAtbKey
                  _sku['secondAtbKey'] = spu.secondAtbKey
                }
                if (
                  params.scopeAuthorizas &&
                  params.scopeAuthorizas.length > 0
                ) {
                  params['scopeAuthoriza'] = params.scopeAuthorizas.join(',')
                }
                this.$store.commit('SHOW_LOADING', '提交中')
                this.$post('/goods/spu/addSpu', params)
                  .then((res) => {
                    this.$message.success('添加成功')
                    this.$refs['spuData'].resetFields()
                    this.spuData.isGeneralTrade = false
                    this.spuData.isCrossBorderTrade = false
                    this.spuData.scopeAuthoriza = ''
                    this.spuData.videoAttaList = []
                    this.skuList = []
                    this.spuShowImages = []
                    this.spuDetailsImages = []
                    this.$refs['spuShowUpload'].clearFiles()
                    // this.$refs["spuDetailUpload"].clearFiles();
                    // this.$refs['cascader'].clear()
                    this.needRefresh = true
                  })
                  .catch((res) => {
                    console.log(res)
                  })
                  .finally(() => {
                    this.$store.commit('SHOW_LOADING', false)
                  })
              })
              .catch((err) => {
                console.info(err)
              })
          }
        }
      })
    },
    onSuccessImageSpu(response, type) {
      if (type === 'show') {
        let imageItem
        if (this.spuShowImages.length <= 0) {
          imageItem = this.getImageItem(response, true)
        } else {
          imageItem = this.getImageItem(response)
        }
        this.spuShowImages.push(imageItem)
      } else if (type === 'detail') {
        this.spuDetailsImages.push(this.getImageItem(response))
      }
    },
    onRemoveImageSpu(file, fileList, type) {
      let removeUrl = file.imagePath
      if (type === 'show') {
        this.spuShowImages.splice(
          this.spuShowImages.findIndex((item) => item.imagePath === removeUrl),
          1
        )
      } else if (type === 'detail') {
        this.spuDetailsImages.splice(
          this.spuShowImages.findIndex((item) => item.imagePath === removeUrl),
          1
        )
      }
    },
    // sku图片上传
    onSuccessImageSku(response, type, sku, index) {
      if (type === 'show') {
        let imageItem
        if (
          !this.skuList[index].skuShowImages ||
          this.skuList[index].skuShowImages.length <= 0
        ) {
          imageItem = this.getImageItem(response, true)
        } else {
          imageItem = this.getImageItem(response)
        }
        this.skuList[index].skuShowImages.push(imageItem)
      } else if (type === 'detail') {
        this.skuList[index].skuDetailsImages.push(this.getImageItem(response))
      }
    },
    // sku图片删除
    onRemoveImageSku(file, fileList, type, sku, index) {
      let removeUrl = file.response
      if (type === 'show') {
        this.skuList[index].skuShowImages.splice(
          this.skuList[index].skuShowImages.findIndex(
            (item) => item.imagePath === removeUrl
          ),
          1
        )
      } else if (type === 'detail') {
        this.skuList[index].skuDetailsImages.splice(
          this.skuList[index].skuDetailsImages.findIndex(
            (item) => item.imagePath === removeUrl
          ),
          1
        )
      }
    },
    getImageItem(imageUrl, isTitleImage = false) {
      return {
        imagePath: imageUrl,
        isTitleImage: isTitleImage
      }
    },
    // 返回列表
    returnList() {
      this.$router.back(-1)
    },
    // 获取图片列表
    // 上传前校验格式和大小
    beforeUpload(file) {
      let type = ['image/png', 'image/jpeg', 'image/jpg']
      const isType = type.includes(file.type)
      console.info('file.size :', file.size)
      const isSize = file.size / 1024 / 1024 < 10
      if (!isType) {
        this.$message.error('图片格式只能是png，jpg， jpeg')
      }
      if (!isSize) {
        this.$message.error('图片大小不能超过10MB!')
      }
      return isType && isSize
    },
    onRemoveVideo() {
      this.spuData.videoAttaList = []
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
      this.$store.commit('SHOW_LOADING', '上传视频中')
    },
    handleVideoSuccess(res, file) {
      if (file && file.response) {
        this.spuData.videoAttaList = [
          {
            attaUrl: file.response.url,
            snapshot: file.response.snapshot
          }
        ]
        this.$message.success('视频上传成功')
        this.$store.commit('SHOW_LOADING', false)
      } else {
        this.$message.error('视频上传失败，请重新上传！')
      }
    },
    uploadRequest(data) {
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
    changeDepart() {
      // console.info(this.$refs['departCascader'].getCheckedNodes()[0].label)
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
    
    getSkuByCodeBar(index) {
      let item = _.cloneDeep(this.skuList[index])
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
      let param = { codeBar: item.codeBar }
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
      // this.skuList[this.selectSpuIndex].codeBar='';
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
    selectAll() {
      this.$refs.selectAddGoods.selectAll(this.selectAllType)
      this.selectAllType = this.selectAllType == 'all' ? 'cancel' : 'all'
    },
    // 设置主推商品
    onMainPush(id) {
      for (var index = 0; index < this.skuList.length; index++) {
        if (index === id) {
          continue
        }
        this.skuList[index].isMainPush = false
      }
    },
    onGoodsTypeChange(val) {
      console.log('商品服务类型', this.spuData.brandCategory)
      if (['2', '5'].includes(this.spuData.brandCategory)) {
        this.formSkuRules.msrp[0].required = false
        this.formSkuRules.minPrice[0].required = false
        // this.skuList.forEach((items) => {
        //   items["msrp"] =items.msrp  || 0;
        //   items["minPrice"] =items.minPrice || 0;
        // });
        this.skuList = this.skuList.map((item) => {
          return {
            ...item,
            msrp: item.msrp || 0,
            minPrice: item.minPrice || 0
          }
        })
        // this.$refs.skuData.clearValidate()
      } else {
        this.formSkuRules.msrp[0].required = true
        this.formSkuRules.minPrice[0].required = true
        // this.$refs.skuData.clearValidate()
      }
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
  destroyed() {
    if (this.needRefresh) {
      this.$bus.emit('refresh-page')
    }
  }
}
</script>

<style lang="scss" scoped>
.videoBox /deep/ .el-upload-list__item .el-icon-close {
  display: inline-block;
}
.videoBox /deep/ .el-upload-list__item .el-icon-upload-success {
  display: none;
}
.max-width {
  max-width: 1200px;
}
</style>
<style lang="scss">
.setSkuBtm {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
}
// 标签选择
.product-Img {
  i {
    color: #41a1fc;
    font-size: 27px;
    vertical-align: middle;
    margin-left: 21px;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.product-map {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.product-trunk {
  position: relative;
  min-height: 160px;
}
.product-trunk-btn {
  padding: 60px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  color: #ccc;
  display: flex;
  flex-direction: column;
  position: relative;
  span {
    position: absolute;
    bottom: 20%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, 0);
    font-size: 14px;
  }
}
.add-product-page {
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
      vertical-align: bottom;
      margin-bottom: 12px;
    }
    .el-upload-list__item {
      width: auto;
      height: auto;
      .el-upload-list__item-thumbnail {
        max-width: 130px;
        max-height: 180px;
        vertical-align: middle;
      }
    }
  }
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
