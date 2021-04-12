<template>
  <span>
    <el-dropdown @command="onItemClick" >
      <el-button type="primary">批量设置<i class="el-icon-arrow-down el-icon--right"></i></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="status" v-permission-button="'batch_setting_status'" >新品状态</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      title="批量设置"
      :visible.sync="isShow"
      custom-class="compact"
      width="500px"
      destroy-on-close>
      <div>
        <el-form :model="form" ref="f" label-width="100px" label-position="left">
          <el-form-item label="新品状态" prop="status" >
            <el-radio-group v-model="form.status">
              <el-radio label="1">优化中</el-radio>
              <el-radio label="2">储备</el-radio>
              <el-radio label="3">淘汰</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import {batchUpdateNewProductStatus} from '@/api/goods';

export default {
  name: 'BatchSetting',
  data() {
    return {
      isShow: false,
      loading: false,
      form: {
        status: '1'
      }
    }
  },
  props: {
    selectList : {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    onItemClick(e) {
      if (!Array.isArray(this.selectList) || this.selectList.length === 0 ) {
        this.$message.error('未选中数据进行操作！')
        return ;
      }
      this.isShow = true;
    },
    beforeClose() {
      this.$refs.f.resetFields();
    },
    save() {
      const pam = {
        ids: this.selectList,
        status: this.form.status
      }
      this.loading = true;
      batchUpdateNewProductStatus(pam)
        .then(res => {
          this.$message.success('批量设置成功！');
          this.$emit('afterSuccess', res);
          this.isShow = false;
        })
        .finally(() => {
          this.loading = false;

        })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .compact {
  & > .el-dialog__body {
    padding: 20px 0 0 100px;
    .el-radio-group {
      &>label {
        display: block;
        padding-top: 8px;
      }
      label+label{
        padding-top: 14px;
      }
    }
  }
}


</style>