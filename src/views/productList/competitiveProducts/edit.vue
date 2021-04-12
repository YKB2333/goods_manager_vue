<template>
  <div class="wapper">
    <el-form ref="f" :model="form" :rules="rules" label-width="130px">
      <el-row :gutter="50">
        <el-col :offset="3" :span="9">
          <el-form-item label="商品条码" prop="codeBar">
            <el-input v-model="form.codeBar" :disabled="!!form.id" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="市面竞品名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入（20字以内）"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入对外展示的名称（例如调查问卷中展示的商品名称，20字以内）"></el-input>
          </el-form-item>

          <el-form-item label="规格" prop="specs">
            <el-input v-model="form.specs" placeholder="请输入规格"></el-input>
          </el-form-item>

          <el-form-item label="试用分类" prop="cateCode">
            <new-products-category-select :checkStrictly="false" v-model="form.cateCode" placeholder="请选择"></new-products-category-select>
          </el-form-item>

          <el-form-item label="品牌" prop="brandName">
            <el-input style="width: 178px" v-model="form.brandName" placeholder="请输入品牌"></el-input>
          </el-form-item>
          <el-form-item label="产地" prop="producePlace">
            <country-select  v-model="form.producePlace" checkStrictly placeholder="请选择"></country-select>
          </el-form-item>
          
          <el-form-item label="价格" prop="price">
            <!-- <el-input-number v-model="form.price" :min="0"   controls-position="right"></el-input-number> -->
            <el-input
              v-model="form.price"
              style="width: 178px"
              min="0"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item label="核心卖点描述" prop="productDescribe">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, }"
              placeholder="请输入卖点（最多输入16个字）"
              v-model="form.productDescribe">
            </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, }"
              placeholder="请输入（最多输入100个字）"
              v-model="form.remarks">
            </el-input>
          </el-form-item>
          
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品图片" prop="titleImage">
            <el-input style="display: none" v-model="form.titleImage" placeholder=""></el-input>
            <upload-image
              ref="uploadImage"
              url="/uploadGoodsImages"
              :isAutoFit="true"
              v-model="form.titleImage"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="opt">
        <el-button size="small" @click="gotoList" >返回列表</el-button>
        <el-button size="small" type="primary" @click="save">保 存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import CountrySelect from '@/components/CountrySelect.vue'
import NewProductsCategorySelect from '../developProduct/component/NewProductsCategorySelect'
import UploadImage from '@/components/UploadImage.vue'

import { addCompetitiveProducts, getCompetitiveProductsById, updateCompetitiveProducts } from '@/api/goods'
export default {
  name: 'editCompetitiveProducts',
  components: {NewProductsCategorySelect,CountrySelect, UploadImage,  },
  data() {
    return {
      form: {
        specs: '', // 规格
        brandName: '',// 品牌名称
        cateCode: '', //	分类编码
        codeBar: '',// 商品条码
        name: '',// 市面竞品名称
        producePlace: '',// 产地
        productDescribe:'',// 核心卖点描述
        remarks: '',// 备注
        price: null,// 价格
        title: '',// 副标题
        titleImage: '' //商品图片
      },
      rules: {
        codeBar: [
          { required: true, message: '请输入商品条码', trigger: 'blur' },
          { max: 20, message: '长度必须在20字以内', trigger: ['change', 'blur']  }
        ],
        name: [
          { required: true, message: '请输入市面竞品名称', trigger: 'blur' },
          { max: 20, message: '长度必须在20字以内', trigger: ['change', 'blur'] }
        ],
        title: [
          { required: true, message: '请输入副标题', trigger: 'blur' },
          { max: 20, message: '长度必须在20字以内', trigger: ['change', 'blur']  }
        ],
        cateCode: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
        brandName: [
          { max: 20, message: '长度必须在20个字以内', trigger: ['change', 'blur'] }
        ],
        productDescribe: [
          { max: 16, message: '长度必须在16个字以内', trigger: ['change', 'blur'] }
        ],
        remarks: [
          { max: 100, message: '长度必须在100个字以内', trigger: ['change', 'blur'] }
        ],
        titleImage: [
           { required: true, message: '请上传图片', trigger: ['change', 'blur'] },
        ],
        specs: [
          {max: 20, message: '长度必须在20个字以内', trigger: ['change', 'blur']}
        ],
        price: [
          {  required: true, message: '请输入价格', trigger: 'blur' },
          {  pattern: /^0*[1-9][0-9]*(\.[0-9]{1,2})?$|^0+\.[0-9]?[1-9]0?$/, message: "请输入价格(小数点后最多两位)", trigger: ['change', 'blur'] },
        ],
      }
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      getCompetitiveProductsById(this.$route.query.id)
        .then(res => {
          this.form = res;
        })
    }
  },
  watch: {
  },
  methods: {
    save() {
      this.$refs.f.validate(v => {
        if (!v) {
          return;
        }
        console.log(this.form);

        if (this.form.id) {
          console.log(this.form.id);
          this.$store.commit('SHOW_LOADING')
          updateCompetitiveProducts(this.form)
            .then(res => {
              this.$store.commit('SHOW_LOADING',false)
              this.$message.success('修改市场竞品成功！');
              this.gotoList();
            })
        } else {
          this.$store.commit('SHOW_LOADING')
          addCompetitiveProducts(this.form)
            .then(res => {
              this.$store.commit('SHOW_LOADING',false)
              this.$message.success('新增市场竞品成功！');
              this.gotoList();
              this.reset()
            })
        }
      })
    },
    reset() {
      this.$refs.f.resetFields();
    },
    gotoList() {
      this.$router.push('/productlist/competitiveProducts')
    }
  }
}
</script>

<style lang="scss" scoped>
.wapper {
  background: #fff;
  padding-top: 40px;
  padding-bottom: 16px;
  .opt {
    text-align: center;
    width: 200px;
    margin: 0 auto;
  }
}
</style>