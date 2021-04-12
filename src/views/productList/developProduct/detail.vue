<template>
  <div>
    <el-row :gutter="30" class="wapper" v-if="newProduct">
      <el-col :span="4">
        <div class="title">
          研发新品资料
        </div>
        <img :src="newProduct.titleImage || require('@/assets/images/logo.png')" width="100%" >
      </el-col>
      <el-col :span="20" class="right">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="content mt20">
              <div> 研发新品名称：&nbsp;&nbsp;{{ newProduct.name }} </div>
              <div> 品牌：&nbsp;&nbsp;{{ newProduct.brandName }} </div>
              <div> 新品状态：&nbsp;&nbsp;{{ newProduct.status==null?'':statusMap[newProduct.status]   }} </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="content mt20">
              <div> 配方编号：&nbsp;&nbsp;{{ newProduct.formulaId }} </div>
              <div> 产地：&nbsp;&nbsp;{{ newProduct.producePlace }} </div>
              <div> 
                <el-tooltip
                effect="dark"
                :content="newScoreToolTip"
                placement="top"><span>总评分<i class="el-icon-info ml6"></i></span>
                </el-tooltip>: &nbsp;&nbsp;{{ newProduct.questionnaire==null||newProduct.questionnaire.newScore==null?'/':newProduct.questionnaire.newScore }} </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="content mt20">
              <div> 分类：&nbsp;&nbsp;{{ newProduct.cateName }} </div>
              <div> 商品来源：&nbsp;&nbsp;{{ newProduct.source }} </div>
            </div>
          </el-col>
        </el-row>

        <div class="content " >
          <div style=" white-space: normal;"> 核心卖点描述：&nbsp;&nbsp;{{ newProduct.productDescribe }} </div>
          <div style=" white-space: normal;"> 备注：&nbsp;&nbsp;{{ newProduct.remarks }} </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="30" v-if="newProduct && newProduct.competitiveProducts " >
      <el-col :span="4">
        <div class="title">
          市面竞品资料
        </div>
        <img :src="newProduct.competitiveProducts.titleImage || require('@/assets/images/logo.png')" width="100%" >
      </el-col>
      <el-col :span="20" class="right">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="content mt20">
              <div> 市面竞品名称：&nbsp;&nbsp;{{ newProduct.competitiveProducts.name }} </div>
              <div> 分类：&nbsp;&nbsp;{{ newProduct.competitiveProducts.cateName }} </div>
              <div> 价格：&nbsp;&nbsp;{{ statusMap[newProduct.competitiveProducts.price]   }} </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="content mt20">
              <div> 商品条码：&nbsp;&nbsp;{{ newProduct.competitiveProducts.codeBar }} </div>
              <div> 品牌：&nbsp;&nbsp;{{ newProduct.competitiveProducts.brandName }} </div>
              <div>  
                <el-tooltip
                effect="dark"
                :content="competitiveScoreToolTip"
                placement="top"><span>总评分<i class="el-icon-info ml6"></i></span>
                </el-tooltip>:&nbsp;&nbsp;{{ newProduct.questionnaire.competitiveScore || '/'}} </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="content mt20">
              <div> 规格：&nbsp;&nbsp;{{ newProduct.competitiveProducts.cateName }} </div>
              <div> 产地：&nbsp;&nbsp;{{ newProduct.competitiveProducts.source }} </div>
            </div>
          </el-col>
        </el-row>

        <div class="content">
          <div style=" white-space: normal;"> 核心卖点描述：&nbsp;&nbsp;{{ newProduct.competitiveProducts.productDescribe }} </div>
          <div style=" white-space: normal;"> 备注：&nbsp;&nbsp;{{ newProduct.competitiveProducts.remarks }} </div>
        </div>
      </el-col>
    </el-row>



    <div class="mt18">
      <div class="title">
        <span>调查问卷</span>
        <span style="float:right;color:#909399;" v-if="newProduct && newProduct.questionnaire">
          <el-tooltip
            effect="dark"
            placement="top"><span> <i class="el-icon-info ml6"></i></span>
            <!-- :content="commonFieldTips" -->
            <template slot="content">
              <div style="white-space: pre-wrap">
                {{commonFieldTips}}
              </div>
            </template>
          </el-tooltip>
          </span> 
      </div>
      <div v-if="newProduct && newProduct.questionnaire">
        <el-row :gutter="30"  >
          <el-col :span="10">
            <div class="l-h28 ellipsis">
              问卷名称：{{ newProduct.questionnaire.name }}</div>
          </el-col>
          <el-col :span="3">
            <div class="l-h28 ellipsis">答卷数：{{ newProduct.questionnaire.respondents }}</div>
          </el-col>
          <el-col :span="7">
            <div class="l-h28 ellipsis" >问卷结束时间：{{ newProduct.questionnaire.endDate && $formatDate(newProduct.questionnaire.endDate ,"Y/M/D h:m") }}</div>
          </el-col>
          <el-col :span="4">
            <el-button class="ellipsis w-full" type="primary" @click="download">下载全部答案</el-button>
          </el-col>
        </el-row>
        <div>
          <!-- 评分题 -->
          <div class="mt20" v-if="newProduct && newProduct.questionnaire&& scoreList && scoreList.length>0">
            <div>评分题：</div>
            <el-table
              ref="spuTableData"
              :data="scoreList"
              style="width: 100%;margin-top:18px;"
              border
              size="mini"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            >
              <el-table-column label="序号" prop="newIndex" width="50px"></el-table-column>
              <el-table-column label="标题" prop="question" width="350px"></el-table-column>
              <el-table-column label="权重" prop="weight"></el-table-column>
              <el-table-column label="研发新品平均分" prop="newAvgScore">
                <template slot-scope="scope">
                       {{ scope.row.newAvgScore ||'/' }}
                   </template>
              </el-table-column>
              <el-table-column label="市面竞品平均分" prop="competitiveAvgScore">
                 <template slot-scope="scope">
                       {{ scope.row.competitiveAvgScore ||'/' }}
                   </template>
              </el-table-column>
              <el-table-column label="所有竞品平均分" prop="allCompetitiveAvgScore" >
                 <template slot-scope="scope">
                       {{ scope.row.allCompetitiveAvgScore ||'/' }}
                   </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 单选,多选 -->
          <div v-for="(item,idx) in list" :key="idx">
            <div class="mt20" v-if="item && item.length>0">
              <div>{{questionType[item[0].type]}}：</div>
              <el-table
                ref="spuTableData"
                :data="item"
                style="width: 100%;margin-top:18px;"
                border
                size="mini"
                :span-method="spanMethod"
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              >
                <el-table-column label="序号" prop="index" width="50px"></el-table-column>
                <el-table-column label="标题" prop="question" width="350px"></el-table-column>
                <el-table-column label="选项" prop="answer" ></el-table-column>
                <el-table-column label="人数" prop="subtotal" >
                    <template slot-scope="scope">
                       {{ scope.row.subtotal ||0 }}
                   </template>
                </el-table-column>
                <el-table-column label="占比" prop="rate" >
                  <template slot-scope="scope">
                       {{ scope.row.rate==null?'0%':scope.row.rate+'%' }}
                   </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!-- 问答题 -->
          <div class="mt20" v-if="essayList && essayList.length>0">
            <div>{{questionType[essayList[0].type]}}：</div>
            <el-table
              ref="spuTableData"
              :data="essayList"
              style="width: 100%;margin-top:18px;"
              border
              size="mini"
              :span-method="spanMethod"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            >
              <el-table-column label="序号" prop="index" width="50px"></el-table-column>
              <el-table-column label="标题" prop="question" width="350px"></el-table-column>
              <el-table-column label="回答" prop="answer" ></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="title">暂无</div>
      </div>
    </div>
  </div>
