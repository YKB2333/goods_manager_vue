<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange" @action="()=>{console.log(123)}">
      <el-button v-permissionButton="'add'" type="primary" @click="add" class="mb20">新增标签</el-button>
      <el-table
        :data="tableData"
        border
        stripe
        element-loading-text="拼命加载中"
      >
        <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
        <el-table-column prop="name" label="标签名称" align="center"></el-table-column>
        <el-table-column  label="关联商品数" align="center">
          <template slot-scope="scope">
          <span style="margin-left:30px" @click="getRelationSpu(scope.row)"><el-link type="primary" :underline="false" >{{scope.row.relationCount==null?0:scope.row.relationCount}}</el-link></span>
          <span style="float: right" @click="getRelationSpu(scope.row)"><el-link :underline="false" ><i class="el-icon-edit"></i></el-link></span>
        </template>
        </el-table-column>
        <el-table-column prop="type" label="标签类型" align="center">
        <template slot-scope="scope">
          {{scope.row.type==1?'系统':'自定义'}}
        </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
          <div v-if="scope.row.createDate">{{ scope.row.createDate | formatDate('Y/M/D h:m') }}</div>
        </template>
        </el-table-column>
         <el-table-column label="修改时间" align="center">
            <template slot-scope="scope">
          <div v-if="scope.row.updateDate">{{ scope.row.updateDate | formatDate('Y/M/D h:m') }}</div>
        </template>
         </el-table-column>
        <el-table-column prop="orderLevel" label="排序" width="60px" align="center"></el-table-column>
        <el-table-column  label="状态" align="center">
          <template slot-scope="scope" >
          <div v-if="scope.row.type==1">已启用</div>
          <div v-else>
            <template v-if="findRouterCode('enable')">
              <el-tooltip :content="scope.row.status==='1'?'已启用':'已禁用'" placement="top" >
              <el-switch
                v-model="scope.row.status"
                active-value="1"
                inactive-value="2" 
                @change="(value)=>onStatusChange(value,scope.row)"
              >
              </el-switch>
              </el-tooltip>
            </template>
            <template v-else>
              <p>{{scope.row.status==='1'?'已启用':'已禁用'}}</p>
            </template> 
          </div>
          </template>
        </el-table-column>
        <el-table-column label="操作"  align="center" >
          <template slot-scope="scope" >
           <el-button
              type="text"
              size="small"
              v-permissionButton="'viewLog'"
              @click="showLog(scope.row)"
              v-show="scope.row.type!=1"
            >操作日志</el-button>
            <el-button
              type="text"
              size="small"
              v-permissionButton="'edit'"
              @click="edit(scope.row, scope.$index)" 
              v-show="scope.row.type!=1"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              v-permissionButton="'delete'"
              @click="onDelete(scope.row, scope.$index)"
              v-show="scope.row.type!=1"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <!-- 弹窗 -->
    <my-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :title="saveForm.id?'编辑标签':'添加标签'"
      width="500px"
      max-height
      @close="closeDialog"
    >
      <el-form
        :model="saveForm"
        :rules="rules"
        ref="saveForm"
        :label-width="labelWidth"
        class="mr30"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="saveForm.name" maxlength="15" placeholder="请输入标签名称" show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="orderLevel">
          <el-input type="number" v-model="saveForm.orderLevel" placeholder="请输入排序"  :disabled="saveForm.type==1"></el-input>
        </el-form-item>
        <el-form-item label="备注：可点击标签列表中的“关联商品数”，管理该标签的商品。" label-width=450px>
         </el-form-item>
        <el-form-item style="display: block; text-align: left; padding-left: 80px">
          <el-button type="primary" :loading="saveBtnLoading" @click="submit">确定</el-button>
          <el-button @click="closeDialog()">关闭</el-button>
        </el-form-item>

      </el-form>
    </my-dialog>

    <el-dialog title="提示" :visible.sync="delTip" width="30%">
      <span>是否删除该标签？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delTip = false">取 消</el-button>
        <el-button type="primary" @click="deleteItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSpuTagPager,
  addSpuTag,
  updateSpuTag,
  deleteSpuTag,
  enableSpuTag,
  disableSpuTag,
  relationSpuTag,
  disassociationSpuTag
} from "@/api/goods";

