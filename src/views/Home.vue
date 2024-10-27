<template>
  <div class="main-container">
    <div
      v-for="(record, recordIndex) in chunkedWorldcups"
      :key="recordIndex"
      class="card-record"
    >
      <WorldcupCard
        v-for="(card, cardIndex) in record"
        :key="cardIndex"
        :data="card"
      />
    </div>
  </div>
</template>

<script>
import WorldcupCard from "@/components/WorldcupCard.vue";
import { fetchAllWorldcups } from "@/services/firebase/db.js";

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
  async created() {
    this.worldcups = await fetchAllWorldcups();
  },
  computed: {
    /**
     * 모든 월드컵 데이터를 하나의 레코드 당 5개의 카드를 가진 청크 형태로 나눠주는 함수
     */
    chunkedWorldcups() {
      const chunkSize = 5;
      const result = [];
      for (let i = 0; i < this.worldcups.length; i += chunkSize) {
        result.push(this.worldcups.slice(i, i + chunkSize));
      }
      return result;
    },
  },
};
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