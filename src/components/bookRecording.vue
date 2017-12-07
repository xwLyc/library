<template lang="pug">
    .bookRecording.wp100.hp100
        loading
        v-book-back
            p(slot="back" @click="toBack") 返回
        v-book-content(:pictext="curS")
        v-book-audio(:audioSrc="curS")
        v-book-footer

        .giveUpBox(v-show="giveUpBox")
            .mask
                .pos_r
                    img(src="../../static/img/giveUp.png")
                    p.ok(@click="ok")
                    p.cancel(@click="cancel")

</template>

<script>

    import vBookBack from '@/components/common/bookBack.vue'
    import vBookContent from '@/components/common/bookContent'
    import vBookAudio from '@/components/common/bookAudio'
    import vBookFooter from '@/components/common/bookFooter'
    export default {
        data() {
            return {
                curS:'',
                giveUpBox:false,
            }
        },

        mounted() {

            this.SDKRegister(this,()=>{
            })

            let wx = this.$wechat;
            // wx.ready(()=>{
            //     console.log(wx);
            //     wx.showAllNonBaseMenuItem();
            // })
            this.$store.commit('initSource');
            // wx.hideAllNonBaseMenuItem();
            let bookID = this.$store.state.bookIntroductId;
            if (bookID == "") {
                this.$router.replace({path:'/home'})
            } else {
                this.$http.get(this.API + '/book/sentence', {
                    params: {
                        _id: bookID,
                        mode:'v'
                    }
                }).then((res) => {
                    console.log(res)
                    let data = res.data.data;
                    this.$store.commit('totalPage',data.length);
                    let arr=[];

                    data.forEach((e)=>{
                        let obj = {};
                        obj.pic = this.URL_WEBSITE+e.pic;
                        obj.content = e.content;
                        obj._id = e._id;
                        obj.audio = this.URL_WEBSITE+e.audio.url;
                        obj.duration = e.audio.duration;
                        arr.push(obj);
                        this.$preLoadImg(obj.pic);
                    })
                    this.$store.commit('source',arr);
                    this.$store.commit("loading",false);
                    // this.curSource();
                });

            }
        },
        methods:{
            toBack(){
                this.$router.replace({path:'/bookIntroduce'})
            },
            cancel(){
                this.$store.dispatch('clearSource');
                this.$router.replace({
                    path: '/bookIntroduce'
                })
            },
            ok(){
                this.giveUpBox = false;
            },

        },
        computed:{
            bookTitle(){
                return this.$store.state.bookTitle
            },
            curSource(){
                return this.$store.getters.source;
            },
        },
        watch:{
            curSource(val,oldval){
                if(val){
                    this.curS = this.curSource
                }
            }
        },
        components: {
            vBookBack,
            vBookContent,
            vBookAudio,
            vBookFooter
        }
    }
</script>

<style lang="scss">
    @import '../../static/scss/book.scss';
</style>
