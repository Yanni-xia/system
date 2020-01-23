<template>
  <div id="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="login-logo">
        <img src="~assets/img/login/logo.png" alt="">
      </div>
      <!-- 表单区域 -->
      <el-form label-width="0px" class="login-form" ref="loginRef" :model="loginForm" :rules="loginRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima"  v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login-btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>        
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { loginPost } from 'network/login'
import originAxios from 'axios'

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      // 双向绑定输入内容
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 校验规则
      loginRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置
    reset(){
      this.$refs.loginRef.resetFields()
    },
    // 预验证
    login(){
      this.$refs.loginRef.validate((valid)=>{
        if(!valid) return
        loginPost(this.loginForm)
        .then(res=>{
          if(res.meta.status !==200) return this.$message.error('登录失败')
          this.$message.success('登录成功')       
          // 保存token  
          window.sessionStorage.setItem('token',res.data.token)
          // 跳转到首页
          this.$router.push('/home')
        })
        
      })
    }
  }
}
</script>
<style scoped>
#login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  border-radius: 3px;
  background-color: #f8f8f8;

  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}

.login-logo {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background-color: #f8f8f8;
  border: 1px solid #eee;
  padding: 10px;
  background-color: #fff;

  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
}

.login-logo img {
  height: 100%;
  width: 100%;
  border: 1px solid #eee;
  border-radius: 50%;
}

.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
}

.login-btn {
  display: flex;
  justify-content: flex-end;
}
</style>