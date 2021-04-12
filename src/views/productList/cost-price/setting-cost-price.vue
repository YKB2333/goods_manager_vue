<template>
  <span>
    <el-button type="primary"   @click="settingCost" >设置成本价</el-button>
    <el-dialog
      title="设置成本价"
      :visible.sync="dialogVisible"
      @close="close"
      close-on-press-escape
      width="500px"
      close-on-click-modal>
      <el-form label-width="150px" :model="params" ref="f" :rules="formRules" size="small" style="margin-right:100px">
        <el-form-item  prop="costPrice" label="成本价">
          <el-input
            v-model="params.costPrice"
            style="min"
            min="0"
            type="number"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close" size="small" >取 消</el-button>
        <el-button type="primary" @click="onConfirm" size="small" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import {bachUpdateSkuCostPrice} from '@/api/goods' 

//  设置成本价按钮
export default {
  name: 'settingCostPrice',
  data() {
  
    return {
      dialogVisible: false,
      loading: false,
      formRules: {
        costPrice: [
          {  required: true, message: '请输入成本价', trigger: 'blur' },
          {  pattern: /^0*[1-9][0-9]*(\.[0-9]{1,2})?$|^0+\.[0-9]?[1-9]0?$/, message: "请输入成本价(小数点后最多两位)", trigger: "change" },
        ]
      },
      params: {
        costPrice: null
      }
    }
  },
  props: {
    selectList: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    settingCost() { // 设置成本价
      if (!Array.isArray(this.selectList) || this.selectList.length < 1) {
        this.$message.warning('未选中数据')
        return;
      }
      this.dialogVisible = true;
    },
    close() { // 设置成本价弹窗关闭
      this.$refs['f'].resetFields();
      this.dialogVisible = false;
    },
    onConfirm() {
      this.$refs['f'].validate((valid) => {
        console.log('valid', valid)
        if(valid){
          this.$confirm(`确认设置成本价吗?`, {
            type: 'warning'
          }).then(() => {
            this.loading = true
            let pam = this.selectList.map(skuId => ({skuId, costPrice: this.params.costPrice}))
            bachUpdateSkuCostPrice(pam)
              .then(res => {
                this.$message.success(`批量设置成本价成功`);
                this.$emit('afterSuccess', res)
                this.close();
              })
              .finally(() => {
                this.loading = false;
              })
            // dosomething
          })
        }
      })

    }
  }
}
</script>

<style>

</style>