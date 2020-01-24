<template>
  <div>
    <!-- 头部 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>  
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="userListQuery.query" clearable @clear="clearClick">
            <el-button slot="append" icon="el-icon-search" @click="getUserList(userListQuery)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"><el-button type="primary" @click="dialogVisible = true">添加用户</el-button></el-col>
      </el-row>
      <!-- 用户列表区域 -->
       <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-star-off" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
       </el-table>
       <!-- 分页 -->
       <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="userListQuery.pagenum"
         :page-sizes="[2, 4, 6, 8]"
         :page-size="userListQuery.pagesize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
       </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"  @close="addFormReset"
      width="50%">
      <!-- 内容主体 -->
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>  
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 编辑用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible" 
      width="50%" @close="editFormReset">
      <!-- 内容主体 -->
       <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>  
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCommit">确 定</el-button>
      </span>
    </el-dialog> 
  </div>
</template>
<script>
import { getUserListData,putStatus,addUsers,getEditData, commitEditData,deleteUserData } from 'network/home'

export default {
  name: 'UserList',
  components: {},
  data() {
    // 自定义手机号码表单验证规则
    var checkPhone = (rule, value, callback) => {
        const reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
        if (!reg.test(value)) {
          return callback(new Error('请输入正确的手机号'));
        }
        return callback()
    };
    return {
      userListQuery: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: null,
      // 添加用户对话框变量
      dialogVisible: false,
      // 表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单验证规则
      addRules: {
        username:  [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:  [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email:  [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {  type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile:  [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]    
      },
      editDialogVisible: false,
      // 根据id获取用户数据
      editForm: {},
      // 编辑用户变淡验证规则
      editRules: {
        email:  [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {  type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile:  [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    this.getUserList(this.userListQuery)
  },
  methods: {
    getUserList(data){
      getUserListData(data)
      .then(res => {
        if(res.meta.status !== 200) return this.$message.error('获取数据失败')
        this.userList = res.data.users
        this.total = res.data.total
      })
    },
    handleSizeChange(val) {
        this.userListQuery.pagesize = val
        this.getUserList(this.userListQuery)
    },
    handleCurrentChange(val) {
      this.userListQuery.pagenum = val
      this.getUserList(this.userListQuery)
    },
    stateChange(val){
      putStatus(val.id, val.mg_state)
      .then(res => {
        if(res.meta.status !== 200){
          val.mg_state = !val.mg_state
          return this.$message.error('更改状态失败')
        }
        return this.$message.success('更改状态成功')
      })
    },
    // 搜索框清除关键字之后重新请求数据
    clearClick(){
      this.userListQuery.pagenum = 1
      this.getUserList(this.userListQuery)
    },
    // 监听对话框关闭时重置表单
    addFormReset(){
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户按钮操作
    addUser(){
      this.$refs.addFormRef.validate((valid) => {
        if(!valid) return  
        addUsers(this.addForm)
        .then(res=>{
          if(res.meta.status !== 201) return this.$message.error('添加用户失败!')
          this.$message.success('添加用户成功!')
          this.dialogVisible = false
          this.userListQuery.pagenum = 1
          this.getUserList(this.userListQuery)
        })
      });
    },
    // 编辑用户信息
    editUser(id){
      getEditData(id)
      .then(res => {
        if(res.meta.status !== 200){
          return this.$message.error('获取用户信息失败')
        }
        this.editForm = res.data
      })
      this.editDialogVisible = true
    },
    // 编辑用户完成关闭时重置表单
    editFormReset(){
      this.$refs.editFormRef.resetFields()
    },
    // 提交编辑用户信息
    editCommit(){
      // 预校验
      this.$refs.editFormRef.validate((valid) => {
        if(!valid) return  
        commitEditData(this.editForm.id,{ email: this.editForm.email, mobile: this.editForm.mobile })
        .then(res => {
          if(res.meta.status !== 200) return this.$message.error('修改用户信息失败')
          this.editDialogVisible = false
          this.userListQuery.pagenum = 1
          this.getUserList(this.userListQuery)
          this.$message.success('修改用户信息成功')
        })
      })
    },
    // 删除用户
    deleteUser(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUserData(id)
          .then(res => {
            if(res.meta.status !== 200) return this.$message.error('删除用户失败')
            this.$message.success('删除用户成功')
            this.userListQuery.pagenum = 1
            this.getUserList(this.userListQuery)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
}
</script>
<style scoped>
</style>