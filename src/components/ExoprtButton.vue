<template>
  <span @click="exportData">
    <slot>
      <el-button type="primary">导出</el-button>
    </slot>
  </span>
</template>

<script>
import { formatDate } from '@/utils'
import FileSaver from 'file-saver'

export default {
  name: 'ExoprtButton',

  props: {
    downloadTotal: {
      type: Number,
      default: 0
    },

    confirmText: {
      type: String,
      default: ''
    },

    req: {
      type: Function,
      require: true
    },

    params: null,

    fileName: {
      type: String,
      default: '导出文件'
    }
  },

  computed: {
    confirmTitle() {
      return this.confirmText
        ? this.confirmText
        : `当前待下载数量: ${this.downloadTotal},是否确认下载`
    }
  },

  methods: {
    exportData() {
      if (!this.downloadTotal) {
        this.$message.error('当前导出的数据为空')
        return
      }
      this.$confirm(this.confirmTitle, {
        type: 'warning'
      }).then(() => {
        this.doExport()
      })
    },

    doExport() {
      if (!this.req) {
        console.error('没有请求')
        return
      }
      this.req(this.params).then((blob) => {
        let fileName = `${this.fileName}${formatDate(
          new Date().getTime(),
          'Y-M-D h:m'
        )}`
        FileSaver.saveAs(blob, fileName + '.xlsx')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>