<template lang="pug">
  #app
    router-view
</template>

<script>
  export default {
    name: 'app',
    created(){
      this.SDKRegister(this);
    }
  }
</script>

