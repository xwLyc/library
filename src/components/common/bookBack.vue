<template lang="pug">
    .bookback
        .backBtn
            img.fl(src="../../../static/img/arrow_left.png")
            //- p.fl 返回
            slot(name="back")
</template>

<script>
    export default {
    
    }
</script>

