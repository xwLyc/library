import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);


const state = {
    loading:true,
    ruleBox:false,
    user:{
        headimgurl:'',
        nickname:''
    },
    category_id:'',
    curIndex:0,             //当前分类绘本index
    curClassify:'',         //当前分类
    bookList:[],            //图书数据
    classifyList:[],        //选项卡数据
    bookIntroductId:'',     //当前绘本id
    bookTitle:'',           //当前绘本标题
    fmImg:'',               //当前绘本封面
    page:{                  //页码
        prePage: '上一页',
        nextPage: '下一页',
        curPage: 1,
        totalPage: ''
    },
    audioId:[],
    src:{
        src1:true,
        src2:true,
        src3: -1,
    },
    source:'',
    bookAudioId:'',
    bookSource:'',
    headTime:'',
    timeContinue:'',        //连续几天打卡

}
const mutations = {
    loading: (state,loading) => state.loading = loading,
    ruleBox: (state,ruleBox) => state.ruleBox = ruleBox,
    user: (state,user) => state.user = user,
    category_id: (state,_id) => state.category_id = _id,
    curIndex: (state,curIndex) => state.curIndex = curIndex,
    bookList: (state,bookList) => state.bookList = bookList,
    classifyList: (state,classifyList) => state.classifyList = classifyList,
    curClassify: (state,curClassify) => state.curClassify = curClassify,
    bookIntroductId: (state,bookIntroductId) => state.bookIntroductId = bookIntroductId,
    bookTitle: (state,bookTitle) => state.bookTitle = bookTitle,
    fmImg: (state,fmImg) => state.fmImg = fmImg,

    
    audioId: (state,data) => {
        if(data.index==state.audioId.length){
            state.audioId.push(data.audioId)
        }else{
            state.audioId.splice(data.index,1,data.audioId);
        }
    },
    initAudioId:(state) => state.audioId = [],

    src1: (state,src1) => state.src.src1 = src1,
    src2: (state,src2) => state.src.src2 = src2,
    src3: (state,src3) => state.src.src3 = src3,

    increment: state => state.page.curPage++,
    decrement: state => state.page.curPage--,
    totalPage:(state, num) => {state.page.totalPage = num},

    initSource:(state) => {
        state.source = '';
        state.page.curPage = 1;
    },
    source:(state, obj) => {state.source = obj},
    bookAudioId:(state, bookAudioId) => state.bookAudioId = bookAudioId,
    bookSource:(state, bookSource) => state.bookSource = bookSource,
    headTime:(state, headTime) => state.headTime = headTime,
    timeContinue:(state, timeContinue) => state.timeContinue = timeContinue,

    
}
const actions = {
    increment(context){
        context.commit('increment');
    },
    totalPage({commit}){
        commit('totalPage');
    },
    clearSource(context){
        context.commit('src1',true);
        context.commit('src2',true);
        context.commit('src3', -1);
        context.commit('initAudioId');
    },
    loading({commit}){
        commit('loading');
    }

}
const getters = {
    source: (state)=>{
        return state.source[state.page.curPage-1];
    }

}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})
export default store;