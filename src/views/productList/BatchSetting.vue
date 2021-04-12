<template>
  <span>
    <el-dropdown    @command="onItemClick" szie="medium" >
      <el-button type="primary"  > 
        批量设置<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <!-- <template v-for="item in settingList" :key="item.label">
          <el-dropdown-item  v-permission-button="item.permission" :command="item.name" :key="item.label">{{item.label}}</el-dropdown-item>
        </template> -->
        <el-dropdown-item v-permission-button="'batch_update_category'"  command="category" >分类</el-dropdown-item>
        <el-dropdown-item v-permission-button="'batch_update_brand'"  command="brand" >品牌</el-dropdown-item>
        <el-dropdown-item v-permission-button="'batch_update_retail_unit'"  command="retail_unit" >单位</el-dropdown-item>
        <el-dropdown-item v-permission-button="'batch_update_produce_place'"  command="produce_place" >产地</el-dropdown-item>
        <el-dropdown-item v-permission-button="'batch_update_shelf_life'"  command="shelf_life" >保质期</el-dropdown-item>
        <el-dropdown-item v-permission-button="'batch_update_scope_authoriza'"  command="scope_authoriza" >授权渠道范围</el-dropdown-item>
        <el-dropdown-item v-permission-button="'batch_update_brand_category'"  command="brand_category" >商品服务类型</el-dropdown-item>
        <el-dropdown-item v-permission-button="'batch_update_is_need_on_sale'"  command="is_need_on_sale" >是否需上架</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="批量设置"
      :visible.sync="dialogVisible"
      @close="close"
      close-on-press-escape
      close-on-click-modal>
      <el-form label-width="120px" :model="params" ref="spuData" :rules="formRules" size="mini">
        <el-form-item v-if="clickItem === 'category'" prop="category" label="分类">
          <select-category
            v-model="params.category" :checkStrictly="false"
          />
        </el-form-item>
        <el-form-item v-if="clickItem === 'brand'" prop="brand" label="品牌">
          <select-brand v-model="params.brand" />
        </el-form-item>
        <el-form-item v-if="clickItem === 'retail_unit'" prop="retail_unit" label="单位">
          <el-select v-model="params.retail_unit" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in danweis"
              :key="item.code"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="clickItem === 'produce_place'" prop="produce_place" label="产地">
          <country-select v-model="params.produce_place" checkStrictly />
        </el-form-item>
        <el-form-item v-if="clickItem === 'shelf_life'" prop="shelf_life" label="保质期">
          <el-input-number
            v-model="params.shelf_life"
            :step="30"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item v-if="clickItem === 'scope_authoriza'" prop="scope_authoriza" label="授权渠道范围">
          <select-add-good-channel-type
            multiple
            v-model="params.scope_authoriza"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item v-if="clickItem === 'brand_category'" prop="brand_category" label="商品服务类型">
          <el-select v-model="params.brand_category"  >
            <el-option
              v-for="item in brand_categoryOptions" :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="clickItem === 'is_need_on_sale'" prop="is_need_on_sale" label="是否需上架">
          <el-radio-group v-model="params.is_need_on_sale">
            <el-radio :label="true">需上架成品</el-radio>
            <el-radio :label="false">无需上架成品（中小样、赠品、试用装、清货历史商品等）</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close" size="small" >取 消</el-button>
        <el-button type="primary" @click="onConfirm" size="small" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import SelectCategory from '@/components/SelectCategory'
import SelectBrand from '../../components/SelectBrand.vue';
import {  getDanweiList } from "@/api/channel";
import CountrySelect from "@/components/CountrySelect";
import SelectAddGoodChannelType from '@/components/SelectAddGoodChannelType'
import { brandCategory } from "@/const/goods"
import { batchUpdateField } from "@/api/goods"

