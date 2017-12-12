<template lang="pug">
    section.audioBox.tac
        //- 原版读音
        .audioBtn.audioBtn1(ref="audioImg1")
            a(:class="this.src1&&this.src2&&this.src3? 'active':''" href="javascript:;" @click="audio1" ontouchstart="")
                img( :src="src1 ? src1Play : src1Playing")   
            audio( :src="audioSrc.audio" ref="audio1")
        //-  点击录音
        .audioBtn.audioBtn2.pos_r(ref="audioImg2")
            a(:class="this.src1&&this.src3? 'active':''" href="javascript:;" @click="audio2" ontouchstart="" )
                img(:src="src2 ? src2Play: src2Playing")     
            
        //-  宝贝读音  
        .audioBtn.audioBtn3(ref="audioImg3")
            a(:class="this.src1&&this.src2&&this.src3? 'active':''" href="javascript:;" @click="audio3" ontouchstart="")
                img( :src="src3 == -1 ? src3Playno : src3 ? src3Play : src3Playing" )     


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
    import src2Playing from '../../../static/img/icon4.gif';
    import src3Playno from '../../../static/img/icon2.png';
    import src3Play from '../../../static/img/icon3.png';
    import src3Playing from '../../../static/img/icon6.png';

    import { mapState, mapActions } from 'vuex'


    export default{
        props:['audioSrc'],
        data(){
            return{
                // src1:true,
                // src2:true,
                // src3:'-1',
                src1Play: src1Play,
                src1Playing: src1Playing,
                src2Play: src2Play,
                src2Playing: src2Playing,
                src3Playno: src3Playno,
                src3Play: src3Play,
                src3Playing: src3Playing,

                guideBox:true,
                guide1:true,
                guide2:false,
                guide3:false,
                localId: '',
                cordTime: 0,    //录制时间
            }
        },
        created(){
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
                }else{
                    // alert('微信录音功能开启')
                }
            });

          
            this.$root.$on('stopAudio',()=>{
                this.$store.commit('src1',true);
                this.$store.commit('src2',true);
                // this.$store.commit('src3',true);
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
            this.localId = this.audioId[this.page.curPage-1];
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
                this.$wechat.ready(()=>{
                    if(this.src2&&this.src1&&this.src3){
                        this.$wechat.startRecord({
                            success: ()=> {
                                setTimeout(()=>{
                                    this.cordTime = 1;
                                },1000)
                                this.$store.commit('src2',false);
                            }
                        });
                    }
                    if(!this.src2&&this.src1&&this.src3){ 
                        if(this.cordTime<1){
                            alert('录制时间不得小于1s')
                        }else{
                            this.$wechat.stopRecord({
                                success:  (res)=> {
                                    this.localId = res.localId;
        
                                    let data ={};
                                    data.index = this.page.curPage-1;
                                    data.audioId =this.localId;
                                    this.$store.commit('audioId',data);
                                    // this.src3 = 1;
                                    this.$store.commit('src2',true);
                                    this.$store.commit('src3',true);
        
                                    // console.log("设置localId: "+this.localId)
                                    // console.log(this.audioId)
                                    this.cordTime = 0;
                                },
                                fail: (res)=>{
                                    alert(res)
                                }
                            });
                        }
                    }
    
                    this.$wechat.onVoiceRecordEnd({
                        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                        complete:  (res) => {
                            this.localId = res.localId; 
                            this.$store.commit('src2',true);
                            this.$store.commit('src3',true);
                        }
    
                    });
                })
                
            },
            audio3(){
                if(this.src3 != -1 &&this.src2&&this.src1){
                    if (!this.localId) {
                        alert('没有录音，请重新录音');
                    }else{
                        if(this.src3){
                            // this.src3 = false;
                            this.$store.commit('src3',false);
                            let curPagelocalId = this.audioId[this.page.curPage-1];
                            this.$wechat.ready(()=>{
                                this.$wechat.playVoice({
                                    localId: curPagelocalId// 需要播放的音频的本地ID，由stopRecord接口获得
                                });
                                this.$wechat.onVoicePlayEnd({
                                    success:  (res)=> {
                                        this.$store.commit('src3',true);
                                    }
                                });
                            })
                        }
                        
                    }
                }
            },
            stopAudio(){
                this.$wechat.ready(()=>{  
                    this.$wechat.stopVoice({
                        localId: this.audioId[this.page.curPage-1]// 需要停止的音频的本地ID，由stopRecord接口获得
                    });
                    this.$wechat.stopRecord({
                        success:  (res)=> {
                            // var localId = res.localId;
                            // console.log(this.audioId)
                            // console.log(res.localId)
                        }
                    });
                })
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
        computed:{
            ...mapState(['audioId','page']),
            ...mapState({
                firstLearn: state => state.user.firstLearn,
                src1: state => state.src.src1,
                src2: state => state.src.src2,
                src3: state => state.src.src3,
            })
        }
    }
</script>
<style lang="scss">

</style>

