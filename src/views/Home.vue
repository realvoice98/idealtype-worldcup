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
      windowWidth: window.innerWidth, // 화면 크기 저장
    };
  },
  async created() {
    this.worldcups = await fetchAllWorldcups();
    window.addEventListener("resize", this.updateWindowWidth); // 화면 크기 변경 이벤트 리스너 추가
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateWindowWidth); // 이벤트 리스너 제거
  },
  methods: {
    updateWindowWidth() {
      this.windowWidth = window.innerWidth; // 화면 크기 갱신
    },
  },
  computed: {
    /**
     * 화면 크기에 따라 chunkSize를 동적으로 계산
     */
    chunkSize() {
      const width = this.windowWidth;
      if (width >= 2560) {
        return 6;
      } else if (width >= 1440) {
        return 3;
      } else if (width >= 1024) {
        return 2;
      } else if (width >= 768) {
        return 1;
      } else {
        return 1;
      }
    },
    /**
     * 모든 월드컵 데이터를 chunkSize에 따라 청크 형태로 나눔
     */
    chunkedWorldcups() {
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


</style>