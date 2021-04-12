<template>
  <span>
    <el-button type="primary" :loading="loading" @click="settingRemark">设置备注</el-button>
    <el-dialog
      title="设置备注"
      :visible.sync="dialogVisible"
      custom-class="compact"
      width="500px"
      :before-close="dialogBeforeClose"
    >
      <el-form ref="f" :model="form" label-width="60px" :rules="rules">
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            placeholder="请填写标签备注/推荐原因，100字以内"
            :minlength="0"
            :maxlength="100"
            :rows="5"
            show-word-limit
            v-model="form.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import { addRemark } from '@/api/goods'

export default {
  name: 'RelationSpuSetmarkButton',
  props: {
    selectList: {
      type: Array,
      default: () => []
    },
    tagId: {
      type: String,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        remark: ''
      },
      rules: {
        remark: [
          {
            required: false,
            message: '请填写标签备注/推荐原因，100字以内',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    settingRemark() {
      if (!(Array.isArray(this.selectList) && this.selectList.length > 0)) {
        this.$message.error('请选择商品')
        return
      }
      this.dialogVisible = true
    },

    dialogBeforeClose(done) {
      this.$refs.f.resetFields()
      done()
    },
    back() {
      // 发送广播
      console.info('backbackbackback')
      this.$eventHub.$emit('addRelationSpu')
    },

    onConfirm() {
      this.$refs['f'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.form.tagId = this.tagId
        this.form.spuIds = this.selectList
        // this.form.remark=this.form.remark ||''
        this.$store.commit('SHOW_LOADING')
        addRemark(this.form)
          .then(() => {
            this.$message.success('备注设置成功')
            this.dialogVisible = false
            this.form.remark = ''
            this.back()
          })
          .finally(() => {
            this.$store.commit('SHOW_LOADING', false)
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .compact {
  .el-dialog__body {
    padding: 20px 20px 0;
  }
}
</style>