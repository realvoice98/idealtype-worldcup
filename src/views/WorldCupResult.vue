<template>
  <div class="table-container">
      <!-- 검색 입력 -->
       <div class="search-container">
      <input
      type="text"
      v-model="searchQuery"
      placeholder="이름으로 검색"
      class="search-input"
      @keydown.enter="executeSearch"
    />
  </div>
    <!-- 테이블 -->
    <table border="1">
      <thead>
        <tr>
          <th class="col-rank">순위</th>
          <th class="col-image">이미지</th>
          <th class="col-name">이름</th>
          <th class="col-stat">우승 비율 <br>(최종 우승 횟수 / 전체 게임 수)</th>
          <th class="col-stat">승률 <br>(승리 횟수 / 전체 1:1 대결 수)</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr v-for="(item, index) in paginatedData" :key="index"> -->
          <tr v-for="(item, index) in filteredData" :key="index">
          <td class="col-rank">{{ item.rank }}</td>
          <td class="col-image">
            <img :src="item.image" alt="이미지" />
          </td>
          <td class="col-name">{{ item.name }}</td>
          <td class="col-stat">
            <div class="progress-container">
              <div class="progress-bar" :style="{ width: calculateWinRate(item.finalWins, item.totalGames) + '%' }"></div>
              <span class="progress-text">{{ calculateWinRate(item.finalWins, item.totalGames) }}%</span>
            </div>
          </td>
          <td class="col-stat">
            <div class="progress-container">
              <div class="progress-bar success" :style="{ width: calculateMatchRate(item.wins, item.totalMatches) + '%' }"></div>
              <span class="progress-text">{{ calculateMatchRate(item.wins, item.totalMatches) }}%</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
       <!-- 페이징 버튼 -->
   <div class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'WorldCupResult',
  data() {
    return {
      searchQuery: '', // 사용자가 입력 중인 검색어
      activeSearchQuery: '', // 엔터를 눌렀을 때만 적용되는 검색어
      currentPage: 1, // 현재 페이지
      itemsPerPage: 10, // 한 페이지당 항목 수
      data: [
        {
          rank: 1,
          image: "empty",
          name: "이도현",
          finalWins: 10,
          totalGames: 63,
          wins: 49,
          totalMatches: 63,
        },
        {
          rank: 2,
          image: "empty",
          name: "정해인",
          finalWins: 9,
          totalGames: 64,
          wins: 48,
          totalMatches: 64,
        },
        {
          rank: 3,
          image: "empty",
          name: "안효섭",
          finalWins: 5,
          totalGames: 56,
          wins: 40,
          totalMatches: 56,
        },
        {
          rank: 4,
          image: "empty",
          name: "차은우",
          finalWins: 5,
          totalGames: 80,
          wins: 40,
          totalMatches: 80,
        },
        {
          rank: 5,
          image: "empty",
          name: "송강",
          finalWins: 5,
          totalGames: 84,
          wins: 25,
          totalMatches: 90,
        },
        {
          rank: 6,
          image: "empty",
          name: "송강",
          finalWins: 5,
          totalGames: 84,
          wins: 25,
          totalMatches: 90,
        },
        {
          rank: 7,
          image: "empty",
          name: "송강",
          finalWins: 5,
          totalGames: 84,
          wins: 25,
          totalMatches: 90,
        },
        {
          rank: 8,
          image: "empty",
          name: "송강",
          finalWins: 5,
          totalGames: 84,
          wins: 25,
          totalMatches: 90,
        },
        {
          rank: 9,
          image: "empty",
          name: "송강",
          finalWins: 5,
          totalGames: 84,
          wins: 25,
          totalMatches: 90,
        },
        {
          rank: 10,
          image: "empty",
          name: "송강",
          finalWins: 5,
          totalGames: 84,
          wins: 25,
          totalMatches: 90,
        },
        {
          rank: 11,
          image: "empty",
          name: "송강",
          finalWins: 5,
          totalGames: 84,
          wins: 25,
          totalMatches: 90,
        },
        {
          rank: 12,
          image: "empty",
          name: "송강",
          finalWins: 5,
          totalGames: 84,
          wins: 25,
          totalMatches: 90,
        },
      ],
    };
  },
  computed: {
    // 필터링된 데이터 반환 (검색 및 페이징 반영)
    filteredData() {
      const filtered = this.data.filter(item =>
        item.name.startsWith(this.activeSearchQuery) // activeSearchQuery 사용
      );
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },
    // 전체 페이지 수 계산
    totalPages() {
      const filtered = this.data.filter(item =>
        item.name.startsWith(this.activeSearchQuery) // activeSearchQuery 사용
      );
      return Math.ceil(filtered.length / this.itemsPerPage);
    },
  },
  methods: {
    // 엔터 키가 눌렸을 때 검색 실행
    executeSearch() {
      this.activeSearchQuery = this.searchQuery; // 검색어 적용
      this.currentPage = 1; // 첫 페이지로 이동
    },
    changePage(page) {
      this.currentPage = page;
    },
    calculateWinRate(finalWins, totalGames) {
      if (totalGames === 0) return "0%";
      return ((finalWins / totalGames) * 100).toFixed(2);
    },
    calculateMatchRate(wins, totalMatches) {
      if (totalMatches === 0) return "0%";
      return ((wins / totalMatches) * 100).toFixed(2);
    },
  },
};
</script>



