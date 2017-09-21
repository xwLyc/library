<template lang="pug">
    .bookAward
        .backTop
            v-book-back
                p(slot="back" @click="toBack") 返回
        img(src="../../static/img/award.png")
        .linkBox
            p
                span 链接：
                a(:href="curLink") {{curLink}}
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
                        link:"http://www.baidu.com",
                        password:"1234"
                    },
                    {
                        link:"http://www.qq.com",
                        password:"1234"
                    },
                    {
                        link:"http://www.kugou.com",
                        password:"1234"
                    },
                ]
            }
        },
        mounted(){

            if(this.continuousDays>=7){
                this.curLink = this.arrLink[0].link;
                this.curPass = this.arrLink[0].password;
            }else if(this.continuousDays>=14){
                this.curLink = this.arrLink[1].link;
                this.curPass = this.arrLink[1].password;
            }else if(this.continuousDays>=21){
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
            continuousDays(){
                return this.$store.state.user.continuousDays
            }
        }
    }
</script>
<style lang="scss">
    @import '../../static/scss/book.scss';
</style>


