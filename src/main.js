// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Axios from 'axios'
import Loading from './components/loading/loading'
import wx from 'weixin-js-sdk'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Polyfille from "babel-polyfill"


Vue.use(VueAwesomeSwiper, wx, Polyfille);
Vue.component('loading',Loading);
Vue.prototype.$http = Axios;


// //开发环境
// //默认 ?category_id=5962e63f2bc3b82e178a3878
// Vue.prototype.URL_WEBSITE = "http://test.donut.cn"; 
// Vue.prototype.API = "/api/app/library"; 

//  线上环境
Vue.prototype.API = "/app/library";     
Vue.prototype.URL_WEBSITE = "https://test.donut.cn"; 


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
//微信SDK
Vue.prototype.$wechat = wx;
Vue.prototype.SDKRegister = (that, callback) => {
  // alert(JSON.stringify(wx))
  that.$http.get(that.API + '/init?url=' + encodeURIComponent(location.href.split('#')[0])).then(function(res) {
    // console.log(res);
    if (res.status == '200' && res.data.code == 0) {
      let data = res.data.data;
      console.log(data)
      let jsApiList = ['hideAllNonBaseMenuItem','showAllNonBaseMenuItem', 'showMenuItems', 'onMenuShareTimeline', 'onMenuShareAppMessage','startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice'] 
      that.$wechat.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: jsApiList// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    }
    that.$wechat.ready(()=> {
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      wx.hideAllNonBaseMenuItem();
    });
    that.$wechat.error((res)=> {
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      alert("错误：" + JSON.stringify(res))
    });
    if(callback){
      callback.call(that);
    }
  });
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
