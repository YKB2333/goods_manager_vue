<template>
  <div class="wapper">
    <el-button type="primary" @click="save">提交问卷</el-button>
    <el-form style="width: 80%" class="form" ref="form" :model="form" label-width="150px" :rules="rules">
      <el-form-item label="分类" prop="cateCode">
        <new-products-category-select ref="select" v-model="form.cateCode" :disabled="true" ></new-products-category-select>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="问卷名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入（30字以内）"></el-input>
          </el-form-item>
          <el-form-item label="关联研发新品" prop="newProductsId">
            <template slot="label">
              关联研发新品
              <el-tooltip effect="dark" content="仅能选择未关联过问卷的商品" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>

            <new-product-select v-model="form.newProductsId" :cateCode="form.cateCode" ></new-product-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问卷自动结束时间" prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              @change="onEndDateChange"
              type="datetime"
              placeholder="请选择问卷自动结束时间" 
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="关联市面竞品" prop="competitiveProductsId">
            <competitive-product-select v-model="form.competitiveProductsId" :cateCode="form.cateCode"></competitive-product-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="问卷说明" prop="remarks">
        <el-input type="textarea" v-model="form.remarks"></el-input>
      </el-form-item>
    </el-form>
    <div class="question_wapper" v-for="v in template.questions" :key="v.id">
      <div class="question">
        【单选题】 <span v-if="v.type === '1'" >【权重：{{ v.weight }}】</span> {{v.question}} 
      </div>
      <div class="question_remark" v-if="v.remark" >
            {{v.remark}}
      </div>
      <el-table class="answer" v-if="v.answers && v.answers.length > 0" style="width: 300px" :data="v.answers" border>
        <el-table-column prop="answer" label="选项" ></el-table-column>
        <el-table-column  v-if="v.type === '1'" prop="score" label="分值" width="100px"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getTemplateById, getQuestionnaireById, addQuestionnaire } from '@/api/questionnaire'
import NewProductsCategorySelect from '@/views/productList/developProduct/component/NewProductsCategorySelect.vue';
import NewProductSelect from './component/newProductSelect.vue';
import CompetitiveProductSelect from './component/competitiveProductSelect.vue';


export default {
  components: { NewProductsCategorySelect, NewProductSelect, CompetitiveProductSelect,  },
  name: 'editQuestionnaire',
  created() {
    if (!this.$route.query) {
      return ;
    }
    let { id, templateId, cateCode } = this.$route.query;
    this.form.cateCode = cateCode || '';
    if (templateId) {
      this.form.questionnaireTempleteId = templateId;
      getTemplateById(templateId)
        .then(res => this.template = res)
    }

  },
  data() {
    let validateendDate = (rule, value, callback) => {
      let now = new Date().getTime();
      if (!value) {
        callback()
        return;
      }
      if (value < now ) {
        callback(new Error('问卷结束时间不可小于当前时间!'))
      }
      callback()
    };
    return {
      form: {
        cateCode: '',
        name: '',
        endDate: '',
        remarks: '',
        competitiveProductsId: '',
        newProductsId: ''
      },
      rules: {
        cateCode: [ { required: true, message: '', trigger: 'blur' },],
        name: [ { required: true, message: '请输入问卷名称', trigger: 'blur' }, {  max: 30, message: '长度在30个字符以内', trigger: ["change", 'blur'] },],
        endDate: [{validator: validateendDate, trigger: 'blur' }],
        newProductsId: [{ required: true, message: '请选择研发新品', trigger: ["change", 'blur'] },],
        remarks: [{  max: 100, message: '长度在100个字符以内', trigger: ["change", 'blur'] }]
      },
      template: {},
    }
  },
  methods: {
    onEndDateChange(e) {
      let date = new Date(e);
      if ( !date.getMinutes() && !date.getSeconds() ) {
        return;
      }
      this.form.endDate = date.setMinutes(0,0,0)
    },
    save() {
      this.$refs.form.validate()
        .then(res => {
          this.$store.commit('SHOW_LOADING')
          addQuestionnaire(this.form)
            .then(result => {
              this.$refs.form.resetFields();
              this.$bus.$emit('getQuestionnaireData', true)
              this.$message.success('新增问卷成功！')
              this.$router.push({
                path: '/questionnaire/questionnaire'
              })
            })
            .finally(() => {
              this.$store.commit('SHOW_LOADING',false)
            })
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.wapper {
  background: #fff;
  padding: 16px;
  .form {
    margin-top: 24px;
  }
  .question_wapper {
    padding-left: 10px;
    margin-top: 20px;
    .question {
      font-size: 14px;
      color: rgba(0,0,0,.95);
    }
    .answer {
      margin-top: 10px;
    }
    .question_remark {
      font-size: 14px;
    margin: 10px 0 10px;
    padding-left: 6px;
    color: #999;
  }   
  }
}
</style>