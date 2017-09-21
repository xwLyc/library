<template lang="pug">
  .bookShare.wp100.hp100
        loading
        v-book-back(v-show="!isShare")
            p(slot="back" @click="toBack") 返回
   
        .iconXDF(v-show="isShare")
            img(src="../../static/img/shareTop.png")
        .baby
            p.headImg.fl
                img(:src="headimgurl")
            img.hText.fl(src="../../static/img/shareTop2.png")

        section.picBox.pos_r
            img.wp100(src="../../static/img/shareAudioBg.png")
            .picContent
                img.wp100(:src="pic")
            .picFolow(v-show="playActive")
                img.wp100(src="../../static/img/shareAudioCeng.png")
            img.picAudioBtn(src="../../static/img/shareAudioPlay.png" v-show="playActive" @click="audioPlay")
            //- audio(:src="bookAudio" ref="bookSourceAudio")
        //- section.textBox
        //-     .textStyle.fontComic
        //-         p {{content}}

        section.ewmBox.pos_r
            img(src="../../static/img/shareBottom.png")
            //- p.headImg
            //-     img(:src="headimgurl")
            //- p.headName {{nickname}}
            //- p.headTime {{headTime}}
</template>

<script>
    import vBookBack from '@/components/common/bookBack.vue'
    export default {
        data() {
            return {

                playActive: true,
                curSource: '',
                // bookSource:'',
                pic:'',
                objAudio:'',
                bookAudio:'',
                content:'',
                bookSourceIndex:0,
                isShare:false,
                winURL:'',
            }
        },
        mounted() {
            
            // this.SDKRegister(this);

            let shareId ;
            let fmImg;
            let user;
            let headimgurl;
            let bookTitle;
            let userId;
            let url = window.location;

            let userSouceId ;
            let bookAudioId = this.$store.state.bookAudioId ;
            // let bookID = this.$store.state.bookIntroductId;



            if (!bookAudioId) {    //再次分享的作品
                // userSouceId = url.search.substr(url.search.indexOf('userSouceId=')+12,24); 
                this.isShare = true;
                let shareInfo = url.search.split("&");
                shareId =  shareInfo[0].split('=')[1];
                //要分享的连接
                this.winURL = url.href.split("?")[0] + "?shareId=" + shareId + "#/bookShare";
                
                this.$http.get(this.API + '/share_param', {
                    params: {
                        _id: shareId
                    }
                }).then(res => {
                    if(res.data.code == 0){
                        let data = JSON.parse(res.data.params);
                        console.log(data)
                        fmImg = data.fmImg;
                        bookTitle = data.bookTitle;
                        userSouceId = data.userSouceId;
                        user = data.user;
                        headimgurl = data.headimgurl;
                        userId = data.userId;
                        this.$store.commit('user',{
                            nickname:user,
                            headimgurl:headimgurl
                        });
                        this.getSource(userSouceId,userId);
                        this.shareWx(this.winURL,user,fmImg,bookTitle);
                    }

                })

            }else{                 //自己的作品
                
                if(!this.bookAudioId){
                    this.toBack();
                }
                userSouceId = bookAudioId;
                fmImg = this.$store.state.fmImg;
                user = this.$store.state.user.nickname;
                headimgurl = this.$store.state.user.headimgurl;
                bookTitle = this.$store.state.bookTitle;
                userId = this.$store.state.user.userId;
                this.getSource(userSouceId,userId);
                
                let data ={
                    'fmImg':fmImg,
                    'user':user,
                    'headimgurl':headimgurl,
                    'userId':userId,
                    'userSouceId':userSouceId,
                }
                this.$http.post(this.API + '/share_param',{
                    params: JSON.stringify(data)
                }).then(res => {
                    // alert(JSON.stringify(res));
                    shareId = res.data._id;
                    //要分享的连接
                    this.winURL = url.href.split("?")[0] + "?shareId=" + shareId + "#/bookShare";

                    this.shareWx(this.winURL,user,fmImg,bookTitle);
                })
            }

           
            
            
            
            
        },
        methods: {
            audioPlay() {
                this.objAudio = new Audio();
                let getAudio  = this.objAudio;
                getAudio.src = this.bookAudio;
                this.playActive = false;
                
                getAudio.play();
                console.log(getAudio)
                let nextPlay = ()=>{
                    this.bookSourceIndex++;
                    if(this.bookSourceIndex<this.bookSource.length){ 
                        this.setBookSource(this.bookSourceIndex);
                        setTimeout(()=>{
                            console.log(getAudio)
                            getAudio.src = this.bookAudio;
                            getAudio.play();
                        },100) 
                    }else{
                        this.bookSourceIndex = 0;
                        this.playActive = true;
                        this.setBookSource(this.bookSourceIndex);
                        getAudio.pause();
                        getAudio.removeEventListener('ended',nextPlay)
                    }
                }
                getAudio.addEventListener('ended',nextPlay);          


            },
            loadImage(url) {    
                let img = new Image(); //创建一个Image对象，实现图片的预下载    
                img.onload = function(){
                    img.onload = null;
                    // callback(img);
                }
                img.src = url;
            },
            toBack(){
                if(this.objAudio){
                    this.objAudio.pause();
                }
                this.$router.replace({path:'/bookIntroduce'});

            },

            getSource(userSouceId,userId){
                 this.$http.get(this.API + '/user/book', {
                    params: {
                        _id: userSouceId,
                        userId : userId
                    }
                }).then(res => {

                    if (res.data.code == 0) {
                        // this.bookSource = res.data.data.sentenceAudio;
                        let sData = res.data.data;
                        this.$store.commit('bookSource',sData.sentenceAudio);
                        this.$store.commit('headTime',sData.createdAt);
                        sData.sentenceAudio.map((e)=>{
                            this.loadImage(e.pic);
                        })
                        this.bookSourceIndex = 0;
                        this.setBookSource(0);
                        this.$store.commit("loading",false);
                    }   
                });
            },
            
            setBookSource(index){
                this.pic = this.URL_WEBSITE+this.bookSource[index].pic;
                this.content = this.bookSource[index].content;
                this.bookAudio = this.URL_WEBSITE+this.bookSource[index].audio;
            },
            shareWx(urlwx,user,fmImg,bookTitle){
                this.$wechat.ready(()=>{
                    // alert("分享链接urlwx: "+ urlwx);
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    this.$wechat.hideAllNonBaseMenuItem();
                    this.$wechat.showMenuItems({
                        menuList: ['menuItem:share:appMessage','menuItem:share:timeline'] // 要显示的菜单项
                    });
                    this.$wechat.onMenuShareTimeline({
                        title: '快来听，'+user+'完成了很棒的绘本作品，邀请你和宝贝一起参加', // 分享标题
                        link: urlwx, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: fmImg, // 分享图标
                        success: () => { 
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: () => { 
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    this.$wechat.onMenuShareAppMessage({
                        title: '快来听，'+user+'完成了很棒的绘本作品。', // 分享标题
                        desc: user+'大声朗读了绘本《'+bookTitle+'》，邀请你和宝贝一起参加', // 分享描述
                        link: urlwx, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: fmImg, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: () => { 
                            // 用户确认分享后执行的回调函数
                            // alert('分享成功：' +urlwx)
                        },
                        cancel: () => { 
                            // 用户取消分享后执行的回调函数
                        }
                    });
                });
                this.$wechat.error((res)=>{
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                    alert("错误："+JSON.stringify(res))
                });
            }
        },
        computed: {
            headimgurl() {
                return this.$store.state.user.headimgurl
            },
            nickname() {
                return this.$store.state.user.nickname
            },
            userId() {
                return this.$store.state.user.userId
            },
            headTime() {
                return this.$store.state.headTime
            },
            bookAudioId() {
                return this.$store.state.bookAudioId
            },
            bookSource() {
                return this.$store.state.bookSource
            }
        },
        components:{
            vBookBack
        },
    }
</script>

<style lang="scss">
    @import '../../static/scss/book.scss';
</style>
