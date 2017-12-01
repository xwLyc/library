<template lang="pug">
    section.ruleBox(v-show="ruleBox")
        .ruleContent
            .ruleA
                img.rule1(src="../../../static/img/rule1.png")
                img.rule_close(src="../../../static/img/rule_close.png" @click="ruleClose")
                .ruleTop
                    img(src="../../../static/img/rule2.png" v-show="todayLearn")
                    img(src="../../../static/img/rule2.png" v-show="!todayLearn")
                    span.ruleDay {{continuousDays}} 
                .ruleMain
                    .ruleMLeft.fl
                        img(src="../../../static/img/rule_day.png")
                    .ruleMRight.fl
                        .ruleRText
                            p.t1 
                                | 连续打卡
                                span 7
                                | 天的奖励
                            p.t2 免费领取70本海尼曼有声书
                            p.t3.complete(v-show="complete7" @click="toAwrad") 点击领取
                            p.t3.noComplete(v-show="!complete7") 未完成
                        .ruleRText
                            p.t1 
                                | 连续打卡
                                span 14
                                | 天的奖励
                            p.t2 免费领取150部英文动画片
                            p.t3.complete(v-show="complete14" @click="toAwrad") 点击领取
                            p.t3.noComplete(v-show="!complete14") 未完成
                        .ruleRText
                            p.t1 
                                | 连续打卡
                                span 21
                                | 天的奖励
                            p.t2 免费领取原版英文绘本实体书
                            p.t3.complete(v-show="complete21" @click="toAwrad") 点击领取
                            p.t3.noComplete(v-show="!complete21") 未完成

                .ruleBottom
                    .ruleDescribe   
                        h2 — 如何打卡 —
                        ul
                            li 每天完成宝贝绘本录制，并分享到朋友圈，即可完成当日打卡
                            li 一天多学只算做一天打卡
                            li 打卡不可中断，中断后将从0开始计算
                    p.owner 此活动最终解释权归多纳所有
</template>

<script>

    import { mapState } from 'vuex'
    export default {
        data(){
            return{
                complete7: false,
                complete14: false,
                complete21: false,
            }
        },
        mounted(){
            if(this.longestContinuousDays>=7){
                this.complete7 = true
            }else if(this.longestContinuousDays>=14){
                this.complete14 = true
            }else if(this.longestContinuousDays>=21){
                this.complete21 = true
            }
        },
        methods:{
            ruleClose(){
                this.$store.commit('ruleBox', false);
            },
            toAwrad(){
                this.$router.replace({path:'/bookAward'});
            }
        },
        computed:{
            ...mapState({
                ruleBox: state => state.ruleBox,
                todayLearn: state => state.user.todayLearn,
                continuousDays: state => state.user.continuousDays,
                longestContinuousDays: state => state.user.longestContinuousDays,
            }),
        },
        watch:{
            longestContinuousDays(){

                if(this.longestContinuousDays>=7){
                    this.complete7 = true
                }else if(this.longestContinuousDays>=14){
                    this.complete14 = true
                }else if(this.longestContinuousDays>=21){
                    this.complete21 = true
                }
            }
        }
    }
</script>

