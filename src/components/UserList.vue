<template>
  <div class="user-list-page">
    <Card>
      <div class="row search-bar">
        <Form :model="searchQuery" ref="searchForm" inline>
          <FormItem prop="loginAcount" class="w200">
            <i-input v-model="searchQuery.loginAcount" placeholder="登录账号">
              <Icon type="md-contact" slot="prepend"></Icon>
            </i-input>
          </FormItem>
          <FormItem prop="mobile" class="w200">
            <i-input v-model="searchQuery.mobile" placeholder="手机号码">
              <Icon type="md-call" slot="prepend"></Icon>
            </i-input>
          </FormItem>
          <FormItem prop="email" class="w200">
            <i-input v-model="searchQuery.email" placeholder="邮箱">
              <Icon type="md-mail" slot="prepend"></Icon>
            </i-input>
          </FormItem>
        </Form>
        <div v-permission-button="'search'" class="ml10" >
          <Button  type="primary" @click="onSearch">搜索</Button>
          <Button class="ml4" @click="onResetSearch">重置</Button>
        </div>
      </div>
      <Divider />
      <ButtonGroup class="mb10">
        <Button type="primary" icon="md-add" @click="onAddUserClick">添加用户</Button>
      </ButtonGroup>
      <Table border editable :columns="columns" :data="tableData" :loading="tableLoading">
      </Table>
      <Page style="margin-top: 20px;"
        :total="total" 
        :page-size="searchQuery.pageSize" 
        placement="bottom" 
        show-total 
        show-elevator 
        show-sizer
        @on-change="pageIndexHandle"
        @on-page-size-change="pageSizeHandle"
      />
      <!-- 弹窗 -->
      <Modal
        v-model="showModal"
        :title="modalTitle"
        :closable="false"
        :mask-closable="false"
        :loading="modalLoading">
        <Form v-if="modalType === 'addUser'" :model="addUserForm" ref="addUserForm" :rules="addUserFormValidate">
          <div class="row space-around space-around">
            <FormItem label="登录账号" prop="loginAcount" class="w200">
              <Input v-model="addUserForm.loginAcount" placeholder="登录账号" width="40%" />
            </FormItem>
            <FormItem label="登录密码" prop="loginPassword" class="w200">
              <Input v-model="addUserForm.loginPassword" placeholder="登录密码" />
            </FormItem>
          </div>
          <div class="row space-around">
            <FormItem label="手机号码" prop="mobile" class="w200">
              <Input v-model="addUserForm.mobile" placeholder="手机号码" />
            </FormItem>
            <FormItem label="邮箱" prop="email" class="w200">
              <Input v-model="addUserForm.email" placeholder="邮箱" />
            </FormItem>
          </div>
          <div class="row space-around">
            <FormItem label="支付密码" prop="payPassword" class="w200">
              <Input v-model="addUserForm.payPassword" placeholder="支付密码" />
            </FormItem>
            <FormItem label="备注" prop="remark" class="w200">
              <Input v-model="addUserForm.remark" placeholder="备注" />
            </FormItem>
          </div>
        </Form>
        <div v-if="modalType === 'updateUser'">
          <Input v-model="currentUpdateItem.value" />
        </div>
        <div slot="footer">
          <Button @click="showModal = false">取消</Button>
          <Button type="primary" :loading="modalLoading" @click="onConfirm">{{ confirmTextBtn }}</Button>
        </div>
      </Modal>
      <!-- 修改密码弹窗 -->
      <Modal
        v-model="updatePassworModal"
        :title="updatePassworModalTitle"
        :closable="false"
        :mask-closable="false">
        <div class="col">
          <i-input v-model="oldPassword" placeholder="请输入旧密码" type="password" class="mb10">
            <span slot="prepend" style="display: inline-block; width: 80px;">旧密码</span>
          </i-input>
          <i-input v-model="newPassword" placeholder="请输入新密码" type="password" class="mb10">
            <span slot="prepend" style="display: inline-block; width: 80px;">新密码</span>
          </i-input>
          <i-input v-model="confirmPassword" placeholder="确认新密码" type="password">
            <span slot="prepend" style="display: inline-block; width: 80px;">确认新密码</span>
          </i-input>
        </div>
        <div slot="footer">
          <Button @click="updatePassworModal = false; newPassword = ''; oldPassword = ''">取消</Button>
          <Button type="primary" :loading="modalLoading" @click="onConfirmUpdatePassword">修改</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import { formatDate, deepClone, isEmpty } from '@/utils'