</template>

<script>
import { exportQuestionnaire as exportQuestionnaireHttp } from '@/api/excel'
import FileSaver from 'file-saver'
const  newScoreToolTip="总评分：关联问卷中所有新品评分题的加权平均分之和，加权平均分=新品评分题的平均分×权重"
const  competitiveScoreToolTip="总评分：关联问卷中所有竞品评分题的加权平均分之和，加权平均分=竞品评分题的平均分×权重"
const commonFieldTips = '人数：该选题，选中该选项的人数;' + 
                        '\r\n占比：该选题，选中该选项的人数占总人数的百分比；（总人数，指该调查问卷的答卷数）;'+
                        '\r\n研发新品平均分：该评分题的研发新品的平均分；'+
                        '\r\n市面竞品平均分：该评分题的市面竞品的平均分；'+
                        '\r\n所有竞品平均分：若评分题的题目一样，指同品类的市面竞品该题评分的平均分；（同品类指三级分类相同）'+
                        '\r\n研发新品总评分=Sum(该评分题的研发新品的平均分*该题的权重)；'+
                        '\r\n市面竞品总评分=Sum(该评分题的市面竞品的平均分*该题的权重)；'+
                        '\r\n所有竞品总评分=Sum(该评分题的所有竞品的平均分*该题的权重)；'