<style scoped>

.table-container{
  margin-top: 20px
}

.search-container{
  display: flex;
  margin-bottom: 10px;
  .search-input:focus {
  outline: none; /* 파란색 테두리 제거 */

}
}

table {
  width: 100%;
  border-collapse: collapse; /* 테두리 중첩 방지 */
}


th, td {
  text-align: center;
  border: 1px solid #ddd;
  vertical-align: middle; /* 텍스트와 이미지 수직 정렬 */
  text-align: start;
  padding: 10px;
}

th{
  font-size: 16px;
  color: #555555;
  font-weight: bold;
  line-height: 20px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

td {
  height: 100px; /* td의 높이 고정 (예시값, 필요에 따라 조정 가능) */
  padding: 0px 10px;
}

/* 이미지가 칸에 정확히 꽉 차도록 설정 */
td.col-image img {
  width: 100%; /* td의 너비에 맞춤 */
  height: 100%; /* td의 높이에 맞춤 */
  object-fit: cover; /* 이미지 비율 유지하며 셀 공간을 꽉 채움 */
  display: block; /* 불필요한 여백 제거 */
}

.col-rank {
  width: 5%; /* 1 */
}

.col-image {
  width: 15%; /* 2 */
}

.col-name {
  width: 30%; /* 3 */
}

.col-stat {
  width: 20%; /* 2 / 2 */
}

/* 이미지 열의 패딩 제거 */
td.col-image {
  padding: 0; /* 패딩 제거 */
}


td img {
  width: 100%; /* 너비를 셀 너비에 맞춤 */
  height: 100px; /* 높이를 셀 높이에 맞춤 */
  object-fit: cover; /* 이미지 비율을 유지하면서 셀에 꽉 채움 */
  border-radius: 5px; /* 이미지 모서리를 둥글게 (선택 사항) */
}

.active {
  font-weight: bold;
  text-decoration: underline;
}

button {
  margin: 5px;
  padding: 5px 10px;
}

.progress-container {
  position: relative;
  background-color: #f5f5f5;
  border-radius: 5px;
  height: 20px;
  width: 100%;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #ff6b6b; /* 우승 비율 색상 */
  border-radius: 5px 0 0 5px;
  transition: width 0.3s ease-in-out;
}

.progress-bar.success {
  background-color: #ffa502; /* 승률 색상 */
}

.progress-text {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7); /* 검정색(#000) + 70% 투명도 */
  font-weight: bold;
  line-height: 20px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  margin: 0 5px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #ddd;
}

.pagination button.active {
  background-color: #4285f4;
  color: #fff;
  border-color: #4285f4;
  font-weight: bold;
}
</style>