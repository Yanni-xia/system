<template>
  <div>
    <!-- 头部面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="消息提示的文案" type="info" center show-icon> </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab标签区域 -->
      <!-- 表单 -->
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addRules"
        label-width="80px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, i) in manyTabData"
              :key="item.attr_id"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item"
                  v-for="(item, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item1.attr_name"
              v-for="(item1, indey) in onlyTabData"
              :key="item1.attr_id"
            >
              <el-input v-model="item1.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersToken"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btn" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="picPreviewVisible" width="50%">
      <img :src="picPreview" alt="" class="preview-img" />
    </el-dialog>
  </div>
</template>
<script>
import { getCateData, getCateAttr,postGoods } from "network/goods";

import _ from 'lodash'

export default {
  name: "GoodsAdd",
  components: {},
  data() {
    return {
      // 步骤条激活
      activeIndex: "0",
      // 绑定的表单数据
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      // 表单验证规则
      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      },
      // 分类列表
      cateList: [],
      // 级联选择器属性
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 保存动态参数数据
      manyTabData: [],
      // 保存静态属性数据
      onlyTabData: [],
      // 图片上传路径
      uploadURL: "https://www.liulongbin.top:8888/api/private/v1/upload",
      // 请求头token
      headersToken: {
        Authorization: window.sessionStorage.getItem("token")
      },
      // 保存图片预览URL
      picPreview: "",
      // 图片预览对话框显示与隐藏
      picPreviewVisible: false
    };
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    getCateList() {
      getCateData().then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取分类商品列表失败");
        }

        this.cateList = res.data;
      });
    },
    // 级联选择器选择商品分类
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 商品分类未选择阻止tabs标签页跳转
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // tabs切换触发
    tabClick() {
      if (this.activeIndex === "1") {
        getCateAttr(this.cateId, "many").then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error("获取动态参数列表失败");
          }
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length !== 0 ? item.attr_vals.split(" ") : [];
          });
          this.manyTabData = res.data;
          console.log(this.manyTabData);
        });
      } else if (this.activeIndex === "2") {
        getCateAttr(this.cateId, "only").then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error("获取动态参数列表失败");
          }
          this.onlyTabData = res.data;
          console.log(this.onlyTabData);
        });
      }
    },
    // 图片上传预览操作
    handlePreview(file) {
      this.picPreview = file.response.data.url;
      this.picPreviewVisible = true;
    },
    // 图片预览删除操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex(item => {
        return item.pic === filePath;
      });
      this.addForm.pics.splice(i, 1);
    },
    // 图片上传成功
    uploadSuccess(response) {
      // 1.图片路径对象
      const picObj = { pic: response.data.tmp_path };
      // 2.把对象push到表单对象去
      this.addForm.pics.push(picObj);
    },
    // 添加商品
    add() {
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          this.$message.error('请填写必要信息')
        } 

        const form = _.cloneDeep(this.addForm)

        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTabData.forEach(item => {
          const newInfo = { 
            attr_id : item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
          this.onlyTabData.forEach(item => {
          const newInfo = { 
            attr_id : item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // 添加商品
        postGoods(form)
        .then(res => {
          if (res.meta.status !== 201) {
            return this.$message.error("添加商品失败");
          }
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
          this.getCateList();
        })

      });
    }
  }
};
</script>
<style scoped>
.el-steps {
  margin: 15px 0;
}
.el-step__main .el-step__title {
  font-size: 13px !important;
}

.preview-img {
  width: 100%;
}

.btn {
  margin-top: 15px;
}
</style>
