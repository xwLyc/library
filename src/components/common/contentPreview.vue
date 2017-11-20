<template lang="pug">
  div.pos_r
    .uploading(v-show="loading")
      img(src="../../../static/img/loading1.gif")
      p 正在上传...
    
    .shareing(v-show="share" @click="hideShare")
      img.wp100(src="../../../static/img/share.png")

    section.bookban.pos_r
        .picFolow(v-show="playActive")
          img(src="../../../static/img/icon_play.png" @click="audioPlay")
        .bookBanImg
          img.wp100.hp100(:src="curSource.pic")
        p.bookBanMark
        p.bookmtop
        p.bookPage
          span.curPage {{playIndex+1}}
          span /
          span.totalPage {{bookSource.length}}
    section.textBox
      .textStyle.fontComic
        p {{curSource.content}}



    section.createBox.pos_r
      .createBtn.tac(v-show="!fabuEnd" @click="create") 生成宝贝作品  

      .fabu.tac(v-show="fabuEnd")
        img.fabuImg1(src="../../../static/img/fabu.png")
         
</template>

<script>
  export default {
    props: ['bookSource'],
    data() {
      return {
        playActive: true,
        curSource: {},
        playIndex: 0,
        fabuEnd: false,
        uploadVIndex: 0,
        titleNext:'',
        loading:false,
        share:false,
      }
    },
    created() {
      this.curSource = this.bookSou(0);
      this.$root.$on('stopVoice',()=>{
        this.stopVoice();
      });

    },
    methods: {
      bookSou(index) {
        return this.bookSource[index]
      },
      goShare(){
        // this.$router.replace({path:'/bookShare'});
        this.share = true;
      },
      hideShare(){
        this.share = false;
      },
      audioPlay() {
        this.playActive = false;
        if (this.playIndex < this.bookSource.length) {
          this.curSource = this.bookSou(this.playIndex);
          this.$wechat.playVoice({
            localId: this.bookSou(this.playIndex).bookAudioID // 需要播放的音频的本地ID，由stopRecord接口获得
          });
          this.$wechat.onVoicePlayEnd({
            success: (res) => {
              this.playIndex++;
              this.audioPlay();
            }
          });
        } else {
          this.playActive = true;
          this.playIndex = 0;
          this.curSource = this.bookSou(this.playIndex);
        }
  
  
      },
      stopVoice(){
        this.$wechat.stopVoice({
            localId: this.bookSou(this.playIndex).bookAudioID // 需要停止的音频的本地ID，由stopRecord接口获得
        });
      } ,     
      create() {
        let bookID = this.$store.state.bookIntroductId;
        let bookSource = this.$store.state.source;
        let audioId = this.$store.state.audioId;
        let that = this;
        let sentences = [];
        that.uploadVIndex = 0;

        function uploadVoice(i) {
          that.loading = true;
          that.$wechat.uploadVoice({
            localId: audioId[i], // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: (res) => {
              let obj = {};
              obj.page = i + 1;
              obj.sentenceId = bookSource[i]._id;
              obj.serverId = res.serverId; // 返回音频的服务器端ID
              sentences.push(obj);
              if (i < audioId.length-1) {
                that.uploadVIndex++;
                uploadVoice(that.uploadVIndex);
              } 
              // alert('sentences : ' + JSON.stringify(sentences))
              // alert(sentences.length)
              if (sentences.length == audioId.length) {
                // alert('sentences : ' + JSON.stringify(sentences))
                that.$http.post(that.API + '/upload_voice', {
                  _id: bookID,
                  sentences: JSON.stringify(sentences)
                }).then((res) => {
                  that.loading = false;
                  if(res.data.code == 0){
                    that.$root.$emit('upend');
                    that.fabuEnd = !that.fabuEnd;
                    that.$store.commit('bookAudioId',res.data._id);
                    that.shareUser();
                    that.goShare();
                  }else{
                    alert("上传失败")
                  }
                })
              }
            }
          })
        }
        if(sentences==''){
          uploadVoice(that.uploadVIndex);
        }
        
  
  
      },
      shareUser(){

        let fmImg = this.$store.state.fmImg;
        let user = this.$store.state.user.nickname;
        let headimgurl = this.$store.state.user.headimgurl;
        let bookTitle = this.$store.state.bookTitle;
        let userSouceId =  this.$store.state.bookAudioId ;
        let userId =  this.$store.state.user.userId
        let url = window.location;

        let urlSite = {};
        urlSite.fmImg = fmImg;
        urlSite.user = user;
        urlSite.headimgurl = headimgurl;
        urlSite.bookTitle = bookTitle;
        urlSite.userSouceId = userSouceId;
        urlSite.userId = userId;

        this.$http.post(this.API+'/share_param',{
            params:JSON.stringify(urlSite)
          }).then(res=>{

            if(res.data.code==0){
              //分享显示
              let shareId = res.data._id;
               //要分享的连接
              let winURL = window.location.href.split("?")[0] + "?shareId=" + shareId+ "#/bookShare";
              this.$wechat.showMenuItems({
                  menuList: ['menuItem:share:appMessage','menuItem:share:timeline'] // 要显示的菜单项
              });
              this.$wechat.onMenuShareTimeline({
                  title: '快来听，'+user+'完成了很棒的绘本作品，邀请你和宝贝一起参加', // 分享标题
                  link: winURL, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                  imgUrl: fmImg, // 分享图标
                  success: function () { 
                      // 用户确认分享后执行的回调函数
                  },
                  cancel: function () { 
                      // 用户取消分享后执行的回调函数
                  }
              });
              this.$wechat.onMenuShareAppMessage({
                  title: '快来听，'+user+'完成了很棒的绘本作品。', // 分享标题
                  desc: user+'大声朗读了绘本《'+bookTitle+'》，邀请你和宝贝一起参加', // 分享描述
                  link: winURL, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                  imgUrl: fmImg, // 分享图标
                  type: '', // 分享类型,music、video或link，不填默认为link
                  dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                  success: function () { 
                      // 用户确认分享后执行的回调函数
                  },
                  cancel: function () { 
                      // 用户取消分享后执行的回调函数
                  }
              });  
            }
          })
           
        
          
      }
  
  
    }
  }
</script>


<style lang="scss">
  // @import '../../../static/scss/base.scss';
</style>
