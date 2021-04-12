<template>
  <div class="wapper" v-loading="loading">
    <el-row :gutter="20" style="border-bottom:rgba(0,0,0,.15) 1px solid;">
      <el-col :span="4">
        <p class="t_r">模板名称</p>
        <p class="t_r">分类</p>
      </el-col>
      <el-col :span="20">
        <p>{{ item.name }}</p>
        <p>{{ item.cateName }}</p>
      </el-col>
    </el-row>
      <div class="question_wapper" v-for="v in item.questions" :key="v.id">
        <div class="question">
           {{ questionType[v.type] }} <span v-if="v.type === '1'" >【权重：{{ v.weight }}】</span> {{v.question}} 
        </div>
        <div class="question_remark" v-if="v.remark">
            {{v.remark}} 
        </div>
        <el-table class="answer" v-if="v.answers && v.answers.length > 0" style="width: 300px" :data="v.answers" border
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          >
          <el-table-column prop="answer" label="选项" ></el-table-column>
          <el-table-column  v-if="v.type === '1'" prop="score" label="分值" width="100px"></el-table-column>
        </el-table>
      </div>
  </div>
</template>

<script>
import {  getTemplateById } from '@/api/questionnaire'

export default {
  name: 'detail',
  data() {
    return {
      loading: false,
       questionType: {
        '1': '【评分题】',
        '2': '【单选题】',
        '3': '【多选题】',
        '4': '【问答题】'
      },
      item: {
      }
    }
  },
  props: {
    id: {
      type: [Number, String],
    }
  },
  watch:　{
    id(val) {
      if (val) {
        this.loading = true;
        getTemplateById(val)
          .then(res => this.item = res)
          .finally(() => this.loading = false)
      }
    }
  },
  mounted() {
    if (this.id) {
        this.loading = true;
        getTemplateById(this.id)
          .then(res => this.item = res)
          .finally(() => this.loading = false)
    }
  }
}
</script>

<style lang="scss" scoped>
.wapper {
  margin: -15px 10px;
  overflow-y: auto;
  overflow-x: hidden;
  .t_r {
    text-align: right;
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
      color: rgba(0,0,0,.95);
      padding-left: 6px;
      color: #999;
    }
  }
}
</style>