<template>
  <div>
    <h1>월드컵 목록</h1>
    <table>
      <thead>
      <tr>
        <th>번호</th>
        <th>월드컵 제목</th>
        <th>설명</th>
        <th>조회수</th>
        <th>좋아요 수</th>
        <th>작성자</th>
        <th>업데이트 시간</th>
        <th>삭제</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(wldcup, index) in wldcups" :key="wldcup.wldcupId">
        <td>{{ index + 1 }}</td>
        <td>{{ wldcup.title }}</td>
        <td>{{ wldcup.details }}</td>
        <td>{{ wldcup.views }}</td>
        <td>{{ wldcup.likeCount }}</td>
        <td>{{ wldcup.creator }}</td>
        <td>{{ formatDate(wldcup.updatedAt) }}</td>
        <td>
          <!-- X 버튼 -->
          <button @click="showModal(wldcup)" class="delete-btn">X</button>
        </td>
      </tr>
      </tbody>
    </table>

    <LoginWarningModal
        v-if="isModalVisible"
        :message="modalMessage"
        @close="closeModal"
        @confirm="confirmModal"
    />
  </div>
</template>

<script>
import {fetchAllWldcups, deleteWldcup, deleteImages} from '@/services/firebase/db';
import LoginWarningModal from "@/components/modals/LoginWarningModal.vue";

export default {
  name: 'WorldcupList',
  components: {LoginWarningModal},
  data() {
    return {
      wldcups: [],
      isModalVisible: false,
      wldcupToDelete: null,
      modalMessage: '',
    };
  },
  created() {
    this.loadWldcups();
  },
  methods: {
    async loadWldcups() {
      try {
        const wldcups = await fetchAllWldcups();
        if (Array.isArray(wldcups)) {
          this.wldcups = wldcups;
        } else {
          console.error('월드컵 목록을 불러오는 데 실패했습니다.', wldcups.message);
        }
      } catch (error) {
        console.error('에러 발생: 월드컵 목록을 불러오지 못했습니다.', error);
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    showModal(wldcup) {
      this.modalMessage = `${wldcup.title}를 삭제하시겠습니까?`;
      this.isModalVisible = true;
      this.wldcupToDelete = wldcup;
    },
    closeModal() {
      this.isModalVisible = false;
      this.wldcupToDelete = null;
    },
    confirmModal() {
      this.boDeleteWldcup();
    },
    async boDeleteWldcup() {
      try {
        if (!this.wldcupToDelete) return;

        const {creatorId, wldcupId, title} = this.wldcupToDelete;

        await deleteWldcup(creatorId, wldcupId);
        await deleteImages(creatorId, title);

        this.wldcups = this.wldcups.filter(wldcup => wldcup.wldcupId !== wldcupId);

        this.isModalVisible = false;
        this.wldcupToDelete = null;
      } catch (error) {
        console.error('오류: 월드컵 삭제 중 문제 발생', error);
      }
    },
  },
};
</script>

<style scoped>
table {
  margin-top: 2.5rem;
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: var(--theme);
}

/* 각 열의 너비를 비율로 설정 */
th:nth-child(1) {
  width: 5%; /* 번호 */
}
th:nth-child(2) {
  width: 20%; /* 월드컵 제목 */
}
th:nth-child(3) {
  width: 25%; /* 설명 */
}
th:nth-child(4) {
  width: 10%; /* 조회수 */
}
th:nth-child(5) {
  width: 10%; /* 좋아요 수 */
}
th:nth-child(6) {
  width: 10%; /* 작성자 */
}
th:nth-child(7) {
  width: 15%; /* 업데이트 시간 */
}
th:nth-child(8) {
  width: 5%; /* 삭제 */
}

button {
  padding: 5px 10px;
  color: red;
  border: none;
  cursor: pointer;
  font-size: 18px;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>