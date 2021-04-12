<template>
  <div class="wapper">
    <el-form ref="f" :model="form" :rules="rules" label-width="130px">
      <el-row :gutter="50">
        <el-col :offset="3" :span="9">
          <el-form-item label="配方编号" prop="formulaId">
            <el-input v-model="form.formulaId" :disabled="!!form.id" placeholder="请输入唯一的配方编号（20字以内）"></el-input>
          </el-form-item>
          <el-form-item label="研发新品名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入（20字以内）"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入对外展示的名称（例如调查问卷中展示的商品名称，20字以内）"></el-input>
          </el-form-item>
          <el-form-item label="试用分类" prop="cateCode">
            <new-products-category-select v-model="form.cateCode" :checkStrictly="false" placeholder="请选择"></new-products-category-select>
          </el-form-item>
          <el-form-item label="品牌" prop="brandName">
            <el-input v-model="form.brandName" placeholder="请输入品牌"></el-input>
          </el-form-item>
          <el-form-item label="产地" prop="producePlace">
            <country-select v-model="form.producePlace" checkStrictly placeholder="请选择"></country-select>
          </el-form-item>
          <el-form-item label="商品来源" prop="source">
            <source-select v-model="form.source"></source-select>
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
import NewProductsCategorySelect from './component/NewProductsCategorySelect'
import UploadImage from '@/components/UploadImage.vue'
import { addNewProduct, getNewProductById, updateNewProduct } from '@/api/goods'
import SourceSelect from './component/SourceSelect.vue'
export default {
  name: 'editNewProduct',
  components: {NewProductsCategorySelect,CountrySelect, UploadImage, SourceSelect, },
  data() {
    return {
      form: {
        brandName: '',// 品牌名称
        cateCode: '', //	分类编码
        formulaId: '',// 配方编号
        name: '',// 研发新品名称
        producePlace: '',// 产地
        productDescribe:'',// 核心卖点描述
        remarks: '',// 备注
        source: '',// 商品来源
        title: '',// 副标题
        titleImage: '' //商品图片
      },
      rules: {
        formulaId: [
          { required: true, message: '请输入配方编号', trigger: 'blur' },
          { max: 20, message: '长度必须在20字以内', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入研发新品名称', trigger: 'blur' },
          { max: 20, message: '长度必须在20字以内', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入副标题', trigger: 'blur' },
          { max: 20, message: '长度必须在20字以内', trigger: 'change' }
        ],
        cateCode: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
        brandName: [
          { max: 20, message: '长度必须在20字以内', trigger: 'change' }
        ],
        productDescribe: [
          { max: 16, message: '长度必须在16字以内', trigger: 'change' }
        ],
        remarks: [
          { max: 100, message: '长度必须在100字以内', trigger: 'change' }
        ],
        titleImage: [
           { required: false, message: '请上传图片', trigger: 'change' },
        ]
      }
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      getNewProductById(this.$route.query.id)
        .then(res => {
          this.form = res;
        })
    }
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
          updateNewProduct(this.form)
            .then(res => {
              this.$store.commit('SHOW_LOADING',false)
              this.$message.success('修改研发新品成功！');
              this.gotoList();
            })
        } else {
          this.$store.commit('SHOW_LOADING')
          addNewProduct(this.form)
            .then(res => {
                this.$store.commit('SHOW_LOADING',false)
              this.$message.success('新增研发新品成功！');
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
      this.$bus.$emit('get-develop-data', true);
      this.$router.push('/productlist/develop')
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