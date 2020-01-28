<template>
  <div>
      <!-- 头部面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert  title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类 -->
      <el-row class="opt">
        <el-col>
          <span>选择商品分类</span>
          <!-- 级联选择器 -->
          <el-cascader v-model="selectedKeys" :options="cateList" :props="cateProps"
                       @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tabs页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addParamDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table  :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">
                  {{item}}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称"  prop="attr_name"></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editDialogShow(scope.row.attr_id)">修改</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addParamDialogVisible = true">添加属性</el-button>
            <!-- 静态属性表格 -->
          <el-table  :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">
                  {{item}}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称"  prop="attr_name"></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editDialogShow(scope.row.attr_id)">修改</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + dialogTitle"  :visible.sync="addParamDialogVisible" width="50%" @close="addFormClose">
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="addRules"> 
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 修改参数对话框 -->
    <el-dialog :title="'修改' + dialogTitle"  :visible.sync="editParamDialogVisible" width="50%" @close="editFormClose">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="editRules"> 
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCateData,getCateAttr,postParam,getEditAttr,putParams,putAttr,deleteAttr } from 'network/goods'

export default {
  name: 'GoodsParams',
  components: {},
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择器配置属性
      cateProps: {
        expandTrigger: 'hover', 
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器选中的
      selectedKeys: [],
       // tabs页签默认激活
      activeName: 'many',
      // 存储动态参数数据
      manyTableData: [],
      // 存储静态属性数据
      onlyTableData: [],
      // 添加参数对话框显示与隐藏
      addParamDialogVisible: false,
      // 添加参数表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加参数表单验证规则
      addRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 修改参数对话框显示与隐藏
      editParamDialogVisible: false,
      // 修改参数表单数据对象
      editForm: {
        attr_name: ''
      },
      // 修改参数表单验证规则
      editRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    this.getCateList()
  },
  computed: {
    // 参数属性按钮是否禁用
    isBtnDisable(){
      if(this.selectedKeys.length !== 3){
        return true
      }
      return false
    },
    // 分类id
    cateId(){
      if(this.selectedKeys.length === 3){
        return this.selectedKeys[2]
      }
      return null
    },
    // 对话框标题
    dialogTitle(){
      if(this.activeName === 'many'){
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    getCateList(){
      getCateData()
      .then(res => {
        if(res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')

        this.cateList = res.data
      })
    },
    handleChange(){
      // 长度不等于3，证明不是三级分类
      if(this.selectedKeys.length !== 3){
        this.selectedKeys = []
        this.onlyTableData = []
        this.manyTableData = []
        return
      }
      // 证明是三级分类
      console.log(this.selectedKeys);
      this.getParamData()
    },
    // 切换tabs页签
    handleTabsClick(){
      this.getParamData()
    },
    getParamData(){
      getCateAttr(this.cateId, this.activeName)
      .then(res => {
        
        if(res.meta.status !== 200) return this.$message.error('获取商品分类参数失败')
        
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })

        console.log(res);
        if(this.activeName === 'many'){
          this.manyTableData = res.data
        }else {
          this.onlyTableData = res.data
        }
        
      })
    },
    // 监听添加参数对话框关闭事件
    addFormClose(){
      this.$refs.addForm.resetFields()
    },
    // 添加参数
    addParam(){
      this.$refs.addForm.validate((valid) => {
        if (!valid) return

        postParam(this.cateId,this.addForm.attr_name,this.activeName)
        .then(res => {
          if(res.meta.status !== 201){
            return this.$message.error('添加属性失败')
          }
          
          this.$message.success('添加属性成功')
          this.getParamData()
          this.addParamDialogVisible = false
        })
      });
    },
    // 监听修改参数对话框关闭
    editFormClose(){
      this.$refs.editForm.resetFields()
    },
    // 点击按钮，修改参数
    editParam(){
      this.$refs.editForm.validate((valid) => {
        if (!valid) return
      putParams(this.cateId, this.editForm.attr_id,this.editForm.attr_name,this.activeName)
      .then(res => {
        if(res.meta.status !== 200){
          return this.$message.error('修改参数名称失败')
        }
        this.$message.success('修改参数名称成功')
        this.getParamData()
        this.editParamDialogVisible = false
      })
      })
    },
    // 获取修改参数数据
    editDialogShow(attrId){
      getEditAttr(this.cateId, attrId, this.activeName)
      .then(res => {
        if(res.meta.status !== 200){
          return this.$message.error('添加属性失败')
        }
        this.editForm = res.data
        this.editParamDialogVisible = true
      })
    },
    // 删除参数
    deleteParams(attrid){
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(() => {
         deleteAttr(this.cateId, attrid)
         .then(res => {
          if(res.meta.status !== 200){
            return this.$message.error('删除参数失败')
          }
          
          this.$message({
           type: 'success',
           message: '删除成功!'
          });
          this.getParamData()
         })
       }).catch(() => {
         this.$message({
           type: 'info',
           message: '已取消删除'
         });          
       });
    },
    // 动态编辑标签失去焦点或按下enter键显示按钮
    handleInputConfirm(row){
      // this.inputVisible = false
      // 去掉空格后长度为0，说明没有输入
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 输入了字符串
      row.attr_vals.push(row.inputValue)
      this.saveAttr(row)
      row.inputVisible = false
      row.inputValue = ''
    },
    // 发送数据请求，修改参数属性值
    saveAttr(row){
      putAttr(this.cateId, row.attr_id, row.attr_name, this.activeName, row.attr_vals.join(' '))
      .then(res => {
        if(res.meta.status !== 200){
          return this.$message.error('添加属性失败')
        }
        this.$message.success('添加属性成功')
      })
    },
    // 按下按钮，显示输入框
    showInput(row){
      row.inputVisible = true
      this.$nextTick(_ => {
         this.$refs.saveTagInput.$refs.input.focus();
       });
    },
    // 删除属性
    handleClose(index,row){
      row.attr_vals.splice(index, 1)
      this.saveAttr(row)
    }
  }
}
</script>
<style scoped>
.opt {
  margin: 15px 0;
}

.el-cascader {
  margin-left: 15px;
}

.el-tag {
  margin: 0 15px 15px;
}

.input-new-tag {
  width: 120px;
}
</style>