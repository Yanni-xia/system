import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import FastClick from "fastclick";
import VueLazyLoad from "vue-lazyload";
// 下拉表格
import table from "vue-table-with-tree-grid";
// 时间格式化插件
import Moment from "moment";
// 富文本编辑器
import VueQuillEditor from "vue-quill-editor";

import "commons/plugins/element";

import "element-ui/lib/theme-chalk/index.css";
// 富文本编辑器css
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";


Vue.component("TableTree", table);

// 时间过滤器
Vue.filter("converDate", function(val) {
  return Moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
});


Vue.config.productionTip = false;


FastClick.attach(document.body);
// 使用图片懒加载插件
Vue.use(VueLazyLoad);
Vue.use(VueQuillEditor)

new Vue({
  render: h => h(App),
  router
}).$mount("#app");
