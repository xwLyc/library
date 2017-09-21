<template lang="pug">
    transition(name="fade" mode="")
        section.loading(v-show="loading")
            img(src="../../../static/img/loading.gif")
</template>
<script>
import { mapState } from 'vuex'

export default {
    computed:{
        ...mapState(['loading'])
    }
}
</script>
