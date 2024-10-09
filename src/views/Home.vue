<template>
  <div class="main-container">
    <div class="main-contents">
      <h1>main home</h1>
      <p v-if="user">
        현재 로그인: {{ user.email }}
      </p>
    </div>
  </div>
</template>

<script>
import { auth, onAuthStateChanged } from "@/services/firebase/auth";

export default {
  name: "Home",
  data() {
    return {
      user: null
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  },
}
</script>

<style>
  .main-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 75vh;
  }

  .main-contents {
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
</style>