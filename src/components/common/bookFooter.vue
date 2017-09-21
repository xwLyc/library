<template lang="pug">
  footer.footBox.tac
    a.prePage.fl(@click="decrement" v-show="hasPre") 
      img(src="../../../static/img/arrow_left.png")
      p.fl {{prePage}}
    a(:class="[{'noNext':!nextActive},'nextPage','fr']" @click="increment" ) 
      img.fr(src="../../../static/img/arrow_right.png")
      p.fl {{nextPage}}
    //- .pageNum
    //-   p.curPage {{curPage}}
    //-   p /
    //-   p.totalPage {{totalPage}}
</template>

<script>
import {mapActions} from 'vuex'
export default {
  data () {
    return {

    }
  },
  methods:{
    increment(){
      if(this.nextActive){
        this.$root.$emit('stopAudio');
        // this.$root.$emit('clickpage');
        // alert("curpage: "+this.page.curPage+", totalpage: "+this.page.totalPage)
        if(this.page.curPage<this.page.totalPage){
          this.$store.commit('increment');
          if(!this.$store.state.audioId[this.$store.state.page.curPage-1]){
            this.$store.commit('src3','-1');
          }
        }else{
          this.$router.replace({path:'/bookPreview'})
        }
        
      }

    },
    decrement(){
      this.$store.commit('decrement');
      // this.$root.$emit('clickpage')
      this.$root.$emit('stopAudio');
      this.$store.commit('src3',true);
    }
  },
  computed:{
    page(){
      return this.$store.state.page
    },
    hasPre(){
      return this.page.curPage > 1 ? true:false
    },
    // hasNext(){
    //   return this.page.curPage < this.totalPage ? true:false
    // },
    prePage(){
      return this.page.prePage
    },
    curPage(){
      return this.page.curPage
    },
    nextPage(){
      return this.page.curPage < this.totalPage ? this.page.nextPage :'预览'
    },
    totalPage(){
      return this.page.totalPage
    },
    nextActive(){
      return this.$store.state.audioId[this.page.curPage-1]? true:false;
    }
  }
  
}
</script>


<style lang="scss">

</style>
