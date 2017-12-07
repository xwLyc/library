<template lang="pug">
    section.audioBox.tac
        .audioBtn.audioBtn1(ref="audioImg1")
            a(href="javascript:;" @click="audio1" )
                img( :src="source1" v-bind:src1="true")   
            audio( :src="audioSrc.audio" ref="audio1")
            //- p 原版读音
        .audioBtn.audioBtn2.pos_r(ref="audioImg2")
            a(href="javascript:;" @click="audio2")
                img( :src="source2" v-bind:src2="true")     
            .ani(v-show="!src2")
                .circleProgress_wrapper
                    .wrapper.right
                        .circleProgress.rightcircle(ref="nana1")
                    .wrapper.left
                        .circleProgress.leftcircle(ref="nana2")
            //- p 点击录音
        .audioBtn.audioBtn3(ref="audioImg3")
            a(href="javascript:;" @click="audio3" )
                img( :src="source3" v-bind:src3="-1")     
            //- p 宝贝读音  


        .guideBox(v-show="guideBox")
            .guide1(v-show="guide1" @click="guideBox1")
                img(src="../../../static/img/guide1.png" ref="guideImg1")
            .guide2(v-show="guide2" @click="guideBox2")
                img(src="../../../static/img/guide2.png" ref="guideImg2")
            .guide3(v-show="guide3" @click="guideBox3")
                img(src="../../../static/img/guide3.png" ref="guideImg3")
</template>
<script>
    import src1Play from '../../../static/img/icon1.png';
    import src1Playing from '../../../static/img/icon5.png';
    import src2Play from '../../../static/img/icon4.png';
    import src2Playing from '../../../static/img/icon3.png';
    import src3Playno from '../../../static/img/icon2.png';
    import src3Play from '../../../static/img/icon3.png';
    import src3Playing from '../../../static/img/icon6.png';



    export default{
        props:['audioSrc'],
        data(){
            return{
                // src1:true,
                // src2:true,
                // src3:'-1',
                guideBox:true,
                guide1:true,
                guide2:false,
                guide3:false,
                localId: '',
                isiOS:false
            }
        },
        created(){
            let u = navigator.userAgent;
            let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            this.isiOS = isiOS;
            // alert("offsetWidth: "+this.$refs.audioImg1.offsetWidth);
            // alert("offsetHeight: "+this.$refs.audioImg1.offsetHeight);
            this.$wechat.ready( () => {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                if(!localStorage.rainAllowRecord || localStorage.rainAllowRecord !== 'true'){
                    this.$wechat.startRecord({
                        success: () => {
                            localStorage.rainAllowRecord = 'true';
                            this.$wechat.stopRecord();
                        },
                        cancel: () => {
                            alert('用户拒绝授权录音');
                        }
                    });
                }
            });

          
            this.$root.$on('stopAudio',()=>{
                this.$store.commit('src1',true);
                this.$store.commit('src2',true);
                this.$store.commit('src3',true);
                this.stopAudio();
            })
        },
        mounted(){
            if(this.firstLearn){
                let imgTop1 = this.$refs.audioImg1.offsetTop;
                let imgTop2 = this.$refs.audioImg2.offsetTop;
                let imgTop3 = this.$refs.audioImg3.offsetTop;
                this.$refs.guideImg1.style.top = imgTop1+"px";
                this.$refs.guideImg2.style.top = imgTop2+"px";
                this.$refs.guideImg3.style.top = imgTop3+"px";
                this.guideBox = true;
            }else{
                this.guideBox = false;
            }
            this.localId = this.$store.state.audioId[this.$store.state.page.curPage-1];

        },
        methods:{
            audio1(){
                let getAudio = this.$refs.audio1;
                // console.log(this.$refs)
                if(this.src1&&this.src2&&this.src3){
                    this.$store.commit('src1',false);
                    getAudio.play();
                    let end = ()=>{
                        this.$store.commit('src1',true);
                        getAudio.removeEventListener('ended',end);
                    }
                    getAudio.addEventListener('ended',end);
                  
                }
            },
            audio2(){
                if(this.src2&&this.src1&&this.src3){

                    let time = this.audioSrc.duration+1;
                    let that = this;
                    // that.localId = '';
                    this.$wechat.startRecord({
                        success: ()=> {
                            that.$store.commit('src2',false);
                            if(this.isiOS){
                                that.aniTime(time+0.5);
                            }else{
                                that.aniTime(time);
                            }
                            // alert('开始录音成功回调');
                            let timeOut = setTimeout(()=>{
                                that.$store.commit('src2',true);
                                clearTimeout(timeOut);
                            }, time*1000);
                        }
                    });
                }
                
            },
            audio3(){
                if(this.src3>-1&&this.src2&&this.src1){
                    if (!this.localId) {
                        alert('没有录音，请重新录音');
                    }else{
                        if(this.src3){
                            // this.src3 = false;
                            this.$store.commit('src3',false);
                            let curPagelocalId = this.$store.state.audioId[this.$store.state.page.curPage-1];
                            this.$wechat.playVoice({
                                localId: curPagelocalId// 需要播放的音频的本地ID，由stopRecord接口获得
                            });
                            this.$wechat.onVoicePlayEnd({
                                success:  (res)=> {
                                    this.$store.commit('src3',true);
                                }
                            });
                        }
                        
                    }
                }
            },
            aniTime(time){
                this.$refs.nana1.style.animationDuration = time+"s";
                this.$refs.nana2.style.animationDuration = time+"s";
                this.$refs.nana1.style.webkitAnimationDuration = time+"s";
                this.$refs.nana2.style.webkitAnimationDuration = time+"s";
            },
            stopAudio(){
                this.$wechat.stopVoice({
                    localId: this.$store.state.audioId[this.$store.state.page.curPage-1]// 需要停止的音频的本地ID，由stopRecord接口获得
                });
                this.$wechat.stopRecord({
                    success:  (res)=> {
                        // var localId = res.localId;
                    }
                });
            },
            guideBox1(){
                this.guide1 = false;
                this.guide2 = true;
            },
            guideBox2(){
                this.guide2 = false;
                this.guide3 = true;
            },
            guideBox3(){
                this.guide3 = false;
                this.guideBox = false;
            }
        },
        watch:{
            src2(val, oldVal){
                if(val==true&&oldVal==false){
                    this.$store.commit('src3',true);
                    this.$wechat.stopRecord({
                        success:  (res)=> {
                            this.localId = res.localId;
                            let i = this.$store.state.page.curPage-1;

                            let data ={};
                            data.index = i;
                            data.audioId =this.localId;
                            this.$store.commit('audioId',data);
                            // this.src3 = 1;
                            

                            // console.log("设置localId: "+this.localId)
                            // console.log(this.$store.state.audioId)
                        }
                    });
                }
            }
        },
        computed:{
            source1(){
                return this.src1 == true ? src1Play : src1Playing
            },
            source2(){
                return src2Play
            },
            source3(){
                return this.src3 == "-1" ? src3Playno : this.src3 == 1 ? src3Play : src3Playing
            },
            src1(){
                return this.$store.state.src.src1
            },
            src2(){
                return this.$store.state.src.src2
            },
            src3(){
                return this.$store.state.src.src3
            },
            firstLearn(){
                return this.$store.state.user.firstLearn
            }
        }
    }
</script>
<style lang="scss">

</style>

