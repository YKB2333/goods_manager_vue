<template>
  <span>
    <!-- id批量查询按钮 -->
    <slot >
      <el-button size="mini" icon="el-icon-more" @click="showDialog=true"></el-button>
    </slot>
    <my-dialog
      v-model="showDialog"
      :close-on-click-modal="false"
      :title="dialogTitle"
      :width="dialogWidth"
      max-height
      @close="closeDialog"
    >
        <div>
          <el-input v-model="value"   type="textarea"  :rows="8"  placeholder="请输入数据进行查询" ></el-input>
        </div>
        <div style="margin-top:5px;margin-bottom:10px">批量搜索的数据支持英文“,” 或换行隔开，最多查询{{canSearchCount}}条数据</div>
        <div style="margin-left:390px">
          <el-button type="primary"  @click="onConfirm">确定</el-button>
         </div>
    </my-dialog>
  </span>
</template>

<script>
export default {
  name: 'idBatchQuery',
  data() {
    return {
      showDialog: false,
    }
  },
  computed: {
    value: {
      get() {
        return this.v;
      },
      set(v) {
        this.$emit('onValueChange', v)
      }
    }
  },
  model: {
    prop: 'v',
    event: 'onValueChange'
  },
  props: {
    v: '',
    dialogWidth: {
      type: String,
      default: '500px'
    },
    dialogTitle: {
      type: String,
      default: '批量搜索'
    },
    canSearchCount: {
      type: Number,
      default: 500
    }
  },
  methods: {
    onValueChange(v) {
      this.$emit('onValueChange', v)
    },
    onConfirm() {
      this.showDialog=false;
    },
    closeDialog(){
      this.$emit('onConfirm', this.value)
      this.showDialog=false
    },
  }
}
</script>

<style>

</style>