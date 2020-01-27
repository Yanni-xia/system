<template>
  <div>
     <!-- 头部面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <table-tree :data="cateList" :columns="columns" show-index index-text="#"
                   border :show-row-hover="false" :selection-type="false" :expand-type="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="iconfont icon-lock_fill" v-if="scope.row.cat_deleted === false" style="color: lightgreen;">哈哈</i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit">编辑</el-button>
         <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </table-tree>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="cateDialogVisible"
      width="50%" @close="addCateDialogClose">
      <el-form  :model="cateForm" label-width="100px" :rules="cateRules" ref="cateFormRef" >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" >
          <el-cascader
            v-model="selectedKeys" :options="parentList" :props="cascaderProps" clearable 
            @change="selectedKeysChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCateData,postCate } from 'network/goods'

export default {
  name: 'goodsCate',
  components: {},
  data() {
    return {
      // 查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 2
      },
      // 存储商品列表数据
      cateList: [],
      // 总条数
      total: 0,
      // 表格
      columns:  [
          {
            label: '分类名称',
            prop: 'cat_name',
            // width: '400px',
          },
          // 是否有效模板
          {
            label: '是否有效',
            type: 'template',
            template: 'isoK'
          },
          // 排序
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },
          // 操作
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          },
      ],
      cateDialogVisible: false,
      // 添加分类表单数据
      cateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 表单规则
      cateRules: {
        cat_name: [
           { required: true, message: '请输入分类名称', trigger: 'blur' }
         ],
        cat_pid: [
           { required: true, message: '请输入分类名称', trigger: 'blur' },
           { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
         ],
      },
      // 存储父级分类数据
      parentList: [],
      //  级联选择器属性配置
      cascaderProps: { 
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的属性id
      selectedKeys: []
      
    }
  },
  created(){
    // 获取商品分类列表
    this.getGoodsCate(this.queryInfo)
  },
  methods: {
    // 获取商品分类列表
    getGoodsCate(data){
      getCateData(data)
      .then(res => {
        if(res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')

        this.cateList = res.data.result
        this.total = res.data.total
      })
    },
    // 监听pageSize 改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getGoodsCate(this.queryInfo)
    },
    // 监听currentPage 改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getGoodsCate(this.queryInfo)
    },
    // 添加分类提示框显示与隐藏
    showCateDialog(){
      this.cateDialogVisible = true

      this.getParentCate({type: 2})
    },
    // 获取父级分类数据
    getParentCate(data){
      getCateData(data)
      .then(res => {
        if(res.meta.status !== 200) return this.$message.error('获取父级分类列表失败')

        this.parentList = res.data
      })
    },
    // 监听分类级别改变
    selectedKeysChange(){
      // 如果selectedKeys长度不为0
      if(this.selectedKeys.length > 0){
        // 给pid赋值
        this.cateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 给level赋值
        this.cateForm.cat_level = this.selectedKeys.length 
        return
      }else {
        this.cateForm.cat_pid = 0
        this.cateForm.cat_level = 0
      }  
    },
    // 添加分类按钮确定
    addCate(){
      this.$refs.cateFormRef.validate((valid) => {
        if (!valid) return
        postCate(this.cateForm)
        .then(res => {
          if(res.meta.status !== 201){
            return this.$message.error('添加分类失败')
          }
          this.$message.success('添加分类成功')
          this.getGoodsCate(this.queryInfo)
          this.cateDialogVisible = false
        })

      });
    },
    // 监听添加分类对话框关闭事件,重置表单
    addCateDialogClose(){
      this.$refs.cateFormRef.resetFields()
      this.selectedKeys = [],
      this.cateForm.cat_pid = 0
      this.cateForm.cat_level = 0
    }
  }
}
</script>
<style scoped>
.el-row {
  margin-bottom: 10px;
}

.el-cascader {
  width: 100%;
}
</style>