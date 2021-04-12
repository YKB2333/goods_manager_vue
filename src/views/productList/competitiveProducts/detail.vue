<template>
  <div>
    <el-row :gutter="30" v-if="competitiveProducts" >
      <el-col :span="4">
        <div class="title">
          市面竞品资料
        </div>
        <img :src="competitiveProducts.titleImage || require('@/assets/images/logo.png')" width="100%" >
      </el-col>
      <el-col :span="20" class="right">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="content mt20">
              <div> 市面竞品名称：&nbsp;&nbsp;{{ competitiveProducts.name }} </div>
              <div> 分类：&nbsp;&nbsp;{{ competitiveProducts.cateName }} </div>
              <div> 价格：&nbsp;&nbsp;{{competitiveProducts.price  }} </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="content mt20">
              <div> 商品条码：&nbsp;&nbsp;{{ competitiveProducts.codeBar }} </div>
              <div> 品牌：&nbsp;&nbsp;{{ competitiveProducts.brandName }} </div>
              <div>  
                <el-tooltip
                effect="dark"
                :content="competitiveScoreToolTip"
                placement="top"><span>总评分<i class="el-icon-info ml6"></i></span>
                </el-tooltip>: &nbsp;&nbsp;{{competitiveProducts.questionnaire==null||competitiveProducts.questionnaire.competitiveScore==null?'/': competitiveProducts.questionnaire.competitiveScore }} </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="content mt20">
              <div> 规格：&nbsp;&nbsp;{{ competitiveProducts.specs }} </div>
              <div> 产地：&nbsp;&nbsp;{{ competitiveProducts.producePlace }} </div>
            </div>
          </el-col>
        </el-row>

        <div class="content">
          <div style=" white-space: normal;"> 核心卖点描述：&nbsp;&nbsp;{{ competitiveProducts.productDescribe }} </div>
          <div style=" white-space: normal;"> 备注：&nbsp;&nbsp;{{ competitiveProducts.remarks }} </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="30" class="wapper" v-if="competitiveProducts && competitiveProducts.newProducts">
      <el-col :span="4">
        <div class="title">
          研发新品资料
        </div>
        <img :src="competitiveProducts.newProducts.titleImage || require('@/assets/images/logo.png')" width="100%" >
      </el-col>
      <el-col :span="20" class="right">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="content mt20">
              <div> 研发新品名称：&nbsp;&nbsp;{{ competitiveProducts.newProducts.name }} </div>
              <div> 品牌：&nbsp;&nbsp;{{ competitiveProducts.newProducts.brandName }} </div>
              <div> 新品状态：&nbsp;&nbsp;{{ competitiveProducts.newProducts?'':statusMap[competitiveProducts.newProducts.status]   }} </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="content mt20">
              <div> 配方编号：&nbsp;&nbsp;{{ competitiveProducts.newProducts.formulaId }} </div>
              <div> 产地：&nbsp;&nbsp;{{ competitiveProducts.newProducts.producePlace }} </div>
              <div> 
                <el-tooltip
                effect="dark"
                :content="newScoreToolTip"
                placement="top"><span>总评分<i class="el-icon-info ml6"></i></span>
                </el-tooltip>: &nbsp;&nbsp;{{ competitiveProducts.questionnaire.newScore }} </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="content mt20">
              <div> 分类：&nbsp;&nbsp;{{ competitiveProducts.newProducts.cateName }} </div>
              <div> 商品来源：&nbsp;&nbsp;{{ competitiveProducts.newProducts.source }} </div>
            </div>
          </el-col>
        </el-row>

        <div class="content">
          <div style=" white-space: normal;"> 核心卖点描述：&nbsp;&nbsp;{{ competitiveProducts.newProducts.productDescribe }} </div>
          <div style=" white-space: normal;"> 备注：&nbsp;&nbsp;{{ competitiveProducts.newProducts.remarks }} </div>
        </div>
      </el-col>
    </el-row>
    <div class="mt18">
      <div class="title">
        <span>调查问卷</span>
        <span style="float:right;color:#909399;" v-if="competitiveProducts && competitiveProducts.questionnaire">
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
      <div v-if="competitiveProducts && competitiveProducts.questionnaire">
        <el-row :gutter="30"  >
          <el-col :span="10">
            <div class="l-h28 ellipsis">
              问卷名称：{{ competitiveProducts.questionnaire.name }}</div>
          </el-col>
          <el-col :span="3">
            <div class="l-h28 ellipsis">答卷数：{{ competitiveProducts.questionnaire.respondents }}</div>
          </el-col>
          <el-col :span="7">
            <div class="l-h28 ellipsis" >问卷结束时间：{{ competitiveProducts.questionnaire.endDate && $formatDate(competitiveProducts.questionnaire.endDate,"Y/M/D h:m") }}</div>
          </el-col>
          <el-col :span="4">
            <el-button class="ellipsis w-full" type="primary" @click="download">下载全部答案</el-button>
          </el-col>
        </el-row>
        <div>
          <!-- 评分题 -->
          <div class="mt20" v-if="scoreList && scoreList.length>0">
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
  name: 'competitiveProductsDetail',
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
      singleSpanList: [],//单选框合并队列
      multipleSpanList: [],//多选框合并队列
      essaySpanList: [],//问答题合并队列
      list:{
        singleList:[],
        multipleList:[]
      }
    }
  },
  props: {
    competitiveProducts: {
      type: Object,
    }
  },
  mounted(){
      console.log("this.scoreList",this.scoreList)
  },
  watch: {
    competitiveProducts: {
      immediate: true,
      handler(newVal, oldVal) {
        this.init()
      }
    },
  },
  methods:{
    init(){
      if(this.competitiveProducts.questionnaire){
        let questionnaire = this.competitiveProducts.questionnaire
        let n = 1;
        this.scoreList = questionnaire.questions.filter(item => item.type == 1)
        this.scoreList.forEach(item=>{
          item.newIndex=n++;
        })
        //总评分
        this.scoreList.push({
          allCompetitiveAvgScore: questionnaire.allCompetitiveScore,
          competitiveAvgScore: questionnaire.competitiveScore, //competitiveScore
          newAvgScore: questionnaire.newScore, //newScore
          question: "总评分",
        })
        let newSingleList = questionnaire.questions.filter(item => item.type == 2)
        let newMultipleList = questionnaire.questions.filter(item => item.type == 3)
        let newEssayList = questionnaire.questions.filter(item => item.type == 4)
        this.list.singleList = this.formatList(newSingleList)
        this.list.multipleList = this.formatList(newMultipleList)
        this.essayList = this.formatList(newEssayList)
        this.singleSpanList = this.compute(this.list.singleList)
        this.multipleSpanList = this.compute(this.list.multipleList)
        this.essaySpanList = this.compute(this.essayList)
      }
    },
    formatList(list){
      let newList = []
      list.forEach((n,i)=>{
        if(n.answers){
          console.log(i)
          n.answers.forEach(m=>{
            newList.push({...m,...n,index:i+1})
          })
        }else{
          newList.push({answer:'/',...n,index:i+1})
        }
      })
      return newList
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      let spanList;
      if(row.type == 2){//单选
        spanList = this.singleSpanList
      }else if(row.type == 3){
        spanList = this.multipleSpanList
      }else if(row.type == 4){
        spanList = this.essaySpanList
      }
      if (columnIndex === 0 || columnIndex === 1) { // 第一列、第二列和第三列
        if (spanList[rowIndex] === 0) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          return {
            rowspan: spanList[rowIndex],
            colspan: 1
          }
        }
      }
    },
    //计算合并队列
    compute(list){
      console.log(list)
      let contactDot
      if(list&&list.length>0){
        contactDot = list[0].question
      }else{
        return;
      }
      let numberNow = 0
      let spanArr = []
      let data = list
      data.forEach((item, index) => { // 遍历数据记录需要合并的行数保存在spanArr中
        if (item.question === contactDot) { // 相同
          numberNow += 1
        } else {
          spanArr.push(numberNow)
          contactDot = item.question// 重新赋值标识
          while (numberNow > 1) { // 赋值0
            spanArr.push(0)
            numberNow -= 1
          }
        }
        if (index === data.length - 1) { // 到最后一个了，把没有push的项处理完
          spanArr.push(numberNow)
          contactDot = item.question
          while (numberNow > 1) {
            spanArr.push(0)
            numberNow -= 1
          }
        }
      })
      return spanArr
    },
    // 下载模版
    download(){
      this.$store.commit('SHOW_LOADING')
      exportQuestionnaireHttp(this.competitiveProducts.questionnaire.id)
      .then(blob => {
        // console.log("进去了")
        // console.info(blob)
        let fileName = this.competitiveProducts.questionnaire.name
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