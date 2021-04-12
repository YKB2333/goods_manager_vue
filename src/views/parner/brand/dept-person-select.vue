<template>
  <el-cascader 
    v-model="val"
    ref="cascader"
    :options="options"
    :show-all-levels="false"
    :props="props"
    filterable
    :filter-method="myFilterFn"
  >
    <template slot-scope="{ node, data }">
      <span>{{ data.label }}</span>
      <span v-if="node.isLeaf"> {{ data.position }} </span>
    </template>
  </el-cascader>
</template>

<script>
import {  getDepartments} from '@/api/client'

export default {
  name: 'DeptPersonSelect',
    
  data() {
    return {
      val: '',
      props: {
        emitPath: false
      },
      options: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      userPositionMap: {}
    }
  },

  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入姓名搜索'
    }
  },

  watch: {
    value: {
      handler: function(val) {
        this.val = val;
      },
      immediate: true
    },

    val(val) {
      this.$emit('input', val);
    }
  },

  created() {
    getDepartments()
      .then(res => {
        this.options = this.formatDept(res);
        console.log(res);
      })
  },

  methods: {
    formatDept(depts, parent = null) {
      if (!Array.isArray(depts)) {
        return []
      }
      return depts.map((v) => {
        const children = v.isDepart ? this.formatDept(v.subDepartments, v) : null;
        const value = v.isDepart ? v.id : v.mobile;
        const position = v.isDepart ? '' : `(${ parent && parent.name || ''}/${ v.position })`
        this.userPositionMap[value] = position;
        return {
          value,
          label: v.name,
          children,
          position
        }
      })
    },

    filterEmptyDept(arr) {
      return arr
        .map(v => {
          const children = Array.isArray(v.children) ? this.filterEmptyDept(v.children) : v.children;
          return {...v, children}
        })
        .filter(c => !(Array.isArray(c.children) && c.children.length === 0))
    },

    myFilterFn(node, keyword) {
      const text = node.label;
      const position = this.userPositionMap[node.value];
      node.text = `${text}  ${position}`;
      return text.includes(keyword) || position.includes(keyword)
    },

  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background: rgb(35, 167, 248);
  color: white;
}
</style>