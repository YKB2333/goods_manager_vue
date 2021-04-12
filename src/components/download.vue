<template>
  <el-button 
    :type="btnType" 
    :icon="showIcon && btnType !== 'text' ? 'el-icon-download' : ''" 
    :size="btnSize" 
    :plain="plain && btnType !== 'text'"
    :loading="loading"
    @click="onClick">
    下载
  </el-button>
</template>

<script>
import FileSaver from 'file-saver'
import { downloadAtta } from '@/api/attachment'

export default {
  name: 'Download',
  components: {},
  // props: ['attaId', 'fileName'],
  props: {
    attaId: {
      type: Number,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    btnType: {
      type: String,
      default: 'primary'
    },
    btnSize: {
      type: String,
      default: 'mini'
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    plain: {
      type: Boolean,
      default: true
    },
    isProtect:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {},
  created() {},
  methods: {
    // 点击下载附件
    onClick() {
      this.loading = true
      let api = this.isProtect ? '/attachment/protectDownload/' : '/attachment/download/'
      downloadAtta(api+`${this.attaId}`)
      .then(blob => {
        console.log(blob)
        FileSaver.saveAs(blob, this.fileName)
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