export default {
  name: 'NewProductDetail',
  data() {
    return {
      newScoreToolTip,
      competitiveScoreToolTip,
      commonFieldTips,
      statusMap: {
        '1': '优化中',
        '2': '储备',
        '3': '淘汰',
      },
      questionType:{
        "1" : "评分题",
        "2" : "单选题",
        "3" : "多选题",
        "4" : "问答题",
      },//题目类型
      questionnaire: null,
      scoreList:[],//评分题
      essayList:[],//问答题
      list:{
        singleList:[],
        multipleList:[]
      },
    }
  },
  props: {
    newProduct: {
      type: Object,
    }
  },
  watch: {
    newProduct: {
      immediate: true,
      handler(newVal, oldVal) {
        this.init()
      }
    },
  },
  methods:{
    init() {
      if (!this.newProduct.questionnaire) {
        return;
      }
      let questionnaire = this.newProduct.questionnaire;
      this.scoreList = questionnaire.questions
        .filter(item => item.type == 1)
        .map((v, i) => ({...v, newIndex: i+1}))
      //总评分
      this.scoreList.push({
        allCompetitiveAvgScore: questionnaire.allCompetitiveScore,
        competitiveAvgScore: questionnaire.competitiveScore, //competitiveScore
        newAvgScore: questionnaire.newScore, //newScore
        question: "总评分",
      })
      this.list.singleList = this.handleData(questionnaire.questions.filter(item => item.type == 2))
      this.list.multipleList = this.handleData(questionnaire.questions.filter(item => item.type == 3))
      this.essayList = this.handleData(questionnaire.questions.filter(item => item.type == 4))
    },
    handleData(arr) {
      console.log(arr);
      console.log('end>>>>>>>>>>>>>');
      let res = (arr || []).map(( { answers, ...q } , q_i) =>  ( 
        answers ?  answers.map((a,a_i) =>  ({
            ...q,
            index: q_i + 1,
            colspan: a_i ? 0 : 1,
            rowspan: a_i ? 0 : answers.length,
            ...a
          })
        ) : {
          ...q, 
          index: q_i + 1,
          colspan: 1,
          rowspan:  1, 
          answer: ''
        }) 
      );
      return [].concat(...res)
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      let {rowspan, colspan} = row;
      if (columnIndex === 0 || columnIndex === 1) {
        return {rowspan, colspan};
      } else {
        return {
          rowspan: 1, 
          colspan: 1
        }
      }
    },
    // 下载模版
    download(){
      this.$store.commit('SHOW_LOADING')
      exportQuestionnaireHttp(this.newProduct.questionnaire.id)
      .then(blob => {
        let fileName = this.newProduct.questionnaire.name
        FileSaver.saveAs(blob, fileName+'.xlsx')
      })
      .finally(()=>{
        this.$store.commit('SHOW_LOADING', false)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.wapper {
  margin-bottom: 10px;
}
.title {
  color: rgba(0, 0, 0, .95);
  font-size: 16px;
  margin-bottom: 15px;
}
.right {
  margin-top: 5px;
  font-size: 13px;
  color: rgba(0,0,0, 0.85);
}
.content {
  & > div {
    padding-top: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>