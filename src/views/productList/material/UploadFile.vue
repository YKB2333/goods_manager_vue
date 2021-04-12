<template>
  <div>
    <el-upload
      ref="upload"
      :action="action"
      :list-type="fileType === '1' ? 'picture-card': 'picture-card'"
      :multiple="multiple"
      :limit="limit"
      :accept="accept"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :http-request="handleHttpRequest"
      :before-upload="handleBeforeUpload"
      :file-list="attaList"
      :on-exceed="handleExceed">
        <template>
          <i v-if="disabledUpload" class="el-icon-circle-close"></i>
          <i v-else class="el-icon-plus"></i>
        </template>
        <!-- 视频链接 -->
        <div slot="tip" v-if="fileType === '1' && value.length > 0">
          <el-link 
            :href="value.length > 0 ? value[0].attaUrl : ''"
            target="_blank" 
            type="primary"
          >
            {{ value.length > 0 ? value[0].fileName : '' }}
          </el-link>
          <el-tag size="small" @click="onDeleteVideo" class="ml10 pointer">删除</el-tag>
        </div>
    </el-upload>
    <el-button v-if="uploadLoaing" :loading="uploadLoaing" size="mini"  type="primary">上传中</el-button>
  </div>
</template>

<script>
import axios from '@/utils/request'

export default {
  name: 'UploadFile',
  props: {
    action: { // 文件上传地址
      required: true
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    limit: { // 上传文件个数
      type: Number
    },
    value: { // 双向绑定值，选返回一个数组（数组内对象为上传成功后返回的result对象）
      type: [Array]
    },
    size: { // 文件大小限制，单位M，默认2M
      type: Number,
      default: 2,
    },
    fileType: {
      type: String,
      default: '0', // 0图片1视频
    },
    isShowPlus: { // 是否显示 添加
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      attaList: [],
      uploadLoaing: false,
      uploadSuccessCount: 0,
      videoTypes: ['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov', 'video/3gp', 'video/mkv', 'video/mod'],
      imgTypes: ['image/png', 'image/jpeg', 'image/jpg']
    }
  },
  computed: {
    disabledUpload() {
      if (this.disabled) return true
      if (this.multiple) {
        return this.value.length >= this.limit
      } else {
        if (this.value.length > 0) return true
      }
      return false
    },
    accept() {
      if (this.fileType === '0') {
        return this.imgTypes.join(',')
      }
      if (this.fileType === '1') {
        return this.videoTypes.join(',')
      }
    }
  },
  mounted() {
    setTimeout(() => {
      let arr = []
      let files = _.cloneDeep(this.value)
      files.forEach(item => {
        arr.push({
          name: item.fileName,
          url: item.attaUrl
        })
      })
      this.attaList = arr
      // console.log('mounted', this.attaList)
      this.$nextTick(() => {
        if (this.fileType === '1' && this.attaList.length) {
          this.insertVideo(this.attaList[0].url)
        }
      })
    }, 300)
  },
  methods: {
    // 删除
    handleRemove(file) {
      console.log('删除', file)
      if (this.multiple) {
        let delIndex = -1
        if (file.response) {
          delIndex = this.value.findIndex(ele => ele.attaUrl === file.response.url)
        } else {
          delIndex = this.value.findIndex(ele => ele.attaUrl === file.url)
        }
        let data = _.cloneDeep(this.value)
        data.splice(delIndex, 1)
        this.$emit('input', data)
      } else {
        this.$emit('input', [])
      }
    },
    // 上传成功
    handleSuccess(res, file, fileList) {
      console.log('上传成功', res, file, fileList)
      console.log(this.value)
      let result = []
      if (this.multiple) {
        result = [...this.value, res]
      } else {
        result.push(res)
      }
      if (this.fileType === '1') {
        this.insertVideo(res.url)
      }
      console.log('result', result)
      this.$emit('input', result)
    },
    // 自定义上传行为
    handleHttpRequest(data) {
      // console.log(data)
      var formData = new FormData()
      formData.append('file', data.file)
      return new Promise((resolve, reject) => {
        this.uploadLoaing = true
        axios.post(data.action, formData).then(res => {
          resolve(res)
        }).catch(error=>{
          reject(error)
        }).finally(() => {
          this.uploadLoaing = false
        })
      })
    },
    // 文件超出个数限制时
    handleExceed(files, fileList) {
      // console.log('文件超出个数限制时', files, fileList)
      this.$message.warning(`最多只能选择${this.limit}个文件！`)
    },
    // 上传前校验
    handleBeforeUpload(file) {
      console.log('上传前校验', file)
      // let isSize = file.size / 1024 / 1024 < this.size
      // if (!isSize) {
      //   this.$message.error(`文件大小不能超过${this.size}MB!`)
      // }
      let isType = true
      if (this.fileType === '0') {
        let isType = this.imgTypes.includes(file.type)
        if (!isType) {
          this.$message.error('图片格式不正确')
        }
      }
      if (this.fileType === '1') {
        let isType = this.videoTypes.includes(file.type)
        if (!isType) {
          this.$message.error('视频格式不正确')
        }
      }
      // return isType && isSize
      return isType
    },
    // 插入视频预览图
    insertVideo(src) {
      let lengths = this.$refs['upload'].$children[0].$el.children.length
      let liImg = this.$refs['upload'].$children[0].$el.children
      liImg[lengths - 1].children[0].remove
      let video = document.createElement('video')
      video.src = src
      video.className = 'el-upload-list__item-thumbnail'
      video.style.objectFit = 'cover'
      liImg[lengths - 1].insertBefore(video, liImg[lengths - 1].children[0])
      liImg[lengths - 1].parentNode
      // <span class="el-upload-list__item-actions">
      //       <span class="el-upload-list__item-delete" @click="handleRemove(file)">
      //         <i class="el-icon-delete"></i>
      //       </span>
      //     </span>
    },
    // 手动删除视频
    onDeleteVideo() {
      this.attaList = []
      this.$emit('input', [])
    }
  },
  watch: {
    value: {
      handler: function(val) {
        console.log('watch value', val)
        if (val.length === 0) {
          this.$refs['upload'].clearFiles()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
