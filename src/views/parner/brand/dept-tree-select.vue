<template>
  <tree-select
    v-model="val"
    :nodes="nodes"
    :multiple="multiple"
    :disabled="disabled"
    :clearable="clearable"
    :placeholder="placeholder"
    :tree-filter-node-fn="treeFilterNode"
  >
    <div slot-scope="{ node, data }" :class="[isActived(data) ? 'actived' : '', ]">
      <i
        v-if="Array.isArray(data.children)"
        :class="[node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder', 'mr10' ]"
      ></i>
      <span>{{data.label}}</span>
      <span v-if="!Array.isArray(data.children)" class="mr20">{{ data.position }}</span>
      <span class="checkicon">
        <i class="el-icon-check" v-show="isActived(data)"></i>
      </span>
    </div>
  </tree-select>
</template>

<script>
import { getDepartments } from '@/api/client'
import TreeSelect from '@/components/TreeSelect.vue'

export default {
  components: { TreeSelect },
  name: 'DeptTreeSelect',

  props: {
    placeholder: {
      type: String,
      default: '请输入姓名搜索',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Object, Array, Number],
      default: () => {
        return ''
      },
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      val: '',
      nodes: [],
      currentNode: null,
      userPositionMap: {},
    }
  },

  created() {
    getDepartments().then((res) => {
      this.nodes = this.formatDept(res)
    })
  },

  watch: {
    value(val) {
      this.val = val
    },

    val(val) {
      this.$emit('input', val)
    },
  },

  methods: {
    formatDept(depts, parent = null) {
      if (!Array.isArray(depts)) {
        return []
      }
      return depts.map((v) => {
        const children = v.isDepart
          ? this.formatDept(v.subDepartments, v)
          : null
        const value = v.isDepart ? v.id : v.mobile
        if (!value) {
          console.log(v)
        }
        const position = v.isDepart
          ? ''
          : `(${(parent && parent.name) || ''}/${v.position})`
        this.userPositionMap[value] = position
        return {
          value,
          label: v.name,
          children,
          position,
        }
      })
    },

    handleNodeClick(node) {
      if (Array.isArray(node.children)) {
        return
      }
      if (this.multiple) {
        if (this.val.includes(node.value)) {
          this.title = this.title.filter((v) => v !== node.label)
          this.val = this.val.filter((v) => v !== node.value)
        } else {
          if (!Array.isArray(this.val)) {
            this.val = []
            this.title = []
          }
          this.val = [...this.val, node.value]
          this.title = [...this.title, node.label]
        }
      } else {
        this.val = node.value
        this.title = node.label
        this.$refs.select.blur()
      }
    },

    isActived(node) {
      if (Array.isArray(this.val)) {
        return this.val.includes(node.value)
      }
      return this.val === node.value
    },

    treeFilterNode(value, data) {
      if (!value) return true
      if (Array.isArray(data.children)) {
        return false
      }
      return (
        data.label.includes(value) ||
        (data.position && data.position.includes(value))
      )
    },

    selectfilterFn(keyword) {
      this.$refs.tree.filter(keyword)
    },
  },
}
</script>

<style lang="scss" scoped>
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