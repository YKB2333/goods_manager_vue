<template>
  <div>
    <el-form :model="f" ref="answers" >
      <el-card :body-style="{padding: '0px 20px' }" >
        <div slot="header" class="header" >
          <span class="h_t">
            <el-form-item :rules="rules.question" label="【评分题】问题题目" prop="question"  >
              <el-input style="max-width: 400px" v-model="f.question" placeholder="请输入（20字以内）"></el-input>
            </el-form-item>
          </span>
          <span style="width:30%">
            <el-form-item :rules="rules.weight" label="权重" prop="weight"  >
              <el-input-number v-model="f.weight"  :min="0" :max="1" :step="0.25" ></el-input-number>
            </el-form-item>
          </span>
          <div class="extar">
            <el-button v-if="isShowUp" type="text" @click="up">上移</el-button>
            <el-button v-if="isShowDown" type="text" @click="down">下移</el-button>
            <el-button  type="text" @click="remove">删除</el-button>
            <span class="mlr10 coll" @click="isOpened = !isOpened" >
              <i class="el-icon-arrow-down" v-if="!isOpened"></i>
              <i class="el-icon-arrow-up" v-if="isOpened"></i>
            </span>
          </div>
        </div>
       
        <div class="body" v-show="isOpened">
          <el-row :gutter="20" style="margin: 20px 0 ">
            <el-col :span="22" style="text-align: left">
              <el-form-item label="问题备注"   >
              <el-input  type="textarea" :rows="2" style="width: 80%" v-model="f.remark" placeholder="请输入（100字以内）" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin: 20px 0 ">
            <el-col :span="8"  >选项文字</el-col>
            <el-col :span="6" style="text-align: center">分值</el-col>
            <el-col :span="4" style="text-align: right" >上移</el-col>
            <el-col :span="4" style="text-align: left"  >下移</el-col>
          </el-row>
          <el-row class="answers_form" :gutter="20" v-for="(item, index) in f.answers" :key="index">
            <el-col :span="6"  >
              <el-form-item :rules="answersRule.answer" :prop="`answers[${index}].answer`">
                <el-input v-model="item.answer" placeholder="请输入评分描述（6个字以内）"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="answer_opt">
              <i class="el-icon-remove-outline" @click="removeItem(index)" ></i>
              <i class="el-icon-circle-plus-outline" @click="addItem(index)"></i>
            </el-col>
            <el-col :span="6" style="text-align: center">
              <el-form-item :rules="answersRule.score" :prop="`answers[${index}].score`">
                <el-input-number v-model="item.score" :min="0" :max="100" :precision="0" placeholder="请输入整数分值"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="text-align: right"  > 
              <span class="answer_opt"  @click="swap(index-1, index)"><i class="el-icon-top"></i></span>
              <div v-if="index === 0"><br></div>
            </el-col>
            <el-col :span="4" style="text-align: left"   > 
              <span class="answer_opt" @click="swap(index, index+1)" >
                <i class="el-icon-bottom"  ></i>
              </span>
            </el-col>
          </el-row>
        </div>
      </el-card>
      
    </el-form>
  </div>
</template>

<script>
export default {
  name:'ScoringQuestion',
  props: {
    isShowUp: {
      type: Boolean,
      default: true,
    },
    isShowDown:  {
      type: Boolean,
      default: true,
    },
    value: {
      type: Object,
      default: () => ({ })
    }
  },
  computed: {
    f: {
      get() {
        return this.value;
      },
      set(v) {
        console.log('setting');
      }
    }
  },
  watch: {
    f: {
      handler: function(v){
        if (!this.f.modify) {
          this.f.modify = true;
        }
        this.$emit('input', v)
      },
      deep: true
    }
  },
  data() {
    var validateScore = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error('分值不能小于0'));
      } 
      if (value > 100) {
        callback(new Error('最高分值只能为10或者100'));
      } 
      let isMax = this.f.answers.every(v => v.score <= value);
      if (isMax) {
        if (value !== 10 && value !== 100) {
          callback(new Error('最高分值只能为10或者100'));
        }
        this.f.answers.forEach((v, i) => {
          if (v.score !== value) {
            this.$refs.answers.clearValidate(`answers[${i}].score`)
          }
        })
      }
        callback()
    };
    return {
      isOpened: true,
      answersRule: {
        answer: [
          { max: 6, message: "选项文字不能超过6个字", trigger: ["change", 'blur'] }, 
          { required: true, message: "请输入选项文字", trigger: "blur" },
        ],
      // 
        score: [ {validator: validateScore, trigger: ["change", 'blur']  }, { required: true, message: "请输入分值", trigger: "blur" }]
      },
      rules: {
        weight: [{ required: true, message: "请输入权重", trigger: "blur" }],
        question: [
          { required: true, message: "请输入问题题目", trigger: "blur" },
          { max: 20,  message: "问题题目不能超过20个字", trigger: ["change", 'blur'] }
        ]
      }
    }
  },
  methods: {
    // #region 外部操作
    remove() {
      this.$emit('remove', this.f)
    },
    down() {
      this.$emit('down', this.f)
    },
    up() {
      this.$emit('up', this.f)
    },
    save() {
       return this.$refs.answers.validate()
    },
    setOrderLevel(orderNum) {
      this.f.modify = true;
      this.f.orderLevel = orderNum;
    },
    // #endregion
    // #region answers
    swap(index1, index2) { // 交换数组顺序
      if (index1 < 0 || index2 < 0 ) {
        this.$message.error('该项无法上移');
        return ;
      }
      let {answers} = this.f;
      if (index1 >= answers.length || index2 >= answers.length ) {
        this.$message.error('该项无法下移');
        return ;
      }
      this.f.modify = true;
      answers[index1] = answers.splice(index2, 1, answers[index1])[0];
      answers[index1].orderLevel = index1;
      answers[index2].orderLevel = index2;
      this.$message.success('移动成功！')
      this.$refs.answers.validate();
      return answers;
    },
    addItem(index) {
      if (this.f.answers.length === 11) {
        this.$message.error('最多只能添加11个选项!');
        return ;
      }
      this.f.modify = true;
      this.f.answers.splice(index + 1, 0 , {answer: '0', score: 0, orderLevel: this.f.answers.length});
      this.f.answers = this.f.answers.map((v, i) => ({ ...v, orderLevel: i }))
    },
    removeItem(index) {
      if (this.f.answers.length === 1) {
        this.$message.error('必须保留1个选项');
        return ;
      }
      this.f.modify = true;
      this.f.answers = this.f.answers.filter((v,i) => i !== index).map((V, orderLevel) => ({...V, orderLevel}))
    }
    // #endregion
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-card__header {
  padding: 18px 10px 0;
  .coll {
    cursor: pointer;
  }
}
.header {
  display: flex;
  .h_t {
    width: 100%
  }
  .extar {
    flex-shrink: 0
  }
}
.answers_form {
  .answer_opt {
    font-size: 23px;
    color: rgba(0,0,0,.85);
    i{
      cursor: pointer;
    }
    i+i{
      margin-left: 8px;
    }
  }
}
.question_remark{
  margin-left: 80px;
}

</style>