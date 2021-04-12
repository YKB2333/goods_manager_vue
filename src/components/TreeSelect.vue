<template>
  <el-select 
    filterable
    :filter-method="selectfilterFn"
    :disabled="disabled"
    :multiple="multiple"
    :clearable="clearable"
    v-model="val" 
    :placeholder="placeholder">
    <el-option
      label="________"
      value="____">
      <el-tree
        ref="tree"
        node-key="value"
        :data="nodes"
        :highlight-current="false"
        :filter-node-method="treeFilterNode"
        @node-click="handleNodeClick">
        <span slot-scope="{ node, data }"  >
          <slot :node="node" :data="data">
            <span :class="[isActived(data) ? 'actived' : '', ]">
              <i v-if="Array.isArray(data.children)" :class="[node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder', 'mr10' ]" ></i>
              <span>{{data.label}}</span>
              
              <span class="checkicon">
                <i class="el-icon-check " v-show="isActived(data)" ></i>
              </span>
            </span>
          </slot>
        </span>
      </el-tree>
    </el-option>
    <el-option v-for="item in selectNode" :key="item.value" :label="item.label" :value="item.value">
      <div style="display: none"></div>
    </el-option>
  </el-select>
</template>

<script>
import emitter from '@/mixins/emitter'

export default {
  name: 'TreeSelect',

  mixins: [emitter],

  props: {
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Object, Array, Number],
      default: () => {
        return ''
      }
    },
    /**
     * 树形数据源头
     * 数组项格式一般包含 label、value、children
     */
    nodes: {
      type: Array,
      default: () => ([])
    },
    treeFilterNodeFn: Function
  },

  data() {
    return {
      val: '',
      selectNode: [], // 用于select组件展示
    }
  },

  watch: {
    value: {
      handler: function(val) {
        this.setSelectNode(val);
        this.$nextTick(() => {
          this.val = val;
        })
      },
      immediate: true,
      deep: true
    },

    val: {
      handler: function(val) {
        this.$emit('input', val);
      },
      deep: true
    },

    nodes:  {
      handler: function(val) {
        this.$nextTick(() => {
          this.setSelectNode();
        })
      },
      immediate: true
    }
  },

  mounted() {
    this.setSelectNode()
  },

  methods: {
    handleNodeClick(node) {
      if (Array.isArray(node.children)) {
        return ;
      }
      if (this.multiple) {
        if (this.val.includes(node.value)) {
          this.selectNode = this.selectNode.filter(v => v.value !== node.value);
          this.val = this.val.filter(v => v !== node.value)
          return ;
        } 
        if (!Array.isArray(this.val)) {
          this.val = [];
          this.selectNode = [];
        }
        this.val = [...this.val, node.value];
        this.selectNode = [...this.selectNode, { label: node.label, value: node.value }]
        return ;
      } 
      this.val = node.value;
      this.selectNode = node;
    },

    isActived(node) {
      if (Array.isArray(this.val)) {
        return this.val.includes(node.value)
      } 
      return this.val === node.value;
    },

    treeFilterNode(value, data) {
      if (this.treeFilterNodeFn) {
        return this.treeFilterNodeFn(value, data)
      }
      if (!value) return true;
      return data.label.includes(value);
    },

    selectfilterFn(keyword) {
      this.$refs.tree.filter(keyword);
    },

    setSelectNode(val = this.val) {
      const treeRef = this.$refs.tree;
      if (!treeRef) {
        return ;
      }
      if (!val) {
        this.selectNode = [];
        return ;
      }
      if (Array.isArray(val)) {
        this.selectNode =  val.map(v => {
          const node = treeRef.getNode(v);
          if (!node) {
            return {}
          }
          return {label: node.label, value: node.key}
        });
      } else {
        const node = treeRef.getNode(val)
        this.selectNode = node ? [{label: node.label, value: node.key}] : [];
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-scrollbar .el-scrollbar__view  {
  .el-select-dropdown__item{
    height: auto;
    // max-height: 274px;
    padding: 0;
    overflow: hidden;
    // overflow-y: auto;
    &.selected{
      font-weight: normal;
    }
  }
}   

.actived {
  color: rgba(64, 158, 255, 1);
  width: 100%;
  .checkicon {
    float: right;
    margin-right: 10px;
    margin-left: 20px;
  }
}
</style>