<template lang="pug">
  div
    section.bookban.pos_r
        .bookBanImg
            img.wp100.hp100(:src="pictext.pic")
        //- p.bookBanMark
        p.bookmtop
        p.bookPage
          span.curPage {{curPage}}
          span /
          span.totalPage {{totalPage}}
    section.textBox
      .textStyle.fontComic
        p {{pictext.content}}

</template>

<script>

export default {
  props:['pictext'],
  computed:{

    page(){
      return this.$store.state.page
    },
    curPage(){
      return this.page.curPage
    },
    totalPage(){
      return this.page.totalPage
    },
  }
}
</script>


