<template>
  <div class="wapper" v-loading="loading" >
    <el-row :gutter="10" style="border-bottom: rgba(0,0,0,.15) 1px solid;">
      <el-col :span="24">
        <span class="label">问卷标题</span>
        <span>{{item.name}}</span>
      </el-col>
       <el-col :span="24">
        <span class="label">分类</span>
        <span>{{item.cateName}}</span>
      </el-col>    
      <el-col :span="12">
        <span class="label">关联研发新品</span>
        <span>{{item.newProducts && item.newProducts.name }}</span>
      </el-col>  
      <el-col :span="12">
        <span class="label">配方编号</span>
        <span>{{item.newProducts && item.newProducts.formulaId }}</span>
      </el-col>   
      <el-col :span="12">
        <span class="label">关联市面竞品</span>
        <span>{{item.competitiveProducts && item.competitiveProducts.name }}</span>
      </el-col>  
      <el-col :span="12">
        <span class="label">市面竞品条码</span>
        <span>{{item.competitiveProducts && item.competitiveProducts.codeBar }}</span>
      </el-col>   
      <el-col :span="24" >
        <span class="label">问卷说明</span>
        <span>{{item.remarks }}</span>
      </el-col>  
      <el-col :span="24" >
        <span class="label">问卷自动结束时间</span>
        <span >{{ item.endDate && $formatDate(item.endDate,'Y-M-D h:m:s') }}</span>
      </el-col> 
      <el-col :span="6" >
        <span class="label">答卷数</span>
        <span>{{ item.respondents }}</span>
      </el-col> 
      <el-col :span="6" >
        <span class="label">研发新品总评分</span>
        <span>{{ item.newProducts!=null ? item.newScore : '/' }}</span>
      </el-col> 
      <el-col :span="6" >
        <span class="label">市面竞品总评分</span>
        <span>{{ item.competitiveProducts!=null ? item.competitiveScore : '/' }}</span>
      </el-col> 
      <el-col :span="6" style="text-align: center" >
        <el-button type="primary" @click="exportAnswer" >下载全部答卷</el-button>
      </el-col> 
    </el-row>

    <div v-for="(q, q_i) in item.questions" :key="q.id" >
      <div class="question_title" >
        {{ questionType[q.type] }} <span v-if="q.type === '1'">【权重：{{q.weight}}】</span> {{q.question}}
        <span v-if="q_i === 0" class="tip" >
          <el-tooltip effect="dark" >
            <div slot="content" style="white-space: pre-wrap"> {{tip}} </div>
            <i class="el-icon-info"></i>
          </el-tooltip>
          
        </span>
      </div>
      <div class="question_remark" v-if="q.remark" >
            {{q.remark}}
      </div>
      <div v-if="q.answers && q.answers.length > 0">
        <div v-if="q.type === '1'">
          <el-table class="answer" :summary-method="getSummaries" show-summary style="width: 650px" :data="q.answers" border :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <el-table-column prop="answer" label="选项" ></el-table-column>
            <el-table-column   prop="score" label="分值" width="80px"></el-table-column>
            <el-table-column   prop="newSubtotal" label="研发新品人数" width="100px" :formatter="(row) => item.newProducts ? Number(row.newSubtotal) : '/'">
            </el-table-column>
            <el-table-column   prop="newRate" label="研发新品占比" width="100px" :formatter="(row) => item.newProducts ? Number(row.newRate) + '%' : '/'" ></el-table-column>
            <el-table-column   prop="competitiveSubtotal" label="市面竞品人数" width="100px" :formatter="(row) => item.competitiveProducts ? (Number(row.competitiveSubtotal) ) : '/'" ></el-table-column>
            <el-table-column   prop="competitiveRate" label="市面竞品占比" width="100px" :formatter="(row) => item.competitiveProducts ? (Number(row.competitiveRate) + '%') : '/'"></el-table-column>
          </el-table>
        </div>
        <div v-if="q.type === '2' || q.type === '3'">
          <el-table class="answer"  style="width: 400px" :data="q.answers" border :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <el-table-column prop="answer" label="选项" ></el-table-column>
            <el-table-column   prop="subtotal" label="人数" width="100px" :formatter="(row) => Number(row.subtotal)" ></el-table-column>
            <el-table-column   prop="rate" label="占比" width="100px" :formatter="(row) => (Number(row.rate) + '%')"></el-table-column>
          </el-table>
        </div>
        <div v-if="q.type === '4'">
          <el-table class="answer"  style="width: 600px" :data="q.answers" border :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <el-table-column type="index" label="序号" width="80px"></el-table-column>
            <el-table-column   prop="answer" label="回答" ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const tip = `人数：该选题，选中该选项的人数; 
占比：该选题，选中该选项的人数占总人数的百分比；（总人数，指该调查问卷的答卷数）;  
研发新品人数：该研发新品选题，选中该选项的人数；   
研发新品占比：该研发新品选题，选中该选项的人数占总人数的百分比；
市面竞品人数：该市面竞品选题，选中该选项的人数；   
市面竞品占比：该市面竞品选题，选中该选项的人数占总人数的百分比；
研发新品平均分：该研发新品选题的平均分；
市面竞品平均分：该市面竞品选题的平均分；`
import { formatDate } from '@/utils'
import FileSaver from 'file-saver'
import {  getQuestionnaireById, exportUserAnswer } from '@/api/questionnaire'
export default {
  name: 'detail',
  data() {
    return {
      tip,
      loading: false,
      questionType: {
        '1': '【评分题】',
        '2': '【单选题】',
        '3': '【多选题】',
        '4': '【问答题】'
      },
      item: {}
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  mounted() {
    if (this.id) {
      this.getData();
    }
  },
  watch: {
    id(e) {
      this.getData();
    }
  },
  methods: {
    getSummaries({ columns, data }) {
      let q = this.item.questions.find(v => v.id == data[0].questionId);
      let arr = new Array(6);
      if (this.item.newProducts) {
        arr[2] = '平均分：' + (q ? Number(q.newAvgScore) : '');
      }
      if (this.item.competitiveProducts) {
        arr[4] = '平均分：' + (q ?  Number(q.competitiveAvgScore) : '');
      }
      return arr;
    },
    getData(){
      this.loading = true;
      getQuestionnaireById(this.id)
        .then(res => this.item = res)
        .finally(() => {
          this.loading = false;
        })
    },
    exportAnswer() {
      exportUserAnswer(this.item.id)
        .then(blob => {
          FileSaver.saveAs(blob, this.item.name+'.xlsx')
        })
    }
  }

}
</script>

<style lang="scss" scoped>
.wapper {
  color: rgba(0,0,0, .85);
  .el-col {
    margin: 10px 0;
    display: flex;
    .label {
      flex-shrink: 0;
      width: 130px;
      margin-right: 20px;
      text-align: right;
      display: inline-block;
    }
  }
  .question_title {
    margin: 15px 0 15px;
    .tip {
      float: right;
      margin-right: 20px;
      color: rgba(0,0,0, .65);
    }
  }
  .question_remark {
    margin: 15px 0 15px;
    padding-left: 6px;
    color: #999;
  }    
}

</style>