<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  watch:{
    
    '$route':function() {
      sessionStorage.setItem('pathName',this.$route.fullPath);
    }
  }
}
</script>
