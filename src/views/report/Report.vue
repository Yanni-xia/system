<template>
  <div>
    <!-- 头部面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card> 
       <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from "echarts";
import _ from 'lodash'

import { getReportData } from 'network/report'

export default {
  name: "Report",
  components: {},
  data() {
    return {
      option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // 绘制图表
    getReportData()
    .then(res => {
      if(res.meta.status !== 200){
        return this.$message.error('获取报表失败')
      }

      const newOption = _.merge(res.data, this.option)
      myChart.setOption(newOption);

    })

    
  }
};
</script>
<style scoped></style>
