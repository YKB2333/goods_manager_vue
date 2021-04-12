<template>
  <span>
    <el-button type="primary" @click="showDialog" >编辑</el-button>
    <el-dialog
      title="编辑问卷"
      :visible.sync="dialogVisible"
      custom-class="compact"
      @close="close"
      width="550px">
      <div v-loading="loading" >
        <el-form ref="form" :model="form" label-width="130px" :rules="rules">
          <el-form-item label="分类" prop="cateName">
            {{ form.cateName }}
          </el-form-item>
          <el-form-item label="问卷名称" prop="name">
            <el-input v-model="form.name" ></el-input>
          </el-form-item>
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
          <el-form-item label="关联研发新品" >
            {{ form.newProducts && form.newProducts.name }}
          </el-form-item>
          <el-form-item label="关联市面竞品" >
            {{ form.competitiveProducts && form.competitiveProducts.name }}
          </el-form-item>
          <el-form-item label="问卷说明" prop="remarks">
            <el-input type="textarea" v-model="form.remarks"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="save">保存问卷</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import {getQuestionnaireById , updateQuestionnaire } from '@/api/questionnaire'
export default {
  name: 'editButton',
  props: {
    list: {
      type: Array,
      default: () => ([])
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
      dialogVisible: false,
      loading: false,
      form: {
        cateName: '',
        name: '',
        endDate: '',
        remarks: ''
      },
      rules: {
        cateName: [ {required: true, message:'请输入', trigger: 'blur'} ],
        name: [ {required: true, message:'请输入问卷名称', trigger: 'blur'}, {max: 30, message:'最大长度为30', trigger: ["change", 'blur']} ],
        endDate: [{validator: validateendDate, trigger: 'blur' }],
        remarks: [{  max: 100, message: '长度在100个字符以内', trigger: ["change", 'blur'] }]
      }
    }
  },
  methods: {
    getData() {
      this.loading = true;
      getQuestionnaireById(this.list[0]) 
        .then(res => this.form = res)
        .finally(() => this.loading = false)
    },
    showDialog() {
      if (!Array.isArray(this.list) || this.list.length === 0) {
        this.$message.error('未选中数据进行操作！');
        return;
      }
      if (!Array.isArray(this.list) || this.list.length !== 1) {
        this.$message.error('只能选择一条数据进行操作!')
        return ;
      }
      this.getData();
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
      this.form = {}
    },
    onEndDateChange(e) {
      console.log(e);
      let date = new Date(e);
      if ( !date.getMinutes() && !date.getSeconds() ) {
        return;
      }
      this.form.endDate = date.setMinutes(0,0,0)
    },
    save() {
      this.$refs.form.validate()
        .then(success => {
          updateQuestionnaire(this.form)
            .then(res => {
              this.$message.success('修改问卷成功！');
              this.$emit('after-success', true);
              this.close();
            })
        })
    }
  },
  
}
</script>

<style lang="scss" scoped>
/deep/ .compact {
  .el-dialog__body {
    padding: 10px 24px 0;
  }
}
</style>