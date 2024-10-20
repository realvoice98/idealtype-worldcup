<template>
  <div class="main-container">
    <!-- [D] v-for="record in worldcups / 5" -->
    <div class="card-record">
      <!-- [D] v-for="card in record" -->
      <WorldcupCard />
      <WorldcupCard />
      <WorldcupCard />
      <WorldcupCard />
    </div>

<!--    <p v-if="user">현재 로그인: {{ user.email }}</p>-->

  </div>
</template>

<script>
import { auth, onAuthStateChanged } from "@/services/firebase/auth";
import WorldcupCard from "@/components/WorldcupCard.vue";

export default {
  name: "Home",
  components: {
    WorldcupCard,
  },
  data() {
    return {
      user: null,
      worldcups: [],
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

  .card-record {
    display: flex;
    border-radius: 10px;
    /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
  }
</style>