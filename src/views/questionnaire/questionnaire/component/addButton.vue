<template>
  <span>
    <el-button  type="primary"  @click="dialogVisible = true" >新增</el-button>

    <el-dialog
      title="新增问卷"
      @close="close"
      width="600px"
      :visible.sync="dialogVisible">
      <div>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="分类" prop="cateCode">
            <template slot="label">
              <span>
                分类
                <el-tooltip effect="dark" content="试用分类" placement="top">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </span>
            </template>
            <new-products-category-select v-model="form.cateCode" 
              @change="onCateChange"
              placeholder="请选择" 
              :checkStrictly="false">
            </new-products-category-select>
          </el-form-item>
          <el-form-item label="问卷模板" prop="templateId" v-if="form.cateCode" >
            <el-select v-model="form.templateId" placeholder="请选择问卷模板" no-data-text="暂无模板，请先联系有权限的管理人员添加问卷模板" clearable filterable :loading="loading">
              <el-option v-for="o in templateList" :key="o.id" :label="o.name" :value="o.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="onConfirm" :disabled="disabled" >确 定</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import NewProductsCategorySelect from '@/views/productList/developProduct/component/NewProductsCategorySelect'


import {getTemplateByCateCode} from '@/api/questionnaire'
export default {
  name: 'addButton',
  components: { NewProductsCategorySelect, },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      templateList: [],
      form: {
        templateId: '',
        cateCode: ''
      },
      rules: {
        templateId: [ { required: true, message: '请选择问卷模板', trigger: 'change' },],
        cateCode: [ { required: true, message: '请选择分类', trigger: 'change' }, ],
      }
    }
  },
  computed: {
    disabled() {
      let iscanSave = !Array.isArray(this.templateList) || this.templateList.length === 0;
      return iscanSave;
    }
  },

  methods: {
    getTemplate() {
      this.loading = true;
      getTemplateByCateCode(this.form.cateCode)
        .then(res => {
          this.templateList = res || [];
          this.form.templateId = '';
          if (Array.isArray(this.templateList) && this.templateList.length === 1) {
            this.form.templateId = this.templateList[0].id;
          }

        })
        .finally(() => {
          this.loading = false;
        })
    },
    onCateChange(e) {
      if (e) {
        this.getTemplate()
      } else {
        this.templateList = [];
      }
    },
    onConfirm() {
      this.$refs.form.validate()
        .then(res => {
          this.$router.push({
            path: '/questionnaire/questionnaire/edit',
            query: this.form
          })
          this.close();
        })
    },
    close() {
      this.dialogVisible = false;
      this.form.templateId = '';
      this.form.cateCode = '';
    }
  }

}
</script>

<style lang="scss" scoped>

</style>