export default {
  name: 'BatchSetting',
  data() {
    return {
      brand_categoryOptions: brandCategory.properties,
      dialogVisible: false,
      settingList: [
        { label: '分类', name: 'category' },
        { label: '品牌', name: 'brand', permission: 'batch_update_brand' },
        { label: '单位', name: 'retail_unit' },
        { label: '产地', name: 'produce_place' },
        { label: '保质期', name: 'shelf_life' },
        { label: '授权渠道范围', name: 'scope_authoriza' },
        { label: '商品服务类型', name: 'brand_category' },
        { label: '是否需上架', name: 'is_need_on_sale' },
      ],
      params: {
      },
      clickItem: null,
      danweis: [], //计量单位
      loading: false,
      formRules: {
        category: [
          { required: true, message: "请选择商品分类", trigger: "change" },
        ],
        brand: [{ required: true, message: "请选择品牌", trigger: "change" }],
        retail_unit: [
          { required: true, message: "请输入零售单位", trigger: "change" },
        ],
        produce_place: [
          { required: true, message: "请输入产地", trigger: "change" },
        ],
        shelf_life: [
          {
            required: true,
            validator: (rule, value, callback) => {
              setTimeout(() => {
                console.log(value);
                if (value < 1) {
                  callback(new Error("保质期只能填写1-30内的数字、30的倍数、或者365"));
                } else if( value>= 1 && value <= 30){
                  callback();
                }else if(value==365){
                  callback();
                }else if(value %30 <= 0){
                 callback();
                }else {
                  callback(new Error("保质期只能填写1-30内的数字、30的倍数、或者365"));
                }
              })
            },
            trigger: "blur",
          },
        ],
        scope_authoriza: [
          {
            required: true,
            validator: (rule, value, callback) => {
              setTimeout(() => {
                console.log(value, "请选择授权渠道范围");
                if (!this.params.scope_authoriza || !this.params.scope_authoriza.length) {
                  callback(new Error("请选择授权渠道范围"));
                } else {
                  callback();
                }
              }, 100);
            },
            trigger: "change",
          },
        ],
        brand_category: [
          { required: true, message: "请选择商品服务类型", trigger: "change" },
        ],
        is_need_on_sale: [
          { required: true, message: "请选择是否需要上架", trigger: "change" },
        ],
      },
    }
  },
  props: {
    selectedList: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectedSpu: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    close() {
      this.dialogVisible = false;
      this.clickItem = null;
      this.params = {}
    },
    onItemClick(type) {
      console.log('====>onItemClick');
      console.log(this.selectedSpu);
      if (!(this.selectedList && this.selectedList.length)) {
        this.$message.warning('未选中数据！')
        return;
      }
      if (!type) {
        return;
      }
      this.clickItem = type;
      this.dialogVisible = true
    },
    onConfirm() {
      console.info('params', this.params)

      // if (this.clickItem === 'is_need_on_sale') {
      //   if (!this.params.is_need_on_sale && this.selectedSpu.some(v => v.isOnSale)) {
      //     let spu = this.selectedSpu.find(v => v.isOnSale)
      //     this.$message.error(`"${spu.name}"商品已发布,无法改为无需上架`)
      //     return;
      //   }
      // }

      this.$refs['spuData'].validate((valid) => {
        console.log('valid', valid)
        if(valid){
          this.$confirm(`确认批量修改吗?`, {
            type: 'warning'
          }).then(() => {
            this.loading = true
            if (this.clickItem === 'category') {
              let str = this.params.category.substring( this.params.category.lastIndexOf('-') + 1 , this.params.category.length )
              console.log(str);
              this.params.category = str
            }
            if (this.clickItem === 'scope_authoriza') {
              this.params.scope_authoriza = this.params.scope_authoriza.join(',')
            }
            batchUpdateField({
              field: this.clickItem,
              spuIds: this.selectedList,
              value: this.params[this.clickItem]
            }).then(res => {
              this.success()
            }).finally(()=>{
              this.loading = false
            })
          }).catch(() => {
          })
        }
      })
    },
    success() {
      this.$message.success(`批量修改${this.settingList.find(v => v.name === this.clickItem).label}成功`)
      this.$emit('afterSuccess', true)
      this.close()
    }
  },
  components: { SelectCategory, SelectBrand, CountrySelect, SelectAddGoodChannelType },
  created() {
    getDanweiList().then((res) => {
      this.danweis = res;
    });
    this.close();
  }
}
</script>

<style>

</style>