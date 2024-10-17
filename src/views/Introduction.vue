<template>
  <div class="intro-container">
    <div class="intro-title">
      <h1 id="title"></h1>
    </div>
    <div class="intro-content">

    </div>
  </div>
</template>

<script>
import TypeIt from "typeit";

export default {
  name: "Introduction",
  mounted() {
    new TypeIt("#title", {
      strings: "이상형 월드컵",
      speed: 50,
      waitUntilVisible: true,
      loop: true
    }).pause(2000).delete(7).type("Ideal Type World Cup").go();
  },
};
</script>

<style scoped>
/*
fucking css
존나 어렵네
*/
</style>
