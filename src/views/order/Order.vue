<template>
  <div>
    <!-- 头部面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table border stripe :data="orderList">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
          width="220px"
        ></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="warning" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | converDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="addressClick"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="progressClick"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[6, 8, 10, 12]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 操作修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressClose"
    >
      <el-form
        :model="addressForm"
        :rules="addressRule"
        ref="addressFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="address1">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="addressForm.address1"
            :options="citydata"
            :props="addressProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 操作物流信息对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressList"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderData, getProgressData } from "network/order";

import citydata from "commons/citydata";

export default {
  name: "Order",
  components: {},
  data() {
    return {
      // 订单列表查询条件
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 订单列表
      orderList: [],
      // 总条数
      total: 0,
      // 修改地址对话框显示与隐藏
      addressVisible: false,
      // 表单数据对象
      addressForm: {
        address1: "",
        address2: ""
      },
      // 表单验证规则
      addressRule: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      // 省市数据
      citydata: citydata,
      // 级联选择器属性
      addressProps: {
        expandTrigger: "hover",
        value: "value",
        label: "label",
        children: "children"
      },
      // 物流进度对话框显示与隐藏
      progressVisible: false,
      // 保存物流信息
      progressList: []
    };
  },
  created() {
    this.getOrderList(this.queryInfo);
  },
  methods: {
    // 获取订单列表
    getOrderList(data) {
      getOrderData(data).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取订单数据失败");
        }

        this.orderList = res.data.goods;
        this.total = res.data.total;
      });
    },
    // 页数改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList(this.queryInfo);
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList(this.queryInfo);
    },
    // 修改地址
    addressClick() {
      this.addressVisible = true;
    },
    // 关闭修改地址对话框
    addressClose() {
      this.$refs.addressFormRef.resetFields();
    },
    // 级联选择器选项改变
    handleChange() {},
    // 物流进度对话框显示与隐藏
    progressClick() {
      this.progressVisible = true;
      getProgressData().then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取物流失败");
        }
        this.progressList = res.data;
      });
    }
  }
};
</script>
<style scoped>
.el-cascader {
  width: 100%;
}
</style>