export default {
  name: "spuTag",
  components: {},
  data() {
    return {
      currentItem: {},
      delTip: false,
      inputStyle: { width: "220px" },
      labelWidth: "80px",
      saveBtnLoading: false, // 保存按钮的loading状态
      tableLoading: false,
      tableData: [], // 表格数据
      RelationSpu:[],
      
      searchForm: [
        {
          label: "标签名称",
          key: "name",
          placeholder: "请输入标签名称",
          type: "input",
         
        },
        {
          label: "标签类型",
          key: "type",
          options: [
            { label: '全部', value: null },
            { label: '系统', value: 1 },
            { label: '自定义', value: 2 },
          ],
          type: "select"
        },
      ],
      searchQuery: {
        name: "", //标签名称
        type: "", //标签类型
        pageIndex: 1,
        pageSize: 10,
        total: 0, // 总条数
      },
      dialogVisible: false,
      saveForm: {},
      rules: {
        name: [{ required: true, message: "请输入标签名称（最长字数15个字）", trigger: "blur" }],
        orderLevel: [{ required: true, message: "请输入排序值（排序最大限制输入5位数）", trigger: "blur"},
          {pattern: /^[0-9]{1,5}$/, message: '请输入排序值（排序最大限制输入5位数）'}],
      },
    };
  },
  async created() {

    await this.fetchTableData();
  },
  methods: {
    // 查询列表
    fetchTableData() {
     this.$store.commit('SHOW_LOADING')
      this.tableLoading = true;
      return getSpuTagPager(this.searchQuery)
        .then((res) => {
          this.searchQuery.total = parseInt(res.count); // 总条数
          if(res.count<=0){
            this.tableData=[]
            return;
          }
          res.list.forEach((r) => {
            r.id += "";
          });
          this.tableData = res.list;
          console.log(this.tableData);
        })
        .finally(() => {
          this.tableLoading = false;
         this.$store.commit('SHOW_LOADING', false)
        });
    },
    edit(item) {
      this.saveForm = this.$lodash.cloneDeep(item);
      console.log(this.saveForm);
      this.dialogVisible = true;
    },
    onChange() {
      this.fetchTableData();
    },
    closeDialog() {
      this.saveForm = {};
      this.dialogVisible = false;
      this.$refs["saveForm"].clearValidate();
    },
    // 保存提交
    submit() {
      console.log(this.saveForm);
      if (this.saveForm.id) {
        this.update();
      } else {
        this.save();
      }
    },
    update() {
      this.$refs.saveForm.validate((valid) => {
        if (!valid) return false;
        this.saveBtnLoading = true;
        updateSpuTag(this.saveForm)
          .then(() => {
              this.$message.success("商品标签修改成功");
              this.fetchTableData();
              this.closeDialog();
          })
          .finally(() => {
            this.saveBtnLoading = false;
          });
      });
    },
    save() {
      this.$refs.saveForm.validate((valid) => {
        if (!valid) return false;
        this.saveBtnLoading = true;
        addSpuTag(this.saveForm)
          .then(() => {
              this.$message.success("商品标签添加成功");
              this.fetchTableData();
              this.closeDialog();
          })
          .finally(() => {
            this.saveBtnLoading = false;
          });
      });
    },

    add() {
      this.saveForm = {};
      this.dialogVisible = true;
    },
    onDelete(item) {
      console.log(item);
      this.currentItem = item;
      this.delTip = true;
      console.log(this.currentItem);
    },
    deleteItem() {
      deleteSpuTag(this.currentItem.id).then((res) => {
        this.fetchTableData();
        this.$message.success(res.resultMsg);
      });
      this.delTip = false;
      this.currentItem = {};
    },
     showLog(row) {
      let view = this.$instantCompt(require('@/views/log/index.vue').default, {
        logType: '3',
        relationKey: row.id
      })
      view.init()
    },
    onStatusChange(value,obj){
      if(value==1){
        enableSpuTag(obj.id).then(() => {
          // this.fetchTableData();
          this.$message.success("标签已启用")
        });
      }else{
        disableSpuTag(obj.id).then(() => {
          // this.fetchTableData();
          this.$message.success("标签已禁用")
        });
      }

    },
    getRelationSpu(obj){
      this.$router.push({name:'relationTagSpu', query:obj})
      // let view = this.$instantCompt(require('./relationSpu').default, {
      //   tagItem:obj
      // })
      // view.init()
    },
    findRouterCode(codeName) {
      // console.log(this.$route.meta.permission)
      return this.$route.meta.permission.find(e => e.code == codeName)
    }
  },
};
</script>

