<template>
  <div class="upload-image-component" :class="{ 'hide': hideUploadIcon }">
    <el-upload ref="upload"
      :headers="headers"
      :action="`${baseURL}${url}`"
      list-type="picture-card"
      :multiple="false"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="exitsFiles"
      :before-upload="beforeUpload"
      :httpRequest="uploadRequest"
    >
      <i class="el-icon-plus"  />
      <div slot="tip" >{{ tip }}</div>
    </el-upload>
  </div>
</template>

<script>
import { baseURL, headersTokenKey } from '@/config'

export default {
  name: 'UploadImage',
  components: {},
  props: {
    url: { // 上传地址
      type: String,
      required: true
    },
    tip: { // 提示说明文字
      type: String,
      default: ''
    },
    value: { // 双向绑定的图片URL
      type: String,
      default: ''
    },
    maxSize: {
      type: Number,
      default: 1024 *1024
    },
    isAutoFit: { // 是否自动放缩图片，如果是将放缩到maxSize以下
      type: Boolean,
      default: false,
    }

  },
  data() {
    return {
      baseURL: baseURL,
      // 隐藏+号
      hideUploadIcon: false
    }
  },
  computed: {
    headers() { // 请求头部里添加token
      const obj = {}
      obj[headersTokenKey] = this.$store.getters.token
      return obj
    },
    exitsFiles() { // 显示已有的图片
      if (this.value === '' || this.value === null) {
        this.hideUploadIcon = false
        return []
      } else {
        this.hideUploadIcon = true
        return [{name: 'tempName', url: this.value}]
      }
    },
    maxSizeErrorMsg() {
      if (this.maxSize < 1024) {
        return this.maxSize + 'B'
      }
      let num = this.maxSize / 1024;
      if (num < 1024) {
        return Math.floor(num) + 'KB'
      }
      num = num /1024;
      return Math.floor(num) + 'MB'
    }
  },
  created() {
  },
  mounted() {},
  methods: {
    onSuccess(response, file, fileList) { // 上传成功回调
      // console.log('onSuccess res=>', response)
      // console.log('onSuccess file=>', file)
      // console.log('onSuccess fileList=>', fileList)
      this.hideUploadIcon = true
      this.$emit('input', response)
      // this.$parent && this.$parent.$emit("el.form.blur")
    },
    onError(err, file, fileList) {
      this.clear()
    },
    onRemove(file, fileList) { // 删除回调
//       console.log('onRemove file=>', file)
//       console.log('onRemove fileList=>', fileList)
      this.hideUploadIcon = false
      this.$emit('input', '')
      // this.$parent && this.$parent.$emit("el.form.blur")
    },
    clear() {
      this.$refs['upload'].clearFiles()
      this.$emit('input', '')
      // this.$parent && this.$parent.$emit("el.form.blur")
    },
    // 上传前校验格式和大小
    beforeUpload(file) {
      let type = ['image/png', 'image/jpeg', 'image/jpg']
      const isType = type.includes(file.type)
      const isSize = file.size < this.maxSize
      if (!isType) {
        this.$message.error('图片格式只能是png，jpg， jpeg')
      }
      if (this.isAutoFit) { // 放缩属性将不会对尺寸进行校验
        return isType;
      }
      if (!isSize) {
        this.$message.error(`图片大小不能超过${this.maxSizeErrorMsg}!`)
      }
      return isType && isSize
    },
    async uploadRequest(data) {
      let f = data.file;
      let size = f.size;
      if (this.isAutoFit) {
        while (size > this.maxSize) {
          f = await this.autoFit(f);
          size = f.size;
        }
      }
      console.log('end>>>>>>>');
      console.log(size);
      var formData = new FormData()
      formData.append("file", f)

      return new Promise((resolve, reject) => {
        this.$post(data.action, formData).then((res)=>{
          resolve(res)
        }).catch((err)=>{
          reject()
        })
      })
    },
    async autoFit(f) {
      return new Promise((res, reg) => {
        let vm = this
        let reader = new FileReader();
        let {size, type, name} = f;
        reader.readAsDataURL(f)
        reader.onload  = function(e) {
          let image = new Image() //新建一个img标签（还没嵌入DOM节点)
          image.src = e.target.result;
          image.onload = function() {
            let canvas = document.createElement('canvas'), // 新建canvas
                context = canvas.getContext('2d'),
                imageWidth = image.width *  0.5,    //压缩后图片的大小
                imageHeight = image.height * 0.5,
                data = '';
            canvas.width = imageWidth
            canvas.height = imageHeight
            context.drawImage(image, 0, 0, imageWidth, imageHeight)
            data = canvas.toDataURL(type) // 输出压缩后的base64
            let arr = data.split(','), mime = arr[0].match(/:(.*?);/)[1], // 转成blob
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            let files = new window.File([new Blob([u8arr], {type: mime})], name, {type}) // 转成file
            res(files)
          }
        }
        
      })
    }
  },
  watch: {

  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
@mixin uploadSize(){
  width: 100px !important;
  height: 100px !important;
}
.upload-image-component{
  line-height: 25px;
  &.hide{
    .el-upload--picture-card{
      display: none;
    }
  }
  .el-upload--picture-card{
    @include uploadSize();
    line-height: 106px;
  }
  .el-upload-list__item{
    @include uploadSize();
  }
  .el-upload-list--picture-card .el-progress {
    @include uploadSize();
  }
  .el-progress-circle{
    @include uploadSize();
  }
}
</style>
