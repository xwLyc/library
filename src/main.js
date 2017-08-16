// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Axios from 'axios'
import wx from 'weixin-js-sdk'
import VueAwesomeSwiper from 'vue-awesome-swiper'


Vue.use(VueAwesomeSwiper, wx);
Vue.prototype.$http = Axios;
//图片预加载
Vue.prototype.$preLoadImg = (url, callback) => {  
    let img = new Image();
    img.onload = () => {
      img.onload = null;  //解决内存泄漏，动态图片的加载问题
      if(callback){
        callback(img);
      }
    }
    img.src = url;
}


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
