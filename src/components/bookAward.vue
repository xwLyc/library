<template lang="pug">
    .bookAward
        .backTop
            v-book-back
                p(slot="back" @click="toBack") 返回
        img(src="../../static/img/award.png")
        .linkBox
            p
                span 链接：
                a(:href="timeContinue < 21?curLink : '#'") {{curLink}}
            p
                span 密码：
                span {{curPass}}
</template>

<script>
    import { mapState } from 'vuex'
    import vBookBack from '@/components/common/bookBack.vue'
    export default {
        data(){
            return{
                curLink:'',
                curPass:'',
                arrLink:[
                    {
                        link:"http://pan.baidu.com/s/1gfMq5Jd",
                        password:"igfh"
                    },
                    {
                        link:"http://pan.baidu.com/s/1sloMiPf",
                        password:"x4hi"
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
                this.curLink = this.arrLink[2].link;
                this.curPass = this.arrLink[2].password;
            }else{
                this.toBack();
            }
        },
        methods:{
            toBack(){
                this.$router.replace({path:'/home'});
            },
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


