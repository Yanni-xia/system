<template>
  <div>
    <!-- 头部面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索输入框 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearValue">
            <el-button slot="append" icon="el-icon-search" @click="serch" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="120px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time " width="160px">
          <template slot-scope="scope">
            {{scope.row.add_time | converDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px"> 
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeById(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
       <el-pagination
        @size-change="handleSizeChange" background
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[8, 10, 12, 14]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getGoodsList,deleteGoods } from 'network/goods'

export default {
  name: 'GoodsList',
  components: {},
  data() {
    return {
      // 查询商品列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 总条数
      total: 0
    }
  },
  created(){
    this.getGoodsListData(this.queryInfo)
  },
  methods: {
    getGoodsListData(data){
      getGoodsList(data)
      .then(res => {
        if(res.meta.status !== 200){
          return this.$message.error('获取商品列表数据失败')
        }
        
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    // 页数改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getGoodsListData(this.queryInfo)
    },
    // 页码改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getGoodsListData(this.queryInfo)
    },
    // 关键字搜索
    serch(){
      this.getGoodsListData(this.queryInfo)
    },
    // 清空关键字重新请求数据
    clearValue(){
      this.getGoodsListData(this.queryInfo)
    },
    // 删除商品列表
    removeById(row){
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGoods(row.goods_id)
          .then(res => {
            if(res.meta.status !== 200){
              return this.$message.error('删除商品失败')
            }
            this.getGoodsListData(this.queryInfo)
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
    // 点击添加商品按钮，跳转页面
    goAddGoodsPage(){
      this.$router.push('/goods/add')
    }
  },
  
}
</script>
<style scoped>
</style>