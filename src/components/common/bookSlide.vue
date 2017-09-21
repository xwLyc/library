<template lang="pug">
    section.bookSlide
        transition(name="fade")
            p.aniFade(v-show="aniFade") 请先读完并生成第{{huibenIndex}}个绘本哦
        swiper(:options="swiperOption"  ref="mySwiper" )
            swiper-slide(v-for="(item, index) in bookList" :key="item._id" )
                .fmImg(@click="bookInroduct(item.status,item._id)")
                    img.fmPic(:src="URL_WEBSITE+item.coverImg")
                    .sock(v-show="item.status==-1" )
                        img(src="../../../static/img/sock.png")
                    p.bookMark
                        img(src="../../../static/img/bookmark1.png")

                    p.bookNum
                        span.cur {{(index+1).toString().split('')[1]?index+1:'0'+(index+1)}}
                        span /
                        span.total {{bookList.length}}
                p.bookTitle {{item.name}}
                
  
            .swiper-button-prev(slot="button-prev" v-show="preBtn")
                img(src="../../../static/img/img02.png")
            .swiper-button-next(slot="button-next" v-show="nextBtn")
                img(src="../../../static/img/img03.png")

</template>

<script>
    import { mapMutations, mapState } from 'vuex'
    // import {URL_WEBSITE, API} from '../../store'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    export default {
        data() {
            return {
                URL_WEBSITE: this.URL_WEBSITE,
                huibenIndex:'', 
                aniFade:false,
                // curIndex: 0,
                preBtn: false,
                nextBtn: false,
                swiperStatus:'',
                swiperOption: {
                    notNextTick: true,
                    initialSlide: this.curIndex, //初始显示第几个slide
                    slidesPerView: 1,
                    prevButton: '.swiper-button-prev',
                    nextButton: '.swiper-button-next',
                    setWrapperSize: true,
                    spaceBetween: 200,
                    followFinger: false,
                    observer: true,//修改swiper自己或子元素时，自动初始化swiper  
                    observeParents: true,//修改swiper的父元素时，自动初始化swiper  
                    onSlideChangeStart: (swiper) => {
                        // this.curIndex = swiper.activeIndex; //切换结束时，告诉我现在是第几个slide
                        this.$store.commit('curIndex',swiper.activeIndex) //切换结束时，告诉我现在是第几个slide
                        this.btnStatue();

                    }
                }
            }
        },
        mounted() {
            this.swiperTo(this.curIndex);
            this.huibenIndex = this.curIndex+1;
        },
        methods: {
            btnStatue() {   //是否显示 左右 切换按钮
                if (this.curIndex > 0) {
                    this.preBtn = true;
                } else {
                    this.preBtn = false;
                }
                if (this.curIndex+1 < this.bookList.length) {
                    this.nextBtn = true;
                } else {
                    this.nextBtn = false;
                }
            },
            bookInroduct(status,id){

                if(status>-1){
                    this.$store.commit("bookIntroductId",id);
                    this.$router.replace({path:'bookIntroduce'});
                }else{
                    this.aniFade = true;
                    setTimeout(() => {
                        this.aniFade = false;
                    }, 2500);
                }
            },
            swiperTo(index) {
                this.swiper.slideTo(index, 0, false);
                this.btnStatue();
            },
        
            
        },
        computed: {
            ...mapState(['bookList','curIndex']),
            swiper() {  
              return this.$refs.mySwiper.swiper;  
            } ,
            myswiper() {  
              return this.$refs.mySwiper;  
            } 
            
        },
        watch:{
            bookList:function(val, oldVal){ //获取到 bookList 时就展示Swiper
                this.btnStatue();
                if(val){                //默认显示当前未完成的绘本index
                    val.map((e,index)=>{
                        if(e.status==0){
                            this.$store.commit('curIndex',index);
                            this.swiperTo(this.curIndex);
                            this.huibenIndex = index+1;
                        }
                    })
                }
            },
            myswiper(val, oldVal){
                if(val){
                    this.$root.$on('swiperIndex',()=>{  //切换 tab 时更新 当前swiper index
                        console.log(this)
                        this.$store.commit('curIndex',0);
                        this.swiperTo(this.curIndex);

                    })

                }
            }
        }
    }
</script>