export default {
  name: 'UserList',
  components: {
  },
  data () {
    return {
      tableLoading: false,
      searchQuery: {
        pageIndex: 1,
        pageSize: this.$config.defaultRows,
        // isDelete: false,
        orderStr: 'createTimestamp desc',
        loginAcount: '',
        email: '',
        mobile: ''
      },
      tableData: [],
      total: 0,
      columns: [
        { type: 'index', align: 'center', width: 60 },
        { title: '登录账号', key: 'loginAcount', minWidth: 180,
          render: (h, { row, column, index }) => { // 修改
            return h('div', {
              class: 'row space-between'
            }, [
              h('span', row.loginAcount),
              h('Icon',{ 
                props: {type: 'md-create', size: 14, color: '#2d8cf0' },
                on: { 
                  click: () => {
                    this.updateClick(row, column, index)
                  }
                } 
              })
            ])
          }
        },
        { title: '手机号码', key: 'mobile', width: 150,
          render: (h, { row, column, index }) => { // 修改
            return h('div', {
              class: 'row space-between'
            }, [
              h('span', row.mobile),
              h('Icon',{ 
                props: {type: 'md-create', size: 14, color: '#2d8cf0' },
                on: { 
                  click: () => {
                    this.updateClick(row, column, index)
                  }
                } 
              })
            ])
          }
        },
        { title: '邮箱', key: 'email', width: 180,
          render: (h, { row, column, index }) => { // 修改
            return h('div', {
              class: 'row space-between'
            }, [
              h('span', row.email),
              h('Icon',{ 
                props: {type: 'md-create', size: 14, color: '#2d8cf0' },
                on: { 
                  click: () => {
                    this.updateClick(row, column, index)
                  }
                } 
              })
            ])
          }
        },
        { title: '备注', key: 'remark', minWidth: 160,
          render: (h, { row, column, index }) => { // 添加备注
            let remarkArr = []
            if (row.remark) {
              remarkArr = row.remark.split(/[\s\n]/) // 分割换行符
            }
            return (
              <div class="row space-between center-y">
                <div>
                  {
                    remarkArr.map(item => <p>{item}</p>)
                  }
                </div>
                <Icon type="md-add" color="#2d8cf0" size={14} onClick={ () => this.updateClick(row, column, index) } />
              </div>
            )
          }
        },
        { title: '创建时间', key: 'createTimestamp', width: 100,
          render(h, { row, column, index }) {
            return h('span', formatDate(row.createTimestamp, 'Y-M-D h:m'))
          }
        },
        { title: '状态', key: 'isDelete', width: 100,
          render(h, { row, column, index }) {
            if (row.isDelete) {
              return h('Tag', {
                props: {
                  color: 'green'
                }
              }, '已冻结')
            } else {
              return h('Tag', {
                props: {
                  color: 'blue'
                }
              }, '已启用')
            }
          }
        },
        { title: '操作', width: 340, fixed: 'right',
          render: (h, { row, column, index }) => {
            return (
              <div class="row space-between">
                { row.isDelete ? 
                  <Button size="small" type="success" onClick={ () => this.handleDelete(row, index) }>启用</Button> 
                  : <Button size="small" type="error" onClick={ () => this.handleDelete(row, index) }>冻结</Button>
                }
                <Button size="small" type="primary" onClick={ () => this.resetPassword(row, column, index) }>重置密码</Button>
                <Button size="small" type="primary"  onClick={ () => this.updatePassword('修改登录密码', row) }>修改登录密码</Button>
                <Button size="small" type="primary" onClick={ () => this.updatePassword('修改支付密码', row) }>修改支付密码</Button>
              </div>
            )
          }
        }
      ],
      modalType: 'addUser',
      modalTitle: '添加用户',
      confirmTextBtn: '添加',
      showModal: false,
      addUserForm: {
        'email': '',
        'loginAcount': '',
        'loginPassword': '',
        'mobile': '',
        'payPassword': '',
        'remark': ''
      },
      addUserFormValidate: {
        loginAcount: [
          { required: true, message: '登录账号不能为空', trigger: 'blur' }
        ],
        loginPassword: [
          { required: true, message: '登录密码不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' }
        ],
      },
      modalLoading: false,
      currentUpdateItem: {
        value: '',
        key: '',
        title: '',
        id: ''
      },
      currentIndex: 0,
      // 修改密码弹窗
      updatePassworModal: false,
      updatePassworModalTitle: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },
  methods: {
    // 页码改变
    pageIndexHandle (val) {
      this.searchQuery.pageIndex = val
      this.fetchTableData()
    },
    // 每页大小改变
    pageSizeHandle (val) {
      this.searchQuery.pageIndex = 1
      this.searchQuery.pageSize = val
      this.fetchTableData()
    },
    // table数据
    async fetchTableData () {
      this.tableLoading = true
      await this.$post('/user/selectUserPage', this.searchQuery)
        .then(res => {
          // console.info(res)
          this.tableData = res.records
          this.total = Number(res.total)
        }).finally(() => {
          this.tableLoading = false
        })
    },
    // 删除
    handleDelete(row, index) {
      console.log(row, index)
      if (row.isDelete) { // 重启用户
        this.$Modal.confirm({
          title: '确定启用？',
          onOk: () => {
            this.$put(`/user/reEnableUser/${row.id}`)
              .then(res => {
                this.$Message.success('启用成功')
                row.isDelete = !row.isDelete
              })
          }
        })
      } else { // 删除用户
        this.$Modal.confirm({
          title: '确定冻结？',
          onOk: () => {
            this.$put(`/user/delUser/${row.id}`)
              .then(res => {
                this.$Message.success('冻结成功')
                // this.tableData.splice(index, 1)
                row.isDelete = !row.isDelete
              })
          }
        })
      }
    },
    // 重置登录密码
    resetPassword(row, column, index) {
      console.log(row, column, index)
      this.$Modal.confirm({
        title: '确定重置登录密码吗？',
        onOk: () => {
          this.$put(`/user/resetLoginPassword/${row.id}`)
          .then(res => {
            this.$Message.success('重置成功')
          })
        }
      })
    },
    // 保存编辑
    onSaveEdit({ row, index, column, value }) {
      console.log(row, index, column.title, value)
      if (column.key === 'mobile') {
        console.log(row.id)
        this.$put('/user/updateMobile', {
          id: row.id,
          mobile: value
        }).then(res => {
          console.log(res)
        })
      } else if (column.key === 'email') {
        console.log(row.id)
        this.$put('/user/updateEmail', {
          id: row.id,
          email : value
        }).then(res => {
          console.log(res)
        })
      }
    },
    // 弹窗确认事件
    onConfirm() {
      if (this.modalType === 'addUser') {
        console.log('onConfirm', this.addUserForm)
        this.$refs['addUserForm'].validate((valid) => {
          if (valid) {
            this.modalLoading = true
            let params = deepClone(this.addUserForm)
            params['loginPassword'] = this.$base64.encode(this.addUserForm['loginPassword'])
            params['payPassword'] = this.$base64.encode(this.addUserForm['payPassword'])
            console.log(params)
            this.$post('/user/addUser', params)
            .then(res => {
              this.$Message.success('添加用户成功')
              this.$refs['addUserForm'].resetFields()
              this.showModal = false
              this.searchQuery['pageIndex'] = 1
              // this.fetchTableData()
              this.tableData.unshift(res)
            }).finally(() => {
              this.modalLoading = false
            })
          }
        })
      } else if (this.modalType === 'updateUser') {
        // console.log(typeof this.currentUpdateItem['id'], Number(this.currentUpdateItem['id']))
        if (this.currentUpdateItem['key'] === 'mobile') { // 修改手机
          this.modalLoading = true
          this.$put(`/user/updateMobile?id=${this.currentUpdateItem['id']}&mobile=${this.currentUpdateItem['value']}`)
          .then(res => {
            this.$Message.success('修改手机号码成功')
            this.tableData[this.currentIndex].mobile = this.currentUpdateItem['value']
            this.showModal = false
          }).finally(() => {
            this.modalLoading = false
          })
        } else if (this.currentUpdateItem['key'] === 'email') { // 修改邮箱
          this.modalLoading = true
          this.$put(`/user/updateEmail?id=${this.currentUpdateItem['id']}&email=${this.currentUpdateItem['value']}`)
          .then(res => {
            this.$Message.success('修改邮箱成功')
            this.tableData[this.currentIndex].email = this.currentUpdateItem['value']
            this.showModal = false
          }).finally(() => {
            this.modalLoading = false
          })
        } else if (this.currentUpdateItem['key'] === 'remark') { // 添加备注
          this.modalLoading = true
          this.$put(`/user/addRemark?id=${this.currentUpdateItem['id']}&remark=${this.currentUpdateItem['value']}`)
          .then(res => {
            this.$Message.success('添加备注成功')
            this.showModal = false
            this.fetchTableData()
          }).finally(() => {
            this.modalLoading = false
          })
        } else if (this.currentUpdateItem['key'] === 'loginAcount') { // 修改登录账号
          this.modalLoading = true
          this.$put(`/user/updateLoginAcount?id=${this.currentUpdateItem['id']}&loginAcount=${this.currentUpdateItem['value']}`)
          .then(res => {
            this.$Message.success('修改登录账号成功')
            this.tableData[this.currentIndex].loginAcount = this.currentUpdateItem['value']
            this.showModal = false
          }).finally(() => {
            this.modalLoading = false
          })
        }
      }
    },
    // 表格修改按钮
    updateClick(row, column, index){
      if (column.key === 'remark') {
        this.confirmTextBtn = '添加备注'
        this.currentUpdateItem['value'] = ''
      } else {
        this.confirmTextBtn = '修改'
        this.currentUpdateItem['value'] = row[column.key]
      }
      this.modalType = 'updateUser'
      this.modalTitle = column.title
      this.currentUpdateItem['id'] = row.id
      this.currentUpdateItem['key'] = column.key
      this.currentUpdateItem['title'] = column.title
      this.currentIndex = index
      this.showModal = true
    },
    // 添加用户按钮
    onAddUserClick() {
      this.modalType = 'addUser'
      this.modalTitle = '添加用户'
      this.confirmTextBtn = '添加'
      this.showModal = true
    },
    // 搜索
    onSearch(value) {
      this.searchQuery['pageIndex'] = 1
      this.fetchTableData()
    },
    // 重置搜索
    onResetSearch() {
      this.$refs['searchForm'].resetFields()
      this.searchQuery['pageIndex'] = 1
      this.fetchTableData()
    },
    updatePassword(type, row) {
      // console.log(type)
      this.updatePassworModal = true
      this.updatePassworModalTitle = type
      this.currentUpdateItem['id'] = row.id
    },
    onConfirmUpdatePassword() {
      if (this.oldPassword === '') {
        this.$Message.error('请输入旧密码')
        return
      }
      if (this.newPassword === '') {
        this.$Message.error('请输入新密码')
        return
      }
      if (this.confirmPassword === '') {
        this.$Message.error('请输入确认密码')
        return
      }
      if (this.confirmPassword !== this.newPassword) {
        this.$Message.error('两次输入的新密码不一致')
        return
      }
      let url
      if (this.updatePassworModalTitle === '修改登录密码') {
        url = '/user/updateLoginPassword'
      } else if (this.updatePassworModalTitle === '修改支付密码') {
        url = '/user/updatePayPassword'
      }
      this.modalLoading = true
      this.$post(url, {
        id: this.currentUpdateItem['id'],
        oldPassword: this.$base64.encode(this.oldPassword),
        newPassword: this.$base64.encode(this.newPassword)
      }).then(res => {
        this.$Message.success(`${this.updatePassworModalTitle}成功`)
        this.updatePassworModal = false
        this.oldPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
      }).finally(() => {
        this.modalLoading = false
      })
    }
  },
  created () {
    this.fetchTableData()
  },
  mounted () { },
  watch: {
  }
}
</script>

<style lang="scss">
.user-list-page{
  .search-bar{
    .ivu-form-item{
      margin-bottom: 0;
    }
  }
  .ivu-icon{
    cursor: pointer;
  }
}
</style>

