<template>
  <div>
    <!-- 头部 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 渲染一级权限 -->
            <el-row align="middle" v-for="(item1,index) in scope.row.children" :key="item1.id" class="bd-bottom vcenter" :class="{'bd-top': index === 0}">
              <el-col :span="5">
                <el-tag  closable @close="closeRoleTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
            <!-- 渲染二级权限 -->
                <el-row  v-for="(item2,indey) in item1.children" :key="item2.id" :class="[indey === 0 ? '': 'bd-top','vcenter']">
                  <el-col :span="7">
                    <el-tag   closable @close="closeRoleTag(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="17">
                    <!-- 渲染三级权限 -->
                    <el-tag type="warning" v-for="(item3,indez) in item2.children" :key="item3.id" closable @close="closeRoleTag(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope" >
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="rightDialogShow(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限提示框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="rightDialogVisible"
        width="50%">
        <el-tree :data="rightList" :props="treeProps" show-checkbox default-expand-all 
                  ref="rightTree"
                  node-key="id" :default-checked-keys="defaultKey"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRight">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- 分配权限树形结构 -->
    
  </div>
</template>
<script>
import { getRoleData,deleteRoleRight,getRightDataTree,addRoleRight } from 'network/home'
export default {
  name: 'Role',
  components: {},
  data() {
    return {
      roleList: [],
      // 分配权限提示框显示隐藏
      rightDialogVisible: false,
      rightList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 分配权限提示框默认打开的列表
      defaultKey: [],
      // 角色id
      roleId: ''
    }
  },
  created(){
   this.getRoleList()
  },
  methods: {
    // 获取角色权限列表
    getRoleList(){
      getRoleData()
      .then(res => {
        if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
        this.roleList = res.data
      })
    },
   
    closeRoleTag(role, rightId){
      this.$confirm('此操作将永久删除该角色权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRoleRight(role.id, rightId)
          .then(res => {
            if(res.meta.status !== 200) return this.$message.error('取消角色权限失败')
            role.children = res.data
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 角色分配对话框
    rightDialogShow(node){
      this.roleId = node.id
      this.rightDialogVisible = true
      getRightDataTree()
      .then(res => {
        if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
        this.rightList = res.data

        this.defaultKey = []
        this.getDefaultKey(node,this.defaultKey)
      })
    },
    // 通过递归获取树形结构中角色已有权限
    getDefaultKey(node, arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getDefaultKey(item,arr))
    },
    // 添加权限
    addRight(){
      this.rightDialogVisible = false
      const checkedKeys = [...this.$refs.rightTree.getCheckedKeys(),
                           ...this.$refs.rightTree.getHalfCheckedKeys()]
      const keyStr = checkedKeys.join(',')

      addRoleRight(this.roleId, { rids: keyStr })
      .then(res => {
        console.log(res);
        if(res.meta.status !== 200) return this.$message.error('更新权限失败')
        return this.$message.success('更新成功')
        this.getRoleList()
        
      })
    }
  }
  // watch: {
  //   roleList: {
  //     handler() {
  //       this.getRoleList()
  //     },
  //   }
  // }
}
</script>
<style scoped>
.el-row {
  padding: 7px;
}
.bd-top {
  border-top: 1px solid #eee;
}

.bd-bottom {
  border-bottom: 1px solid #eee;
}

.el-tag {
  margin: 5px;
}

.vcenter {
 display: flex;
 align-items: center;
}
</style>