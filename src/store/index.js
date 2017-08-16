import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

//开发环境
//默认 ?category_id=5962e63f2bc3b82e178a3878
export const URL_WEBSITE = "http://test.donut.cn"; 
export const API = "/api/app/library"; 

//  //线上环境
// export const API = "/app/library";     
// export const URL_WEBSITE = "http://test.donut.cn"; 

const state = {
    user:{
        headimgurl:'',
        nickname:''
    },
    category_id:'',
    curIndex:1,             //当前分类绘本index
    curClassify:'',         //当前分类
    bookList:[],            //图书数据
    classifyList:[],        //选项卡数据
    bookIntroductId:'',     //当前绘本id
    bookTitle:'',           //当前绘本标题
    fmImg:'',               //当前绘本封面

}
const mutations = {
    user: (state,user) => state.user = user,
    category_id: (state,_id) => state.category_id = _id,
    curIndex: (state,curIndex) => state.curIndex = curIndex,
    bookList: (state,bookList) => state.bookList = bookList,
    classifyList: (state,classifyList) => state.classifyList = classifyList,
    curClassify: (state,curClassify) => state.curClassify = curClassify,
    bookIntroductId: (state,bookIntroductId) => state.bookIntroductId = bookIntroductId,
    bookTitle: (state,bookTitle) => state.bookTitle = bookTitle,
    fmImg: (state,fmImg) => state.fmImg = fmImg,

}
const actions = {

}
const getters = {

}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})
export default store;