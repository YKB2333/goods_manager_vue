<template>
  <div>
    <el-form :model="f" ref="answers" >
      <el-card :body-style="{padding: '0px 20px' }" >
        <div slot="header" class="header" >
          <span class="h_t">
            <el-form-item :rules="rules.question" label="【问答题】问题题目" prop="question"  >
              <el-input style="max-width: 400px" v-model="f.question" placeholder="请输入（20字以内）"></el-input>
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
          </div>
      </el-card>
      
    </el-form>
  </div>
</template>

<script>
export default {
  name:'SingleChoice',
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
    return {
      isOpened: true,
      rules: {
        question: [
          { required: true, message: "请输入问题题目", trigger: "blur" },
          {max: 20,  message: "问题题目不能超过20个字", trigger: ["change", 'blur'] }
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

</style>