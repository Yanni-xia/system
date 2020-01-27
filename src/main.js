import Vue from 'vue'
import App from './App.vue'
import router from './router'
import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import iView from 'iview'
// 下拉表格
import table from 'vue-table-with-tree-grid'
 
Vue.component('TableTree', table)

import 'commons/plugins/element'

import 'element-ui/lib/theme-chalk/index.css';
import 'iview/dist/styles/iview.css' 




Vue.use(iView)

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

FastClick.attach(document.body)
// 使用图片懒加载插件
Vue.use(VueLazyLoad)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
