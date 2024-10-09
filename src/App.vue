<template>
  <div id="app">
    <GlobalNavBar />
    <router-view />
  </div>
</template>

<script>
import GlobalNavBar from "@/components/GlobalNavBar.vue";

export default {
  name: 'App',
  components: {
    GlobalNavBar,
  }
}
</script>

<style>
#app {

}
</style>
