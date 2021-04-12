<template>
  <div class="uploadWrapper row">
    <vuedraggable
      animation="300"
      :class="{ single: !$attrs.multiple}"
      v-model="file_list"
      tag="ul"
      draggable=".draggable-item"
      @start="onDragStart"
      @end="onDragEnd"
    >
      <transition-group class="vue-draggable">
        <!-- 拖拽元素 -->
        <li
          v-for="(item, index) in file_list"
          :key="item[imgKey]"
          class="draggable-item col"
          :style="{ width: width + 'px', height: height + 'px', 'margin-right': '3px' }"
        >
          <el-image
            :src="item[imgKey]"
            style="object-fit: contain;"
          ></el-image>
          <div class="shadow" @click.stop="onRemoveHandler(index)">
            <i class="el-icon-delete"></i>
          </div>
          <div class="row center ptb6 relative" v-if="labelSelectName" >
            <div class="w-h-full pos-center" style="z-index:99" @click.stop="onSelect(item,index)"></div>
            <el-radio v-model="radio" :label="item[selectKey] || index"  >{{ labelSelectName }}</el-radio>
          </div>
        </li>
      </transition-group>
    </vuedraggable>
    <!-- 上传按钮 -->
    <el-upload
      v-bind="$attrs"
      v-on="$listeners"
      :class="{maxHidden:isMaxHidden}"
      :style="{ width: width + 'px', height: height + 'px' }"
      :show-file-list="false"
    >
      <i class="el-icon-plus uploadIcon">
        <span
          v-if="!isUploading && $attrs.limit && $attrs.limit!==99 && $attrs.multiple"
          class="limitTxt"
        >最多{{ $attrs.limit }}张</span>
      </i>
    </el-upload>
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";

export default {
  name: "UploadDraggable",

  props: {
    // 是否触发拖拉监听方法
    is_touch_change: {
      type: Boolean,
      default: false,
    },
    // 图片数据(图片url组成的数组) 通过v-model传递
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    // 图片显示的宽度(px)
    width: {
      type: Number,
      default: 150,
    },
    // 图片显示的高度(px)
    height: {
      type: Number,
      default: 150,
    },
    // img Key Name
    imgKey: {
      type: String,
      default: "url",
    },
    // 当前选择的ID
    selectKey: {
      type: String,
      default: "id",
    },
    // 选择当前list name
    labelSelectName:{
      type:String,
      default:''
    },
    // 当前选的ID
    labelSelectId:{
      type:[String,Number],
      default:0
    }
  },

  data() {
    return {
      radio:'',
      isUploading: false, // 正在上传状态
    };
  },

  computed: {
    // 文件数组数据
    file_list: {
      get() {
        console.log(this.value);
        return this.value;
      },
      set(val) {
        if (val.length < this.file_list.length) {
          // 判断是删除文件时同步el-upload数据
          // this.syncElUpload(val)
        }
        // 特定事件emit 同步v-model
        if (this.is_touch_change) {
          this.$emit("touch-change", val);
        } else {
          // 同步v-model
          this.$emit("input", val);
        }
      },
    },
    // 控制达到最大限制时隐藏上传按钮
    isMaxHidden() {
      console.log(this.file_list.length >= this.$attrs.limit);
      return this.file_list.length >= this.$attrs.limit;
    },
  },
  watch: {
    labelSelectId:{
      handler(val,old){
        console.log(val);
        this.radio = val
        return 
      },
      immediate:true
    }
  },
  mounted() {
    console.log(this.$attrs);
    console.log(this.$listeners);
  },
  methods: {
    // 上传图片之前
    beforeUpload(file) {
      console.log(file, "传入的判断");
      if (this.before_upload.length) {
        // 传入的校验
        return this.before_upload(file);
      } else {
        // 默认的上传校验
        const isSize = file.size / 1024 / 1024 < 5;
        if (!isSize) {
          this.$message.error("图片大小不能超过 5MB!");
          return false;
        }
        return true;
      }
    },
    // 上传完单张图片
    onSuccessUpload(res, file, fileList) {},
    // 移除单张图片
    onRemoveHandler(index) {
      this.$confirm("确定删除该文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("on-remove", this.file_list[index]);
        })
        .catch(() => {});
    },
    onDragStart(e) {
      e.target.classList.add("hideShadow");
    },
    onDragEnd(e) {
      e.target.classList.remove("hideShadow");
    },
    // 点击选择按钮 
    onSelect(item,index){
      console.log(1324);
      this.radio = item[this.selectKey] || index
      console.log( item[this.selectKey] || index);
      this.$emit('on-select',item,index)
    }
  },

  components: { vuedraggable },
};
</script>

<style lang="scss" scoped>
/deep/ .el-upload {
  width: 100%;
  height: 100%;
}
ul {
  margin: 0;
  padding: 0;
}
li{
  list-style-type: none;
}

// 上传按钮
.uploadIcon {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #c0ccda;
  background-color: #fbfdff;
  border-radius: 6px;
  font-size: 20px;
  color: #999;

  .limitTxt,
  .uploading {
    position: absolute;
    bottom: 10%;
    left: 0;
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
}

// 拖拽
.vue-draggable {
  display: flex;
  flex-wrap: wrap;

  .draggable-item {
    margin-right: 5px;
    margin-bottom: 5px;
    border: 1px solid #ddd;
    border-radius: 6px;
    position: relative;

    .el-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .shadow {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s;
      color: #fff;
      font-size: 20px;
      line-height: 20px;
      padding: 2px;
      cursor: pointer;
    }
    &:hover {
      .shadow {
        opacity: 1;
      }
    }
  }
  &.hideShadow {
    .shadow {
      display: none;
    }
  }
  &.single {
    overflow: hidden;
    position: relative;

    .draggable-item {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
  }
}
// el-image
.el-image-viewer__wrapper {
  .el-image-viewer__mask {
    opacity: 0.8;
  }
  .el-icon-circle-close {
    color: #fff;
  }
}
/deep/ .el-image {
  background: white;
  img {
    object-fit: contain;
  }
}
/deep/ .maxHidden {
  .el-upload {
    display: none;
  }
}
.addIcon{
  position: absolute;
  left: 0;
  top: 0;
}
</style>