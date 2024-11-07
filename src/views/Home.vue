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
      chunkSize: 5, // 기본값 설정
    };
  },
  async created() {
    this.worldcups = await fetchAllWorldcups();
    this.setChunkSize(); // 초기 로드 시 chunkSize 설정
  },
  methods: {
    setChunkSize() {
      const width = window.innerWidth;
      if (width >= 2560) {
        this.chunkSize = 6;
      }
      else if (width >= 1440) {
        this.chunkSize = 3;
      }
      else if (width >= 1024) {
        this.chunkSize = 2;
      } else if (width >= 768) {
        this.chunkSize = 1;
      } else {
        this.chunkSize = 1;
      }
    },
  },
  computed: {
    /**
     * 모든 월드컵 데이터를 하나의 레코드 당 5개의 카드를 가진 청크 형태로 나눠주는 함수
     */
    chunkedWorldcups() {
      // const chunkSize = 5;
      const result = [];
      for (let i = 0; i < this.worldcups.length; i += this.chunkSize) {
        result.push(this.worldcups.slice(i, i + this.chunkSize));
      }
      return result;
    },
  },
};
</script>

<style>
  .main-container {
    display: flex;
    flex-direction: column; /* 행 세로 배치 (chunkedWorldcups에서 record 나누기) */
    justify-content: center;
    align-items: center;
    /* height: 75vh; */
    /* margin-top: 130px; */
  }

  .card-record {
    display: flex;
    /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
    /* margin-bottom: 1rem;  */
    width: 100%;
    justify-content: center;
  }
</style>