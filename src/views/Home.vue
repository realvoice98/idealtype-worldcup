<template>
  <GlobalNavBar @updateSortFilter="fetchWldcupsData" @searchWldcups="filterWldcupsSearch" @clearSearchWldcups="clearSearchWldcups"/>
  <div class="main-container">
    <LoadingSpinner :visible="isLoading" />
    <div
      v-for="(record, recordIndex) in chunkedWldcups"
      :key="recordIndex"
      class="card-record"
    >
      <WorldcupCard
        v-for="(card, cardIndex) in record"
        :key="cardIndex"
        :data="card"
        :profileImage="card.profileImage"
        :user="user"
        @open-modal="showReportModal = true; wldcupId = card.wldcupId"
      />
      <ReportModal
          v-if="showReportModal"
          :message="'신고 내용을 입력하세요.\n신고한 월드컵은 표시되지 않아요.'"
          :wldcupId="wldcupId"
          @confirm="handleReport"
          @close="showReportModal = false"
      />
    </div>
  </div>
</template>

<script>
  import WorldcupCard from '@/components/worldcup/WorldcupCard.vue';
  import GlobalNavBar from '@/components/GlobalNavBar.vue';
  import ReportModal from "@/components/modals/ReportModal.vue";

  import {createReport, fetchAllWldcups} from '@/services/firebase/db.js';
  import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
  import {auth, onAuthStateChanged} from "@/services/firebase/auth";

  export default {
    name: 'Home',
    components: {
      LoadingSpinner,
      WorldcupCard,
      GlobalNavBar,
      ReportModal,
    },
    data() {
      return {
        user: null,
        allWldcups: [],
        filteredWldcups: [],
        searchQuery: "",
        windowWidth: window.innerWidth, // 화면 크기 저장
        currentFilter: 'popular', // 초기값은 인기순
        isLoading: false,
        showReportModal: false,
        wldcupId: null,
      };
    },

    async created() {
      onAuthStateChanged(auth, (user) => { // 안에다 비동기 요청 넣으면 await (user) =>
        if (user) {
          this.user = user;
        }
      });
      await this.initWldcups();
      window.addEventListener('resize', this.updateWindowWidth); // 화면 크기 변경 이벤트 리스너 추가

    },
    beforeUnmount() {
      window.removeEventListener('resize', this.updateWindowWidth); // 이벤트 리스너 제거
    },
    mounted() {
      document.title = '이상형 월드컵 | Ideal type worldcup';
    },
    methods: {
      updateWindowWidth() {
        this.windowWidth = window.innerWidth; // 화면 크기 갱신
      },
      async initWldcups() {
        this.isLoading = true;
        try {
          this.allWldcups = await fetchAllWldcups(); // 모든 월드컵 정보 받기
          this.applyFilters();
        } catch (error) {
          console.error("불러오기 실패:", error);
        } finally {
          this.isLoading = false;
        }
      },
      async clearSearchWldcups() {
        this.searchQuery = '';
        this.applyFilters();
      },
      fetchWldcupsData(filter) {
        this.isLoading = true;
        try {
          this.currentFilter = filter;
          this.applyFilters();
        }  catch (error) {
          console.error("불러오기 실패:", error);
        } finally {
          this.isLoading = false;
        }
      },
      filterWldcupsSearch(query) {
        this.isLoading = true;
        try {
          this.searchQuery = query;
          this.applyFilters();
        }  catch (error) {
          console.error("불러오기 실패:", error);
        } finally {
          this.isLoading = false;
        }
      },
      applyFilters() {
        let result = [...this.allWldcups];

        // 검색어 필터링
        if (this.searchQuery.length > 0) {
          const keywords = this.searchQuery.split(" ");
          result = result.filter((item) =>
              keywords.some((keyword) => item.title.includes(keyword))
          );
        }

        if (this.user) {
          result = result.filter((item) => {  //본인이 신고했거나 신고회수가 3회 이상인 경우 보여지지 않음
            if (!item.reports) {
              return true;
            }

            const reportKeys = Object.keys(item.reports);

            return (
                reportKeys.length <= 3 &&
                !reportKeys.some((key) => item.reports[key].uid === this.user.uid)
            );
          });
        }

        if (this.currentFilter === 'popular') {
          result.sort((a, b) => Number(b.views) - Number(a.views)); // 인기순 정렬
        } else if (this.currentFilter === 'latest') {
          result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // 최신순 정렬
        }

        const numberFormat = new Intl.NumberFormat("ko", {notation: 'compact',});
        const relativeTimeFormat = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });

        result = result.map((wldcup) => {
          return {
            ...wldcup,
            views: numberFormat.format(wldcup.views),
            updatedAt: relativeTimeFormat.format(Math.ceil((wldcup.updatedAt - Date.now()) / (1000 * 60 * 60 * 24)), "day"),
          };
        });

        this.filteredWldcups = result;
      },
      handleReport(inputValue) {
        this.reportWldcupAndHide(inputValue);
      },
      reportWldcupAndHide(reportComment) {
        try {
          createReport(this.user.uid, this.wldcupId, reportComment);  // 신고하기
          this.showReportModal = false;
          window.location.reload();
        } catch (e) {
          console.warn("신고하기 오류 : " + e);
        }
      }
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
        for (let i = 0; i < this.filteredWldcups.length; i += this.chunkSize) {
          result.push(this.filteredWldcups.slice(i, i + this.chunkSize));
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