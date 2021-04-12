<template>
  <div class="table-component">
    <div class="search-box" v-if="searchForm.length">
      <div class="form">
        <el-form :model="query" ref="search" label-width="100px" inline size="mini">
          <el-form-item
            v-for="(item, index) in searchForm"
            :key="index"
            :label="item.label"
            :prop="item.key"
          >
            <!-- 输入框 -->
            <div class="row center-y relative"  v-if="item.type === 'input'">
              <el-input
                v-model="query[item.key]"
                :placeholder="item.placeholder || item.label"
                @keyup.enter.native="enterInput"
                clearable
                @clear="onClear"
              ></el-input>
              <i :class="item.icon" v-if="item.icon" @click="actionClick" class="absolute" style="right:10px"></i>
            </div>
            <!-- 多选 -->
            <el-select
              v-if="item.type === 'select_multiple'"
              v-model="query[item.key]"
              @change="onSelect"
              multiple
              :filterable="query[item.filterable]"
            >
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
            <!-- 单选 -->
            <el-select 
              v-if="item.type === 'select'" 
              v-model="query[item.key]" 
              @change="onSelect" 
              clearable
              :filterable="query[item.filterable]"  
            >
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
            <!-- 分类 -->
            <cate-cascader
              v-if="item.type === 'cate_cascader'"
              v-model="query[item.key]"
              ref="cascader"
              :expandTrigger="item.expandTrigger ?'hover':'click'"
              @change="onCascaderChange"
            ></cate-cascader>
            <!-- <div v-if="item.type == 'cascader'"> {{ item.expandTrigger ?'hover':'click'}}</div> -->
            <el-date-picker
              v-if="item.type === 'date_picker'"
              v-model="query[item.key]"
              :type="item.pickerType"
              :format="item.format||'yyyy-MM-dd'"
              :value-format="item.valueFormat||'yyyy-MM-dd'"
              :default-time="item.defaultTime"
              align="right"
              unlink-panels
              range-separator="至"
              :clearable="item.clearable"
              :start-placeholder="item.startPlaceholder || item.label"
              :end-placeholder="item.endPlaceholder || item.label"
              :picker-options="item.pickerOptions"
              @change="onDatePicker">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="btns" v-permission-button="'search'">
        <el-button size="mini" type="primary" plain @click="onSearch">查询</el-button>
        <el-button size="mini" type="danger" plain @click="onReset">重置</el-button>
      </div>
    </div>
    <slot name="before-table"></slot>
    <el-card>
      <slot></slot>
    </el-card>
    <!-- <el-pagination
      v-if="pagination && query.pageIndex && query.pageSize"
      class="mt20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.pageIndex"
      :page-size="query.pageSize"
      :total="query.total"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination> -->
    <the-pagination
      v-if="pagination && query.pageIndex && query.pageSize"
      class="mt20"
      :pageIndex="query.pageIndex"
      :pageSize="query.pageSize"
      :total="query.total"
      @onPageSizeChange="handleSizeChange"
      @onPageIndexChange="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
    ></the-pagination>
  </div>
</template>

<script>
import CateCascader from "@/components/CateCascader";
import ThePagination from './ThePagination.vue';

export default {
  name: "Table",
  props: {
    value: {
      // query
      type: Object,
      required: true
    },
    pagination: {
      // query
      type: Boolean,
      default: true
    },
    searchForm: {
      // 查询表单
      type: Array,
      default: () => []
    }
  },
  components: { CateCascader, ThePagination },
  data() {
    return {
      query: this.value,
      temp: null
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.temp = this.$lodash.cloneDeep(this.value);
  },
  methods: {
    onReset() {
      this.query = this.$lodash.cloneDeep(this.temp);
      this.$emit("onReset");
      if (this.$refs["cascader"]) this.$refs["cascader"][0].clear();
      this.change();
    },
    onSearch() {
      this.query.pageIndex = 1;
      this.change();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.change();
    },
    handleCurrentChange(val) {
      this.query.pageIndex = val;
      this.change();
    },
    enterInput(val) {
      this.change();
    },
    onSelect() {
      this.change();
    },
    onClear() {
      this.change();
    },
    onCascaderChange() {
      this.change();
    },
    onDatePicker(){
      this.change();
    },
    change() {
      this.$emit("input", this.query);
      this.$emit("change", this.query);
    },
    actionClick() {
      this.$emit('action')
    }
  },
  watch: {
    // query: {
    //   handler: function(val) {
    //     console.log('watch', val)
    //     this.$emit('input', val)
    //     this.$emit('change', val)
    //   },
    //   deep: true
    // }
  }
};
</script>

<style lang="scss" scoped>
.table-component {
  .search-box {
    position: relative;
    width: 100%;
    background-color: #ffffff;
    border-radius: 6px;
    padding-top: 10px;
    margin-bottom: 10px;
    .form {
      width: calc(100% - 170px);
    }
    .btns {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
}
</style>
