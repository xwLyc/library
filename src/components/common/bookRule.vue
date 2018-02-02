<template lang="pug">
    section.ruleBox(v-show="ruleBox")
        .ruleContent
            .ruleA
                img.rule1(src="../../../static/img/rule1.png")
                img.rule_close(src="../../../static/img/rule_close.png" @click="ruleClose")
                .ruleTop
                    img(src="../../../static/img/rule2.png" v-show="todayLearn")
                    img(src="../../../static/img/rule2.png" v-show="!todayLearn")
                    span.ruleDay {{longestContinuousRecordDays}} 
                .ruleMain
                    .ruleMLeft.fl
                        img(src="../../../static/img/rule_day.png")
                    .ruleMRight.fl
                        .ruleRText
                            p.t1 
                                | 连续打卡
                                span 1
                                | 天的奖励
                            p.t2 5-10岁宝贝免费领取价值219元外教课
                            a.t3.complete(v-show="complete1" href="http://un.koolearn.com/alliance/click?userid=ff8080815b891434015b891434790000&utm_item=%E5%BE%AE%E4%BF%A1%E6%B4%BB%E5%8A%A8-%E7%BB%98%E6%9C%AC%E6%89%93%E5%8D%A1%E7%AC%AC%E4%B8%80%E5%A4%A90%E5%85%83&kid=6e8ab0b0074f4f648f3893a244ff69f2&url=https%3A%2F%2Fdonut.koolearn.com%2Fapp%2FonlineClassSchool1.html%3Futm_source%3Dwx1-Reading0-1") 点击领取
                            p.t3.noComplete(v-show="!complete1") 未完成
                        .ruleRText
                            p.t1 
                                | 连续打卡
                                span 7
                                | 天的奖励
                            p.t2 免费领取70本海尼曼电子书
                            p.t3.complete(v-show="complete7" @click="toAwrad(7)") 点击领取
                            p.t3.noComplete(v-show="!complete7") 未完成
                        .ruleRText
                            p.t1 
                                | 连续打卡
                                span 14
                                | 天的奖励
                            p.t2 免费领取150集英文动画片
                            p.t3.complete(v-show="complete14" @click="toAwrad(14)") 点击领取
                            p.t3.noComplete(v-show="!complete14") 未完成
                        .ruleRText
                            p.t1 
                                | 连续打卡
                                span 21
                                | 天的奖励
                            p.t2 免费领取价值599元外教课
                            p.t3.complete(v-show="complete21" @click="toAwrad(21)") 点击领取
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
                complete1: false,
                complete7: false,
                complete14: false,
                complete21: false,
            }
        },
        mounted(){

            if(this.longestContinuousRecordDays>=1){
                this.complete1 = true
            }
            if(this.longestContinuousRecordDays>=7){
                this.complete7 = true
            } 
            if(this.longestContinuousRecordDays>=14){
                this.complete14 = true
            } 
            if(this.longestContinuousRecordDays>=21){
                this.complete21 = true
            }
        },
        methods:{
            ruleClose(){
                this.$store.commit('ruleBox', false);
            },
            toAwrad(day){
                this.$store.commit('timeContinue', day);
                this.$router.push({name:'bookAward'});
            },
        },
        computed:{
            ...mapState({
                ruleBox: state => state.ruleBox,
                todayLearn: state => state.user.todayLearn,
                continuousRecordDays: state => state.user.continuousRecordDays,
                longestContinuousRecordDays: state => state.user.longestContinuousRecordDays,
            }),
        },
        watch:{
            longestContinuousRecordDays(){

                if(this.longestContinuousRecordDays>=1){
                    this.complete1 = true
                } 
                if(this.longestContinuousRecordDays>=7){
                    this.complete7 = true
                } 
                if(this.longestContinuousRecordDays>=14){
                    this.complete14 = true
                } 
                if(this.longestContinuousRecordDays>=21){
                    this.complete21 = true
                }
            }
        }
    }
</script>

