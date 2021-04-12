<template>
  <div class="wapper">
    <div class="top" >
    <el-button type="primary" @click="onSave" >保存模板</el-button>
    <el-form ref="f" :model="form" :rules="rules" label-width="100px" style="width: 550px;margin-top: 16px">
      <el-form-item label="分类" prop="cateCode">
        <new-products-category-select v-model="form.cateCode" :checkStrictly="false" ></new-products-category-select>
      </el-form-item>
      <el-form-item label="问卷名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入（30字以内）"></el-input>
      </el-form-item>
    </el-form>

    <el-dropdown  type="primary" size="medium"  @command="addQuestion">
      <el-button type="primary" szie="small" > 
        <i class="el-icon-plus"></i> &nbsp;新增问题&nbsp;<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown" >
        <el-dropdown-item command="1" >评分题</el-dropdown-item>
        <el-dropdown-item command="2" >单选题</el-dropdown-item>
        <el-dropdown-item command="3" >多选题</el-dropdown-item>
        <el-dropdown-item command="4" >问答题</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>

    <div class="question_wapper" v-for="(item, index) in form.questions" :key="index">
      <div class="question">
        <scoring-question v-if="item.type === '1'" :ref="`q_${index}`" v-model="form.questions[index]" @up="onUp(index)" @down="onDown(index)" @remove="onRemove(index)" ></scoring-question>
        <single-choice v-if="item.type === '2'" :ref="`q_${index}`" v-model="form.questions[index]" @up="onUp(index)" @down="onDown(index)" @remove="onRemove(index)"></single-choice>
        <multiple-choice v-if="item.type === '3'" :ref="`q_${index}`" v-model="form.questions[index]" @up="onUp(index)" @down="onDown(index)" @remove="onRemove(index)"></multiple-choice>
        <question-answer v-if="item.type === '4'" :ref="`q_${index}`" v-model="form.questions[index]" @up="onUp(index)" @down="onDown(index)" @remove="onRemove(index)"></question-answer>
        <!-- <scoring-question v-if="item.type === '1'" :ref="`q_${index}`" v-model="form.questions[index]" @up="onUp(index)" @down="onDown(index)" @remove="onRemove(index)" ></scoring-question> -->
      </div>
    </div>
  </div>
</template>

<script>
import NewProductsCategorySelect from "@/views/productList/developProduct/component/NewProductsCategorySelect.vue";
import ScoringQuestion from './component/ScoringQuestion.vue';
import SingleChoice from './component/SingleChoice.vue';
import MultipleChoice from './component/MultipleChoice.vue';
import QuestionAnswer from './component/QuestionAnswer.vue';

import { addTemplate, updateTemplate, getTemplateById } from '@/api/questionnaire'

export default {
  name: 'EditTemplate',
  components: { NewProductsCategorySelect, ScoringQuestion, SingleChoice, MultipleChoice, QuestionAnswer,  },
  data() {
    return {
      form: {
        cateCode: '',
        name: '',
        questions: []
      },
      rules: {
        cateCode: [{ required: true, message: "请输入分类", trigger: "change" }],
        name: [{ required: true, message: "请输入模板名称", trigger: "change" },{ max: 30,  message: "模板名称不能超过30个字", trigger: ["change", 'blur'] }],
      },
    }
  },
  computed: {
    weightSum() {
      let weightSum = 0;
      this.form.questions.forEach(v => {
        if (v.type === '1') {
          weightSum += v.weight;
        }
      })
      return weightSum;
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      getTemplateById(this.$route.query.id)
        .then(res => this.form = res)
    }
    if (this.$route.query && this.$route.query.copyId) {
      getTemplateById(this.$route.query.copyId)
        .then(res => {
          this.form = res;
          this.form.id = null;
        })
    }
  },
  methods:{
    onSave(){
      if(this.form.questions==null||this.form.questions.length<=0){
         this.$message.error('模板问题不能为空，请添加问题')
        return;
      }
      if (this.form.questions.some(v => v.type === '1') && this.weightSum !== 1) {
        this.$message.error('评分题的权重之和必须为1')
        return;
      }
      // #region 评分题最高分校验
      let maxScoringArr = this.form.questions.filter(v => v.type === '1').map(v => {
        let max = 0;
        v.answers.forEach(a =>  max = a.score > max ? a.score : max)
        return max;
      })
      if (maxScoringArr.length > 0 && maxScoringArr.some(v => v!== maxScoringArr[0]) ) {
        this.$message.error('评分题的最高分值必须相同');
        return;
      }
      
      // #endregion
      this.$refs.f.validate(v => {
        let q_v = true;
        Promise.all(this.form.questions.map((value, index) => (this.$refs[`q_${index}`][0] || this.$refs[`q_${index}`]).save()))
          .then(arr => {
            if (v && q_v) {
              this.$store.commit('SHOW_LOADING')
              if (!this.form.id) {
                addTemplate(this.form)
                  .then(res => {
                    this.$message.success('新建成功！')
                    this.$bus.$emit('getData', true);
                    this.$router.push('/questionnaire/template')
                  })
                  .finally(() => {
                    this.$store.commit('SHOW_LOADING', false)
                  })
              } else {
                this.form.questions = this.form.questions.map(v => {
                  if (!v.id) {
                     v.modify = false;
                  }
                  return v
                })
                updateTemplate(this.form)
                  .then(res => {
                    this.$message.success('修改成功！')
                    this.$bus.$emit('getData', true);
                    this.$router.push('/questionnaire/template')
                  })
                  .finally(() => {
                    this.$store.commit('SHOW_LOADING', false)
                  })
              }
            }
          })
          .catch(err => {
            return
          })
      })
    },
    addQuestion(e) {
      let question = { question: '', type: e, modify: false, orderLevel: this.form.questions.length, };
      if (e === '1') {
        question. weight = 1;
        question.answers = new Array(6).fill(1).map((v, i) => ({answer: i * 2 + '' , orderLevel: i, score: i * 2 }));
      } else  if (e === '2' || e === '3'){
        question.answers = new Array(2).fill(1).map((v, i) => ({answer: '', orderLevel: i }));
      }
      this.form.questions = [...this.form.questions,  question]
    },
    onUp(index) {
      if (index === 0) {
        this.$message.error('该问题无法上移！')
        return;
      }
      let arr = this.form.questions;
      let tem = arr[index-1].orderLevel;
      arr[index - 1].orderLevel = arr[index].orderLevel;
      arr[index].orderLevel = tem;
      arr[index] = arr.splice(index - 1, 1, arr[index])[0];
      this.$message.success('移动成功！')
    },
    onDown(index) {
      let arr = this.form.questions;
      if (index === (arr.length - 1)) {
        this.$message.error('该问题无法下移！')
        return;
      }
      this.onUp(index + 1);
      
    },
    onRemove(index) {
      this.form.questions = this.form.questions.filter((v,i) => i !== index)
    }
  }
}
</script>

<style lang="scss" scoped>
.wapper {
  background: #fff;
  padding: 0px 32px 24px 32px;
}
.top {
  position: sticky;
  top: -24px;
  padding: 24px 16px 8px;
  margin: 0 -8px;
  background: #fff;
  z-index: 10;
}

.question_wapper {
  margin-top: 16px;
  .question {
    margin-top: 16px
  }
}
</style>