<template lang="pug">
    .bookIntroduce.wp100.hp100
        v-book-back
            p(slot="back" @click="toBack") 主页
        section.introduceTop.ofh
            .inLeft.fl.pos_r
                img.bookFm(:src="fmImg")
                img.bookMark2(src="../../static/img/bookmark2.png")
            .bookTitle.fl
                h1 {{bookTitle}}
                .dctm
                    span.bookWords 单词数: {{bookWords}}
                    span.bookTime 预计学习时长: {{bookTime}}分钟
                a.startRead(@click="toLink") 开始阅读
        section.introduceMain
            .top.ofh
                h3 学习目标
                .ci.mgt20
                    span.disc
                    span.name 关键词
            .main.ofh
                .ciText {{knowledge_words}}
                .ci
                    span.disc
                    span.name 句式
                .ciText {{knowledge_grammar}}

        .noNum(v-show="noNum" @click="closeNum")
            img(src="../../static/img/twoNum.png")
            div.colse(@click="closeNum")
</template>

<script>
    import vBookBack from '@/components/common/bookBack.vue'
    import {
        URL_WEBSITE,
        API
    } from "../store"
    
    export default {
        data() {
            return {
                URL_WEBSITE: URL_WEBSITE,
                fmImg: '',
                bookTitle: '',
                bookWords: '',
                bookTime: '',
                knowledge_words: '',
                knowledge_grammar: '',
                product: true,
                booklist: '',
                noNum: false,
                cishu: true
            }
        },
        created() {
            // wx.hideAllNonBaseMenuItem();
            let bookID = this.$store.state.bookIntroductId;
            if (bookID == "") {
                this.toBack();
            } else {
                this.$http.get(API + '/book', {
                    params: {
                        _id: bookID
                    }
                }).then((res) => {
                    // console.log(res)
                    let data = res.data.data;
                    this.fmImg = URL_WEBSITE + data.coverImg;
                    this.bookTitle = data.name;
                    this.bookWords = data.words;
                    this.bookTime = data.time;
                    this.knowledge_words = data.knowledge_words;
                    this.knowledge_grammar = data.knowledge_grammar;
    
                    this.$store.commit('bookTitle', data.name);
                    this.$store.commit('fmImg', URL_WEBSITE + data.coverImg);
                });
                this.$http.get(API + '/user/book', {
                    params: {
                        book_id: bookID,
                        userId: "5954d8aaf4d93c25be241e36" //上线时 注释掉
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.data.code == 0) {
                        if (res.data.data.length == 0) {
                            this.product = false;
                        } else {
                            this.product = true;
                            this.booklist = res.data.data;
                        }
                    }
                });
    
                //获取用户今日登陆次数
                this.$http.get(API + '/user/today_count').then(res => {
                    console.log(res);
                    if (res.data.todayCount >= 2) {
                        this.cishu = false;
                    }
                })
    
            }
    
        },
        methods: {
            toLink(){
                if(this.cishu){
                this.$router.replace({path:'/bookRecording'})
                }else{
                this.noNum = true;
                }
            },
            toBack(){
                this.$router.replace({path:'/home'})
            },
            share(id,time){
                this.$store.commit('bookAudioId',id);
                this.$store.commit('headTime',time);
                this.$router.replace({path:'/bookShare'})
            },
            closeNum(){
                this.noNum = false;
            }
        },
        computed:{
            headimgurl(){
                return this.$store.state.user.headimgurl
            },
            nickname(){
                return this.$store.state.user.nickname
            }
        },
        components: {
            vBookBack
        }
    }
</script>

<style lang="scss">
    @import '../../static/scss/book.scss';
</style>

