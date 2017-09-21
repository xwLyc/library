<template lang="pug">
    .home.pos_r.ofh(@click="hideTabList")
        loading
        v-book-rule
        section.top
            .dakaRule(@click="ruleOpen")
                img(src="../../static/img/img01.png")
            p.dakaRuleText 打卡规则
            .headImg.ofh
                img(:src="headimgurl")
            .nickName.tac {{nickname}}
        section.main
            .studyStatus.tac.ofh
                .wp50.fl
                    p.sTop(v-if="todayLearn") 完成
                    p.sTop.no(v-else) 未完成
                    p.sBottom 今日打卡
                .wp50.fl
                    p.sTop {{continuousDays}}
                    p.sBottom 连续学习(天)
            .tabBox.pos_r
                .wp100.hp100(@click.stop="toggleTabList")
                    p.tabTitle.tac.fl {{curClassify}}
                    p.tabTrangle.fr
                //- transition(name="" mode="")
                list(:classifyList="classifyList")
            
        v-book-slide
</template>

<script>
    import { mapState } from 'vuex'
    import vBookSlide from '@/components/common/bookSlide'
    import vBookRule from '@/components/common/bookRule'
    export default {
        data() {
            return {
                // loading: true,
                tabList: false,
            }
        },
        mounted(){
            //防止页面后退
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });

            let category_id = this.$store.state.category_id;

            if(!category_id){
                this.init();
            }else{
                this.getInfo(category_id);
            }
        },
        methods: {
            init(){
                let url = window.location.search;
                let category_id = url.substr(url.indexOf('=')+1, 24);

                this.$store.commit('category_id',category_id);
                this.getInfo(category_id);
            },
            getInfo(category_id){
                this.$http.get(this.API+'/book/user/v',{params:{category_id:category_id}}).then((res)=>{
                        // console.log(res)
                        let bookList = res.data.data;
                        bookList.map((e,i)=>{
                        // console.log("e %s, i %s", JSON.stringify(e.coverImg), i)
                            if(i>=bookList.length/2){
                                this.$preLoadImg(this.URL_WEBSITE+e.coverImg,()=>{
                                    // this.loading = false;
                                    this.$store.commit("loading",false);
                                });
                            }else{
                                this.$preLoadImg(this.URL_WEBSITE+e.coverImg);
                            }
                        })
                        // this.curClassify = res
                        // this.booklist=res.data.data;
                        this.$store.commit('bookList',bookList);
                        this.$store.commit('user',res.data.user);
                        this.classify();
                    }).catch((res)=>{
                        console.log(res)
                    })
            },
            classify(){ //分类选项卡分配
                let classifyList = this.$store.state.classifyList;
                if(classifyList==''){ //首次加载 
                    this.$http.get(this.API+'/category',{params:{category_id:this.category_id,wx:'wx'}}).then((res)=>{
                        let data = res.data.data;
                        // console.log(data)
                        classifyList=[];
                        data.map((e)=>{
                            if(e.publish){
                                let obj = {}
                                obj._id = e._id;
                                obj.name = e.name;
                                classifyList.push(obj);
                            }
                        });
                        this.$store.commit('classifyList',classifyList);
                        this.$store.commit('curClassify',classifyList[0].name);
                    }).catch((res)=>{
                        console.log(res)
                    })
                    
                }
                
            },
            toggleTabList() {
                this.tabList = !this.tabList;
                // console.log(this.classifyList)
            },
            hideTabList() {
                this.tabList = false;
            },
            changeCategory_id(id){
                this.$store.commit('category_id',id);
            },
            changeClassify(curClassify){
                this.$store.commit('curClassify',curClassify);
            },
            ruleOpen(){
                this.$store.commit('ruleBox', true);
            }
        },
        computed:{
            ...mapState({
                curCategory_id: state => state.category_id,
                curClassify: state => state.curClassify,
                classifyList: state => state.classifyList,
                nickname: state => state.user.nickname,
                headimgurl: state => state.user.headimgurl,
                todayLearn: state => state.user.todayLearn,
                continuousDays: state => state.user.continuousDays
            }),
            
        },
        components: {
            vBookSlide,
            vBookRule,
            'list':{
                functional:true,
                render:(h,context)=>{
                    // console.log(context)
                    let data = context.props.classifyList;
                    return h('ul',{
                            'class':['tabList','ofh'],
                            style:{
                                display: context.parent.tabList ? "block" : "none"
                            }
                        },
                        Array.apply(null,{length:data.length}).map((e,i)=>{
                            return h('li',{
                                    'class':{
                                        active: context.parent.curCategory_id == data[i]._id ? true : false
                                    },
                                    props:{
                                        _id:data[i]._id,
                                    },
                                    on:{
                                        click:()=>{
                                            context.parent.getInfo(data[i]._id);
                                            context.parent.changeClassify(data[i].name);
                                            context.parent.changeCategory_id(data[i]._id);
                                            // console.log(context.parent)
                                            // context.parent.toggleTabList();
                                            context.parent.$root.$emit('swiperIndex') //切换当前swiper Index
                                        }
                                    }
                                    
                                },
                                Array.apply(null,{length:1}).map(()=>{
                                    return h('p',data[i].name)
                                })
                            )
                        })
                    )
                    

                }
            }
        },
    }
</script>

<style lang="scss">
    @import '../../static/scss/home.scss';
</style>


