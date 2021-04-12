<template>
  <div>
    <the-search @onSearch="onChange" @onReset="onResetQuery">
      <el-form class="form_wapper" :model="searchQuery" ref="searchQuery" inline size="mini">
        <el-form-item class="form_item" label="商品名称" prop="name">
          <el-input
            v-model="searchQuery.name"
            placeholder="请输入"
            clearable
            @clear="onChange"
            @keyup.enter.native="onChange"
          ></el-input>
        </el-form-item>
        <el-form-item prop="skuSns">
          <template slot="label">
            <el-tooltip class="item" effect="dark" content="NC编码;多个NC编码之间使用“,”分隔" placement="top">
              <span>
                规格编码
                <i class="el-icon-info ml6"></i>
              </span>
            </el-tooltip>
          </template>
          <id-batch-query-input v-model="searchQuery.skuSns" @keyup.enter.native="onChange"></id-batch-query-input>
        </el-form-item>
        <el-form-item prop="codeBars">
          <template slot="label">
            <el-tooltip class="item" effect="dark" content="多个商品条码之间使用“,”分隔" placement="top">
              <span>
                商品条码
                <i class="el-icon-info ml6"></i>
              </span>
            </el-tooltip>
          </template>
          <id-batch-query-input v-model="searchQuery.codeBars" @keyup.enter.native="onChange"></id-batch-query-input>
        </el-form-item>
        <el-form-item prop="inIds">
          <template slot="label">
            <el-tooltip class="item" effect="dark" content="多个商品ID之间使用“,”分隔" placement="top">
              <span>
                商品ID
                <i class="el-icon-info ml6"></i>
              </span>
            </el-tooltip>
          </template>
          <id-batch-query-input v-model="searchQuery.inIds" @keyup.enter.native="onChange"></id-batch-query-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brandId">
          <select-brand v-model="searchQuery.brandId" multiple />
        </el-form-item>
        <el-form-item label="分类" prop="cateCode">
          <select-category v-model="searchQuery.cateCode" />
        </el-form-item>
        <el-form-item label="商品服务类型" prop="brandCategory">
          <el-select v-model="searchQuery.brandCategory" multiple>
            <el-option
              v-for="item in brandCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="checkedStatus">
          <el-select v-model="searchQuery.checkedStatus" clearable>
            <el-option label="未审核" :value="1"></el-option>
            <el-option label="审核中" :value="4"></el-option>
            <el-option label="审核通过" :value="2"></el-option>
            <el-option label="审核未通过" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品标签" prop="tag">
          <el-input
            v-model="searchQuery.tag"
            placeholder="请输入"
            clearable
            @clear="onChange"
            @keyup.enter.native="onChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="授权渠道范围" prop="scopeAuthoriza">
          <select-add-good-channel-type
            :multiple="false"
            v-model="searchQuery.scopeAuthoriza"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item label="是否需上架" prop="isNeedOnSale">
          <el-select v-model="searchQuery.isNeedOnSale " placeholder="全部" clearable>
            <el-option label="需上架" :value="true"></el-option>
            <el-option label="无需上架" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </the-search>
    <div class="col">
      <div class="pb14">
        <span class="fs22 black">查询结果</span>
        <!-- <span class="fs18 black pl20">SPU数量{{ searchQuery.total }}个，SKU数量{{ searchQuery.skuTotal }}个</span> -->
        <span class="fs18 black pl20">SPU数量{{ searchQuery.total }}个</span>
      </div>
      <!--
        1. 已发布||已下架 ，对应不同方法
        2. isOnSale已发布，NotOnSale已下架，isDelete回收站
        3. 添加商品，三个模块中都有的
      -->
      <div class="pb14">
        <el-button
          class
          v-permission-button="'add'"
          type="success"
          @click="$router.push({ name: 'ProductMaintainingAdd' })"
          v-show=" productFlags !== 'release' && productFlags !== 'recycle'"
        >新增</el-button>
        <el-button
          class
          v-permission-button="'addCheck'"
          type="primary"
          @click="sendBatchApproval"
          v-show="productFlags !== 'recycle'"
        >建档提审</el-button>
        <el-button
          class
          v-permission-button="'on'"
          type="primary"
          :loading="batchSaleLoading"
          @click="onBatchOnSale"
          v-show="productFlags == 'unsale'||productFlags == 'all'"
        >上架</el-button>
        <el-button
          class
          v-permission-button="'off'"
          type="primary"
          :loading="batchSaleLoading"
          @click="onBatchOutSale"
          v-show="productFlags == 'release'||productFlags == 'all'"
        >下架</el-button>
        <el-button
          class
          v-permission-button="'delete'"
          type="danger"
          @click="onBatchDelete"
          v-show="productFlags == 'unsale'||productFlags == 'all'"
        >删除</el-button>
        <batch-setting
          class="ml10"
          v-permission-button="'batchUpdateField'"
          :selectedSpu="selectedSpu"
          :selectedList="selectAllList"
          @afterSuccess="onChange"
        ></batch-setting>
        <el-button
          class="ml10"
          v-permission-button="'restore'"
          type="primary"
          :loading="batchResumeLoading"
          @click="batchResume"
          v-show="productFlags === 'recycle'"
        >恢复到仓库</el-button>
        <el-button class="ml10" v-permission-button="'export'" type="warning" @click="exportSpu">导出</el-button>
      </div>
    </div>
    <el-checkbox-group v-model="checkTheads" class="mb10">
      <el-checkbox v-for="item in formThead" :key="item.prop" :label="item.prop">{{ item.label }}</el-checkbox>
    </el-checkbox-group>
    <!-- 表格 -->
    <el-table
      ref="spuTableData"
      :data="tableData"
      style="width: 100%;"
      border
      stripe
      size="mini"
      @selection-change="handleSelectionChange"
      @sort-change="onSortChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="ID" prop="id" width="80"></el-table-column>
      <el-table-column prop="skuSn" width="150" v-if="checkTheads.includes('skuSn')">
        <template slot="header">
          <el-tooltip class="item" effect="dark" content="NC编码" placement="top">
            <span>
              规格编码
              <i class="el-icon-info ml6"></i>
            </span>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.skuSn" :key="index">{{ item }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="商品条码"
        prop="codeBar"
        width="150"
        v-if="checkTheads.includes('codeBar')"
      >
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.codeBar" :key="index">{{ item }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="分类"
        prop="cateName"
        width="100"
        v-if="checkTheads.includes('cateName')"
      ></el-table-column>
      <el-table-column label="商品图片" style="min-width: 80px;" min-width="80">
        <template slot-scope="scope">
          <div class="row center-y">
            <el-popover placement="top" trigger="click">
              <img
                slot="reference"
                :src="scope.row.titleImage || require('@/assets/images/logo.png')"
                style="max-width: 40px; max-height: 40px;"
                alt
              />
              <el-image
                :src="scope.row.titleImage || require('@/assets/images/logo.png')"
                style="max-width: 600px; max-height: 600px;"
              ></el-image>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name" width="200"></el-table-column>

      <!-- <el-table-column label="商品信息" style="min-width: 250px;" min-width="280">
        <template slot-scope="scope">
          <div class="row center-y">
            <el-popover placement="top" trigger="click">
              <img slot="reference" :src="scope.row.titleImage || require('@/assets/images/logo.png')" style="max-width: 100px; max-height: 100px;">
              <el-image :src="scope.row.titleImage || require('@/assets/images/logo.png')" style="max-width: 600px; max-height: 600px;"></el-image>
            </el-popover>
            <div class="pl10">
              <span>商品名称：{{ scope.row.name }}</span>
            </div>
          </div>
        </template>
      </el-table-column>-->
      <el-table-column
        label="品牌"
        prop="brandName"
        width="110"
        v-if="checkTheads.includes('brandName')"
      ></el-table-column>
      <el-table-column label="审核状态" width="100">
        <template slot-scope="scope">
          <approve-timeline
            :id="scope.row.id"
            :list="timelineList"
            :request-id="requestId"
            :is-loading="isLoading"
            @hoverCheckedStatus="onHoverCheckedStatus"
          >
            <el-tag v-if="scope.row.checkedStatus == 1">未审核</el-tag>
            <el-tag v-if="scope.row.checkedStatus == 2">审核通过</el-tag>
            <el-tag v-if="scope.row.checkedStatus == 3">审核不通过</el-tag>
            <el-tag v-if="scope.row.checkedStatus == 4">审核中</el-tag>
          </approve-timeline>
        </template>
      </el-table-column>
      <el-table-column label="提审状态" width="100" v-if="checkTheads.includes('isNeedApprove')">
        <template slot-scope="scope">
          <span
            v-if="scope.row.checkedStatus != 4 && !(scope.row.checkedStatus == 2 && scope.row.isFiled && scope.row.isSpuModify <= 0 && scope.row.isSkuModify <= 0)"
          >需提审</span>
          <span v-else>无需提审</span>
        </template>
      </el-table-column>
      <el-table-column label="是否需上架" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.isNeedOnSale">需上架</span>
          <span v-if="!scope.row.isNeedOnSale">无需上架</span>
        </template>
      </el-table-column>
      <el-table-column label="上架状态">
        <template slot-scope="scope">
          <span v-if="scope.row.isOnSale">已发布</span>
          <span v-if="!scope.row.isOnSale ">已下架</span>
        </template>
      </el-table-column>
      <el-table-column label="建档状态" prop="isFiled" v-if="checkTheads.includes('isFiled')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isFiled" type="success">已建档</el-tag>
          <el-tag v-else type="warning">未建档</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="附件" width="100" v-if="checkTheads.includes('attachment')">
        <template slot-scope="scope">
          <el-tag
            class="pointer"
            size="mini"
            @click="showAttaList(scope.row)"
          >{{ scope.row.attaCount > 0 ? `查看${scope.row.attaCount}`: '无' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标签" prop="tag" width="150" v-if="checkTheads.includes('tag')">
        <template slot-scope="scope">
          <el-tag type="warning" v-for="item in scope.row.tag" :key="item.id">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="validityStock"
        min-width="80"
        v-if="checkTheads.includes('validityStock')"
      >
        <template slot="header">
          <el-tooltip effect="dark" content="总可发货库存" placement="top">
            <span>
              总库存
              <i class="el-icon-info ml6"></i>
            </span>
          </el-tooltip>
        </template>
        <template slot-scope="scope">{{ scope.row.validityStock }}</template>
      </el-table-column>
      <el-table-column
        label="商品说明书"
        prop="tag"
        min-width="90"
        v-if="checkTheads.includes('instructions')"
      >
        <template slot-scope="scope" v-if="scope.row.qrCodeUrl">
          <el-popover placement="top" trigger="click">
            <img
              slot="reference"
              :src="scope.row.qrCodeUrl"
              style="max-width: 60px; max-height: 60px;display:flex;margin: 0 auto;"
            />
            <el-image :src="scope.row.qrCodeUrl" style="max-width: 600px; max-height: 600px;"></el-image>
          </el-popover>
          <a :href="scope.row.htmlUrl" target="_blank" class="block text-center">查看链接</a>
        </template>
      </el-table-column>
      <el-table-column
        label="商品服务类型"
        prop="brandCategory"
        width="100"
        v-if="checkTheads.includes('brandCategory')"
      >
        <template slot-scope="scope">
          <template v-for="item in brandCategoryOptions">
            <el-tag
              type="success"
              :key="item.value"
              v-if="scope.row.brandCategory === item.value"
            >{{ item.label }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="是否清货"
        prop="workStatus"
        width="80"
        v-if="checkTheads.includes('workStatus')"
      >
        <template slot-scope="scope">
          <el-tag
            type="danger"
            size="mini"
            v-if="scope.row.workStatus && scope.row.workStatus.includes('清货')"
          >清货</el-tag>
          <el-tag type="danger" size="mini" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createDate"
        width="120"
        sortable="custom"
        v-if="checkTheads.includes('createDate')"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.createDate">{{ scope.row.createDate | formatDate('Y/M/D h:m') }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        prop="editorName"
        width="120"
        v-if="checkTheads.includes('createDate')"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.creatorName || scope.row.creator }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        prop="updateDate"
        width="120"
        sortable="custom"
        v-if="checkTheads.includes('updateDate')"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.updateDate">{{ scope.row.updateDate | formatDate('Y/M/D h:m') }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="修改人"
        prop="editorName"
        width="120"
        v-if="checkTheads.includes('updateDate')"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.editorName || scope.row.editor}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission-button="'viewDetails'"
            type="text"
            size="small"
            @click="preview(scope.row, scope.$index)"
          >查看</el-button>
          <el-button
            v-permission-button="'edit'"
            type="text"
            size="small"
            @click="edit(scope.row, scope.$index)"
            :disabled="scope.row.checkedStatus == 4"
          >编辑</el-button>
          <el-button
            v-permission-button="'upload'"
            type="text"
            size="small"
            @click="showUploadAtta(scope.row)"
          >上传附件</el-button>
          <el-button
            v-permission-button="'management'"
            type="text"
            size="small"
            @click="showMaterial(scope.row)"
          >素材管理</el-button>
          <!-- <el-button v-permission-button="'addCheck'" type="text" size="small" @click="sendApproval(scope.row)" :disabled="scope.row.checkedStatus == 4 || (scope.row.isFiled && scope.row.isSpuModify <=0 && scope.row.isSkuModify <=0)">建档提审</el-button> -->
          <!-- <el-button type="text" size="small" @click="push2Nc(scope.row)">NC同步推送</el-button> -->
          <el-button
            v-permission-button="'viewLog'"
            type="text"
            size="small"
            @click="showLog(scope.row)"
          >操作日志</el-button>
          <el-button
            v-permission-button="'productBook'"
            type="text"
            size="small"
            @click="showProductBook(scope.row)"
          >商品说明书</el-button>
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
    <!-- 弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="whenClose">
      <!-- 附近列表 -->
      <div v-show="dialogType === 'attaList'">
        <el-table :data="attachmenList">
          <el-table-column label="附件">
            <template slot-scope="scope">
              <span class="mr10">{{ scope.row.fileName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="大小" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.size | formatFileSize }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否受保护" width="100">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.isProtect">是</el-tag>
              <el-tag type="danger" v-else>否</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <div style="display: flex;">
                <el-button
                  v-permission-button="'deleteAtta'"
                  type="danger"
                  size="mini"
                  @click="deleteAtta(scope.row, scope.$index)"
                >删除</el-button>
                <download
                  v-permission-button="'downloadAtta'"
                  :attaId="scope.row.id"
                  :fileName="scope.row.fileName"
                  :isProtect="scope.row.isProtect"
                ></download>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 上传附件 -->
      <div v-show="dialogType === 'uploadAtta'">
        <el-upload
          ref="upload"
          class="inline-block"
          :action="`${baseURL}/uploadAttaImages`"
          :on-success="(response, file) => onSuccessUpload(response, file)"
          :on-remove="(file) => onRemoveUpload(file)"
          :multiple="false"
          :httpRequest="uploadRequest"
          :disabled="uploadLoading"
        >
          <el-button type="primary" v-show="showUploadBtn">选择文件上传</el-button>
        </el-upload>
        <div class="ml40 inline-block" :class="!showUploadBtn ? 'relative bottom8' : ''">
          <span>是否受保护</span>
          <el-switch v-model="uploadAttaForm.isProtect"></el-switch>
        </div>
        <div v-show="uploadLoading">
          <el-button type="text" :loading="uploadLoading">上传中</el-button>
        </div>
        <div class="mt30">
          <el-button type="success" @click="addAtta" :disabled="uploadLoading">添加附件</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 商品说明书 -->
    <el-dialog title="商品说明书" :visible.sync="isProductBook" @close="CloseProductBook" width="80%">
      <tinymce-editor v-model="tinymceData" :height="400" />
      <el-button type="primary" class="mt20" @click="saveProductBook()">保存</el-button>
    </el-dialog>

    <!-- spu删除确认框 -->
    <el-dialog
      title="SPU删除提示"
      :visible.sync="showDeleteSpuConfirmDialog"
      width="1000px"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          label-width="100px"
          size="mini"
          :model="spuDeleteForm"
          ref="spuDeleteForm"
          :rules="{
              reason: [
                { required: true, message: '请填写删除原因', trigger: 'blur' }
              ]
            }"
        >
          <div class="row max-width">
            <div class="flex-1">
              <el-form-item label="删除原因" prop="reason">
                <el-input type="textarea" :rows="6" v-model="spuDeleteForm.reason"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="row max-width">
            <h3 style="color:red;">备注：下架商品删除后，将会移至回收站</h3>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDeleteSpuConfirmDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteSpuConfirm" :loading="batchDeleteLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TheSearch from '@/components/TheSearch'
import ThePagination from '@/components/ThePagination'
import { translateDataToTree, formatDate, isEmpty } from '@/utils'
import { baseURL, headersTokenKey } from '@/config'
import { brandCategory } from '@/const/goods'
import Download from '@/components/download'
import { getAttachmentList, deleteAtta } from '@/api/attachment'
import { getBrandList } from '@/api/brand'
import { getCategoryList } from '@/api/category'
import { getWorkflow } from '@/api/goods'
import SelectBrand from '@/components/SelectBrand'
import SelectCategory from '@/components/SelectCategory'
import FileSaver from 'file-saver'
import { exportSpu as exportSpuHttp } from '@/api/excel'
import TinymceEditor from '@/components/TinymceEditor'
import VUE_BUS from '@/utils/bus'
import SelectAddGoodChannelType from '@/components/SelectAddGoodChannelType'
import idBatchQuery from '@/components/idBatchQuery'
import BatchSetting from './BatchSetting'
import idBatchQueryInput from '@/components/IdBatchQueryInput'
import ApproveTimeline from '@/components/approve-timeline'

export default {
  name: 'Products',
  title: '已发布',
  components: {
    TheSearch,
    ThePagination,
    Download,
    SelectBrand,
    SelectCategory,
    TinymceEditor,
    SelectAddGoodChannelType,
    idBatchQuery,
    BatchSetting,
    idBatchQueryInput,
    ApproveTimeline
  },
  data() {
    return {
      selectedSpu: [],
      tinymceData: '',
      tinymceSpuId: '',
      tinymceSpuName: '',
      brandCategoryOptions: brandCategory.properties,
      skuSn: null,
      codeBar: null,
      searchQuery: {
        id: null,
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        name: '',
        skuSns: [],
        codeBars: [],
        inIds: [],
        cateCode: '',
        brandCategory: [],
        isNeedOnSale: '',
        orderStr: 'updateDate desc',
        isDelete: false,
        isOnSale: true,
        brandId: [],
        tag: '',
        checkedStatus: '',
        searchDegree: 100,
        scopeAuthoriza: null
      },
      skuTotal: 0, // sku总数量
      tableData: [], // 表格数据
      isLoadingCateList: false, // 分类下拉框加载状态
      isLoadingBrandList: false, // 品牌下拉框加载状态
      // selectionList: [], // 当前页选中的行数据
      checkList: [], // 当前页选中的行审核状态
      selectAllList: [], //分页选中数据
      batchSaleLoading: false,
      batchDeleteLoading: false,
      cascaderOptions: [],
      cateCodes: [],
      dialogType: 'attaList',
      dialogVisible: false,
      isProductBook: false,
      attachmenList: [],
      uploadAttaForm: {
        attaUrl: '',
        fileName: '',
        fileType: '',
        isProtect: false,
        size: 0,
        spuId: null
      },
      baseURL: baseURL,
      uploadLoading: false,
      // 回收站
      batchResumeLoading: false,
      checkTheads: [],
      formThead: [
        { label: '编码', prop: 'skuSn', default: true },
        { label: '条码', prop: 'codeBar', default: true },
        { label: '分类', prop: 'cateName', default: true },
        { label: '品牌', prop: 'brandName', default: true },
        { label: '附件', prop: 'attachment', default: false },
        { label: '标签', prop: 'tag', default: true },
        { label: '商品说明书', prop: 'instructions', default: false },
        { label: '商品服务类型', prop: 'brandCategory', default: false },
        { label: '总库存', prop: 'validityStock', default: true },
        { label: '清货', prop: 'workStatus', default: false },
        { label: '提审状态', prop: 'isNeedApprove', default: true },
        { label: '建档状态', prop: 'isFiled', default: false },
        { label: '创建时间', prop: 'createDate', default: true },
        { label: '修改时间', prop: 'updateDate', default: true }
      ],
      spuDeleteForm: {
        spuIds: [],
        reason: ''
      },
      showDeleteSpuConfirmDialog: false,
      requestId: '', //审批流程id
      timelineList: [], //审批时间轴
      isLoading: false
    }
  },
  props: {
    productFlags: {
      type: String,
      default: ''
    }
  },
  computed: {
    // selectionIds() {
    //   let ids = this.selectionList.map(item => item.id)
    //   return ids
    // },
    // checkedStatusIds() {
    //   let ids = this.checkList.map(item => item.checkedStatus)
    //   return ids
    // },
    // selectedSpu () {
    //   return this.tableData.filter(v => {
    //     return  (this.selectAllList || []).includes(v.id)
    //   })
    // },
    dialogTitle() {
      if (this.dialogType === 'attaList') {
        return '查看附件列表'
      }
      if (this.dialogType === 'uploadAtta') {
        return '上传附件'
      }
    },
    uploadHeaders() {
      let headers = {}
      headers[headersTokenKey] = this.$store.getters.token
      return headers
    },
    showUploadBtn() {
      return this.uploadAttaForm['attaUrl'] == ''
    },
    isImage() {
      return function (type) {
        let arr = ['image', 'jpg', 'png', 'jpeg']
        return arr.indexOf(type) != -1
      }
    }
  },
  created() {
    // 接收回传指令进行事件操作
    this.$bus.on('refresh-page', () => {
      console.log('refresh====')
      this.fetchSpuList()
    })
    // 不同的值  商品列表请求值不同
    switch (this.productFlags) {
      case 'all':
        this.searchQuery.isDelete = false
        this.searchQuery.isOnSale = ''
        break
      case 'release':
        this.searchQuery.isDelete = false
        this.searchQuery.isOnSale = true
        break
      case 'unsale':
        this.searchQuery.isDelete = false
        this.searchQuery.isOnSale = false
        break
      case 'recycle':
        this.searchQuery.isDelete = true
        this.searchQuery.isOnSale = ''
        break
    }
    this.fetchSpuList()
    this.checkTheads = this.formThead.map((item) => item.default && item.prop)
  },
  methods: {
    isEmpty,

    handleSizeChange(val) {
      // 每页条数改变时
      this.searchQuery['pageSize'] = val
      this.searchQuery['pageIndex'] = 1
      this.fetchSpuList()
    },

    handleCurrentChange(val) {
      // 页码改变时
      this.searchQuery['pageIndex'] = val
      this.fetchSpuList()
    },
    // 批量恢复
    batchResume() {
      if (!this.selectAllList.length) {
        this.$message('未选中数据！')
        return
      }
      // 弹窗确认
      this.$confirm('确定恢复吗？', {
        type: 'warning'
      })
        .then(() => {
          this.batchResumeLoading = true
          this.$put('/goods/spu/batchResume', this.selectAllList)
            .then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.onChange()
                }
              })
            })
            .finally(() => {
              this.batchResumeLoading = false
            })
        })
        .catch(() => {})
    },
    // 已下架
    // 批量上架
    onBatchOnSale() {
      if (!this.selectAllList.length) {
        this.$message.warning('未选中数据！')
        return
      }
      // console.log("aaa",this.checkedStatusIds.filter(item => item == '2').length)
      let arr = this.selectAllList.filter((item) => {
        return this.checkList.find((e) => e == item)
      })
      if (arr.length > 0) {
        this.$message.error('所选数据需为审核通过')
        return
      }
      let noNeedOnSale = this.tableData.find((product) => {
        return (
          this.selectAllList.includes(product.id) &&
          product.isNeedOnSale === false
        )
      })
      if (noNeedOnSale) {
        this.$message.error(`"${noNeedOnSale.name}"无需上架`)
        return
      }
      // 弹窗确认
      this.$confirm('是否上架选中的商品？', {
        title: '提示',
        type: 'warning'
      })
        .then(() => {
          this.batchSaleLoading = true
          //未审核状态的商品不能上架
          this.$post('/goods/spu/onSale/batch', this.selectAllList)
            .then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.onChange()
                }
              })
            })
            .finally(() => {
              this.batchSaleLoading = false
            })
        })
        .catch(() => {})
    },
    // 批量删除
    onBatchDelete() {
      if (!this.selectAllList.length) {
        this.$message.warning('未选中数据！')
        return
      }
      let item = null
      let onSaleProduct = this.selectAllList.find((v, i) => {
        item = this.tableData.find((item) => item.id === v)
        return item && item.isOnSale
      })
      if (onSaleProduct) {
        this.$message.error(`"${item.name}"已发布，无法删除`)
        return
      }
      // 弹窗确认
      this.openDeleteSpuConfirmDialog(this.selectAllList)
      // this.$confirm('提交删除后，待OA审批生效，确定删除吗？', {
      //   type: 'warning'
      // }).then(() => {
      //   this.openDeleteSpuConfirmDialog(this.selectAllList)
      // }).catch(() => {
      // })
    },

    openDeleteSpuConfirmDialog(spuIds) {
      this.spuDeleteForm.spuIds = spuIds
      this.spuDeleteForm.reason = ''
      this.showDeleteSpuConfirmDialog = true
    },

    onHoverCheckedStatus(id) {
      this.isLoading = true
      getWorkflow(id)
        .then((res) => {
          this.timelineList = []
          this.requestId = res && res.requestId
          let arr = res && res.workflowRequestLogs.reverse()
          if (arr) {
            arr.map((item, idx) => {
              let obj = {
                remark: item.remark ? `审批意见: ${item.remark}` : '',
                receivedPersons: `接收人 ${item.receivedPersons}`,
                content: `(${item.operatorDept}) ${item.operatorName} ${item.operateType}`,
                timestamp: `${item.operateDate} ${item.operateTime}`
              }
              item.operateType === '提交'
                ? ((obj.size = 'large'),
                  (obj.type = 'primary'),
                  (obj.icon = 'el-icon-circle-plus'))
                : item.operateType === '批准'
                ? ((obj.size = 'large'),
                  (obj.type = 'success'),
                  (obj.icon = 'el-icon-success'))
                : (obj.type = 'warning')
              this.timelineList.push(obj)
            })
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    deleteSpuConfirm() {
      this.$refs['spuDeleteForm'].validate(async (valid) => {
        if (valid) {
          this.batchDeleteLoading = true
          this.$delete('/goods/spu/batchDelete', this.spuDeleteForm)
            .then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.onChange()
                }
              })
              this.showDeleteSpuConfirmDialog = false
            })
            .finally(() => {
              this.batchDeleteLoading = false
            })
        }
      })
    },

    onChange() {
      this.searchQuery['pageIndex'] = 1
      this.selectAllList = []
      this.checkList = []
      this.selectedSpu = []
      this.fetchSpuList()
    },

    async fetchSpuList() {
      try {
        this.$store.commit('SHOW_LOADING')
        let res = await this.fetchSpuPager()
        this.searchQuery.total = Number(res.total) // 总条数
        this.searchQuery.skuTotal = res.skuTotal || 0
        let spuList = res.records
        if (spuList && spuList.length) {
          let selectTempList = _.cloneDeep(this.selectAllList)
          this.tableData = spuList
          this.reSelectSpu(selectTempList)
        } else {
          this.tableData = []
        }
      } catch (error) {
        console.log('catch', error)
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },

    reSelectSpu(selectTempList) {
      this.$nextTick(() => {
        if (selectTempList && selectTempList.length > 0) {
          this.tableData.forEach((item) => {
            selectTempList.forEach((item2) => {
              if (item2 === item.id) {
                this.$refs['spuTableData'].toggleRowSelection(item)
              }
            })
          })
          selectTempList = []
        }
      })
    },
    // 获取spu列表
    fetchSpuPager() {
      return new Promise((resolve, reject) => {
        let params = _.cloneDeep(this.searchQuery)
        if (Array.isArray(params.inIds)) {
          for (let id of params.inIds) {
            if (isNaN(id)) {
              this.$message.error(`“${id}”非商品ID`)
              reject(error)
              return
            }
          }
        }
        this.$post('/goods/spu/getSpuPager', params)
          .then((res) => {
            console.log(res.records)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取附件数量
    fetchAttaCounts(list, spuIds) {
      return new Promise((resolve, reject) => {
        //获取附件数量
        this.$post('/attachment/getCountBySpuId', spuIds)
          .then((res) => {
            list.forEach((spu, index) => {
              res.forEach((json, i) => {
                if (spu.id == json.spuId) spu.attaCount = json.count
              })
            })
            resolve(list)
          })
          .catch((error) => {
            this.tableData = list
            reject()
          })
      })
    },

    handleSelectionChange(selection) {
      // selectedSpu
      console.log('selection:', selection)
      let checkArr = this.checkList.filter((item) => {
        return !this.tableData.find((e) => e.id == item)
      })
      this.checkList = checkArr

      let tempCheckList = selection.filter((item) => item.checkedStatus != '2')
      tempCheckList.forEach((item) => {
        this.checkList.push(item.id)
      })
      console.log('checkList:', this.checkList)

      let arr = this.selectAllList.filter((item) => {
        return !this.tableData.find((e) => e.id == item)
      })
      this.selectAllList = arr

      this.selectedSpu = this.selectedSpu.filter(
        (item) => !this.tableData.find((e) => e.id === item.id)
      )
      if (selection && selection.length > 0) {
        selection.forEach((item) => {
          this.selectAllList.push(item.id)
        })
        this.selectedSpu = this.selectedSpu.concat(selection)
      }
      console.info('selectAllList:', this.selectAllList)
    },

    onSortChange({ column, prop, order }) {
      console.info('触发排序', column, prop, order)
      if (order) {
        let isAsc = order === 'ascending' ? 'asc' : 'desc'
        this.searchQuery.orderStr = prop + ' ' + isAsc
      } else {
        this.searchQuery.orderStr = 'updateDate desc'
      }
      this.onChange()
    },
    // 预览
    preview(data, index) {
      let previewPage = this.$instantCompt(
        require('./maintaining/Preview').default,
        {
          dialogWidth: '80%'
        }
      )
      previewPage.init(data.id)
    },

    edit(data, index) {
      this.$router.push({
        name: 'ProductMaintainingEdit',
        query: {
          id: data.id
        }
      })
    },

    sendApproval(data) {
      // 弹窗确认
      this.$confirm('确认建档审批提交吗？', {
        type: 'warning'
      })
        .then(() => {
          this.$get(`/goods/spu/sendApproval/${data.id}`)
            .then((res) => {
              this.$message({
                message: '提交成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.onChange()
                }
              })
            })
            .finally(() => {})
        })
        .catch(() => {})
    },

    sendBatchApproval() {
      if (!this.selectedSpu || this.selectedSpu.length <= 0) {
        this.$message.warning('请选择需提审的商品')
        return
      }
      for (let item of this.selectedSpu) {
        if (item.checkedStatus == '4') {
          this.$message.warning(`${item.name}提审中`)
          return
        }
        if (
          item.checkedStatus == '2' &&
          item.isFiled &&
          item.isSpuModify <= 0 &&
          item.isSkuModify <= 0
        ) {
          this.$message.warning(`${item.name}无需提审`)
          return
        }
      }

      // 弹窗确认
      this.$confirm('确认建档审批提交吗？', {
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SHOW_LOADING')
          this.$put(
            `/goods/spu/sendApproval/batch`,
            this.selectedSpu.map((item) => item.id)
          )
            .then((res) => {
              this.$message({
                message: '提交成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.onChange()
                }
              })
            })
            .finally(() => {
              this.$store.commit('SHOW_LOADING', false)
            })
        })
        .catch(() => {})
    },
    // 批量下架
    onBatchOutSale() {
      if (!this.selectAllList.length) {
        this.$message.warning('未选中数据！')
        return
      }
      // 弹窗确认
      this.$confirm('是否下架选中的商品？', {
        type: 'warning'
      })
        .then(() => {
          this.batchSaleLoading = true
          this.$post('/goods/spu/outSale/batch', this.selectAllList)
            .then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.onChange()
                }
              })
            })
            .finally(() => {
              this.batchSaleLoading = false
            })
        })
        .catch(() => {})
    },
    // 显示附件列表
    showAttaList(row) {
      console.log(row)
      if (row.attaCount > 0) {
        this.dialogType = 'attaList'
        this.dialogVisible = true
        this.$get(`/attachment/getBySpuId/${row.id}`).then((res) => {
          console.log(res)
          this.attachmenList = res
        })
      }
    },
    // 删除附件
    deleteAtta(row, index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$delete(`/attachment/delAttachment/${row.id}`).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.attachmenList.splice(index, 1)
            this.fetchSpuList()
          })
        })
        .catch(() => {})
    },

    showUploadAtta(row) {
      this.dialogType = 'uploadAtta'
      this.dialogVisible = true
      this.uploadAttaForm['spuId'] = row.id
    },

    onSuccessUpload(res, file) {
      console.log(res, file)
      this.uploadAttaForm['attaUrl'] = res
      this.uploadAttaForm['fileName'] = file.name
      this.uploadAttaForm['size'] = file.size
      let type = file.name.substring(file.name.lastIndexOf('.') + 1)
      this.uploadAttaForm['fileType'] = type
    },

    onRemoveUpload(file) {
      console.log(file)
      this.clearAttaForm()
    },

    uploadRequest(data) {
      console.info('自定义上传')
      const _file = data.file
      var formData = new FormData()
      formData.append('file', _file)
      return new Promise((resolve, reject) => {
        this.uploadLoading = true
        this.$post(data.action, formData)
          .then((res) => {
            this.uploadLoading = false
            resolve(res)
          })
          .catch((err) => {
            reject()
          })
      })
    },
    // 添加附件
    addAtta() {
      console.log('添加附件', this.uploadAttaForm)
      this.$confirm('确定添加？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$post(`/attachment/addAttachment`, this.uploadAttaForm).then(
            (res) => {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.clearAttaForm()
              // this.dialogVisible = false
              this.fetchSpuList()
            }
          )
        })
        .catch(() => {})
    },
    // 清除添加附件参数
    clearAttaForm() {
      this.uploadAttaForm['fileName'] = ''
      this.uploadAttaForm['fileType'] = ''
      this.uploadAttaForm['size'] = ''
      this.uploadAttaForm['attaUrl'] = ''
      this.uploadAttaForm['isProtect'] = false
      // this.uploadAttaForm['spuId'] = null
      this.$refs['upload'].clearFiles()
    },
    // 弹窗关闭
    whenClose() {
      this.clearAttaForm()
      this.$refs['upload'].clearFiles()
    },

    onResetQuery() {
      this.$refs['spuTableData'].clearSort()
      this.$refs['searchQuery'].resetFields()
      this.searchQuery['searchDegree'] = 100
      this.searchQuery['pageIndex'] = 1
      this.searchQuery['orderStr'] = 'updateDate desc'
      this.onChange()
    },

    showMaterial(data) {
      // console.log(data)
      let view = this.$instantCompt(require('./material/index').default)
      view.init(data.id)
    },
    // 导出
    exportSpu() {
      let downloadTotal =
        (this.selectAllList && this.selectAllList.length) ||
        this.searchQuery.total ||
        0
      // if(downloadTotal > 5000){
      //   this.$message.error(`单次下载数量超过5000，请先筛选过滤`)
      //   return
      // }
      this.$confirm(`当前待下载的商品数量：${downloadTotal}，是否确认下载？`, {
        type: 'warning'
      })
        .then(() => {
          this.doExport()
        })
        .catch(() => {
          return
        })
    },

    doExport() {
      this.$store.commit('SHOW_LOADING')
      let params = _.cloneDeep(this.searchQuery)
      if (this.selectAllList && this.selectAllList.length > 0) {
        params.inIds = this.selectAllList
      } else if (Array.isArray(params.inIds)) {
        for (let id of params.inIds) {
          if (isNaN(id)) {
            this.$message.error(`“${id}”非商品ID`)
            this.$store.commit('SHOW_LOADING', false)
            return
          }
        }
      }
      if (!this.searchQuery.total) {
        this.$message.error('当前导出的数据为空')
        this.$store.commit('SHOW_LOADING', false)
        return
      }
      exportSpuHttp(params)
        .then((blob) => {
          console.log('进去了')
          console.info(blob)
          let fileName = `商品明细清单${formatDate(
            new Date().getTime(),
            'Y-M-D h:m'
          )}`
          FileSaver.saveAs(blob, fileName + '.xlsx')
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    },
    /*
    // 导入Excel
    importSpu() {
      let view = this.$instantCompt(require('./import-spu/index.vue').default)
      view.show()
      // 监听导入成功事件
      this.$bus.on('importSpuSuccess', () => {
        // 导入成功后刷新列表
        this.fetchSpuList()
        // 隐藏弹窗
        view.hide()
      })
    },
    */
    showLog(row) {
      let view = this.$instantCompt(require('@/views/log/index.vue').default, {
        logType: '1',
        relationKey: row.id
      })
      view.init()
    },

    push2Nc(row) {
      this.$confirm('确定推送数据至NC吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$get(`/goods/spu/pushNC/${row.id}`).then((res) => {
            this.$message({
              type: 'success',
              message: '推送成功!'
            })
          })
        })
        .catch(() => {})
    },

    showProductBook(row) {
      this.tinymceData = ''
      this.isProductBook = true
      this.tinymceSpuId = row.id
      this.tinymceSpuName = row.name
      this.$get(`/goods/spu/getSpuInstructions/${row.id}`)
        .then((res) => {
          if (res && res.html) this.tinymceData = res.html
        })
        .catch((error) => {
          console.log(error)
        })
    },

    CloseProductBook() {
      this.isProductBook = false
    },

    saveProductBook() {
      this.$confirm('确定要保存商品说明书吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.isProductBook = false
          this.$post('/goods/spu/addInstructions', {
            spuId: this.tinymceSpuId,
            spuName: this.tinymceSpuName,
            content: this.tinymceData
          }).then((res) => {
            this.$message.success('操作成功')
            this.fetchSpuList()
          })
        })
        .catch((error) => {
          reject(error)
        })
    }
  },
  watch: {
    productFlags(newvalue, oldValue) {
      switch (newvalue) {
        case 'all':
          this.searchQuery.isDelete = false
          this.searchQuery.isOnSale = ''
          break
        case 'release':
          this.searchQuery.isDelete = false
          this.searchQuery.isOnSale = true
          break
        case 'unsale':
          this.searchQuery.isDelete = false
          this.searchQuery.isOnSale = false
          break
        case 'recycle':
          this.searchQuery.isDelete = true
          this.searchQuery.isOnSale = ''
          break
      }
      this.onChange()
    }
  },
  destroyed() {
    this.$bus.off('refresh-page')
  }
}
</script>

<style lang="scss" scoped>
.form_wapper {
  margin-left: 10px;
}
// .form_wapper {
//   display: grid;
//   grid-template-columns:repeat(4,1fr);
// }

// @media screen and (max-width: 1800px) {
//   .form_wapper {
//     display: grid;
//     grid-template-columns:repeat(3,1fr);
//   }
// }

// @media screen and (max-width: 1500px) {
//   .form_wapper {
//     display: grid;
//     grid-template-columns:repeat(2,1fr);
//   }
// }
</style>
