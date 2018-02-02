<template lang="pug">
    .bookAward
        .backTop
            v-book-back
                p(slot="back" @click="toBack") 返回
        img(src="../../static/img/award.png")
        .linkBox
            template(v-if="timeContinue!=21")
                p
                    span 链接：
                    a(:href="timeContinue < 21?curLink : '#'") {{curLink}}
                p
                    span 密码：
                    span {{curPass}}
            template(v-else)
                p
                    span 听课链接：
                    a(href="https://wx.donut.cn/app/spell/wx/index/book_course?course=5a670e979b5669022f4f9fd5") https://wx.donut.cn/app/spell/wx/index/book_course?course=5a670e979b5669022f4f9fd5
                p
                    span 兑换码：
                    span {{curBookCode}}
                p
                    span 如何上课：
                    span 点击打开链接，输入兑换码，即可观看课程

</template>

<script>
    import { mapState } from 'vuex'
    import vBookBack from '@/components/common/bookBack.vue'
    export default {
        data(){
            return{
                curLink:'',
                curPass:'',
                curBookCode: '',
                arrLink:[
                    {
                        link:"http://pan.baidu.com/s/1gfMq5Jd",
                        password:"igfh"
                    },
                    {
                        link:"https://pan.baidu.com/s/1c1Hyjr6",
                        password:"w6q6"
                    },
                    {
                        link:"恭喜宝贝，完成连续21天打卡的挑战！请联系群主备注【打卡】，进行朋友圈打卡验证，申请奖品~",
                        password:"无"
                    },
                ]
            }
        },
        mounted(){
            if(this.timeContinue==7){
                this.curLink = this.arrLink[0].link;
                this.curPass = this.arrLink[0].password;
            }else if(this.timeContinue==14){
                this.curLink = this.arrLink[1].link;
                this.curPass = this.arrLink[1].password;
            }else if(this.timeContinue==21){
                // this.curLink = this.arrLink[2].link;
                // this.curPass = this.arrLink[2].password;
                this.bookCode();
            }else{
                this.toBack();
            }
        },
        methods:{
            toBack(){
                this.$router.replace({path:'/home'});
            },
            bookCode(){
                this.$http.post(this.API + '/v/build_book_code').then(res => {
                    console.log(res)
                    this.curBookCode = res.data.data.book_code;
                })
            }
        },
        components:{
            vBookBack
        },
        computed:{
            ...mapState(['timeContinue'])
        }
    }
</script>
<style lang="scss">
    @import '../../static/scss/book.scss';
</style>


