<template>
    <el-container class="home-container">
      <!-- 头部 -->
      <el-header>
        <div>
          <img src="~assets/img/home/heima.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="exit">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse? '64px': '200px'">
          <div class="toggle" @click="toggleClick">|||</div>
          <el-menu background-color="#333744" text-color="#fff" unique-opened router
                  :collapse="isCollapse" :collapse-transition="false" :default-active="activePath"> 
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id" >
              <template slot="title">
                <i :class="icon[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/'+ subItem.path" v-for="subItem in item.children" :key="subItem.id" 
                            @click="activeClick('/'+ subItem.path)">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.authName}}</span>
                  </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
    
</template>
<script>
import { homeData } from 'network/home'

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      menuList: [],
      icon: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created(){
    homeData()
    .then(res => {
      this.menuList = res.data
    })

    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击退出按钮
    exit(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 点击折叠菜单栏
    toggleClick(){
      this.isCollapse = !this.isCollapse
    },
    // 高亮菜单刷新保持高亮
    activeClick(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}
.el-header div {
  display: flex;
  align-items: center;
}

.el-header .el-button {
  margin-right: 10px;
}

.el-header span {
  color: #fff;
  font-size: 20px;
  padding-left: 10px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1
}

.el-submenu i {
  padding-right: 5px;
}

.el-menu {
  border-right: 0;
}

.toggle {
  text-align: center;
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>