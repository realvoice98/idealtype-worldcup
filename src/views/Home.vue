<template>
  <GlobalNavBar @updateSortOrder="fetchWldcupsData" />
  <div class="main-container">
    <div
      v-for="(record, recordIndex) in chunkedWldcups"
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
  import WorldcupCard from '@/components/WorldcupCard.vue';
  import { fetchAllWldcups } from '@/services/firebase/db.js';
  import GlobalNavBar from '@/components/GlobalNavBar.vue';

  export default {
    name: 'Home',
    components: {
      WorldcupCard,
      GlobalNavBar,
    },
    data() {
      return {
        user: null,
        wldcups: [],
        windowWidth: window.innerWidth, // 화면 크기 저장
        currentFilter: 'popular', // 초기값은 인기순
      };
    },
    async created() {
      await this.fetchWldcups(this.currentFilter);
      window.addEventListener('resize', this.updateWindowWidth); // 화면 크기 변경 이벤트 리스너 추가
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.updateWindowWidth); // 이벤트 리스너 제거
    },
    methods: {
      updateWindowWidth() {
        this.windowWidth = window.innerWidth; // 화면 크기 갱신
      },
      async fetchWldcups(filter) {
        this.currentFilter = filter; // 필터 상태 업데이트
        this.wldcups = await fetchAllWldcups(filter);
      },
      async fetchWldcupsData(order) {
        this.currentFilter = order;
        await this.fetchWldcups(order);
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
      chunkedWldcups() {
        const result = [];
        for (let i = 0; i < this.wldcups.length; i += this.chunkSize) {
          result.push(this.wldcups.slice(i, i + this.chunkSize));
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
    margin-top: 100px;
  }

  .card-record {
    display: flex;
    /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
    /* margin-bottom: 1rem;  */
    width: 100%;
    justify-content: start;
  }
</style>