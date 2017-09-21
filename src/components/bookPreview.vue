<template lang="pug">
    .bookPreview
        loading
        v-book-back
            p(slot="back" @click="toBack") {{text}}
    
        v-content-preview(:bookSource="bookSource")
    
</template>

<script>

    import vBookBack from '@/components/common/bookBack.vue'
    import vContentPreview from '@/components/common/contentPreview';
    

    export default {
        data() {
            return {
                pictext:{
                    pic: '',
                    text:''
                },
                audioSrc:{
                    src:''
                },
                imm: false,
            }
        },
        created() {
            let bookID = this.$store.state.bookIntroductId;
            if (bookID == "") {
                this.toBack();
            } else {
                
                this.bookSource
            }
            this.$root.$on('upend',()=>{
                this.imm = true;
            })

            this.$store.commit("loading",false);
        },
        methods: {
            toBack() {
                this.$root.$emit('stopVoice');
                if(this.imm){
                    this.$router.replace({
                        path: '/bookIntroduce'
                    })
                }else{
                    this.$router.replace({
                        path: '/bookRecording'
                    })
                }
            }
        },
        computed:{
            text(){
                return this.imm ? '返回':'修改'
            },
            bookSource(){
                let bookSource = this.$store.state.source;
                let bookAudio = this.$store.state.audioId;
                bookSource.map((e,i)=>{
                    e.bookAudioID = bookAudio[i];
                })
                return bookSource
            }
        },
        components: {
            vBookBack,
            vContentPreview
        }
    }
</script>


<style lang="scss">
    @import '../../static/scss/book.scss';
</style>
