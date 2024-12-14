<template>
  <LoadingSpinner :visible="isLoading" />
  <div>
    <table>
      <thead>
      <tr>
        <th></th>
        <th>식별코드</th>
        <th>생성자</th>
        <th>제목</th>
        <th>설명</th>
        <th>조회수</th>
        <th>좋아요</th>
        <th>최대 라운드</th>
        <th>마지막 업데이트 날짜</th>
        <th>해시태그</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(wldcup, index) in wldcups" :key="wldcup.wldcupId">
        <td>{{ index + 1 }}</td>
        <td>{{ wldcup.wldcupId }}</td>
        <td>{{ wldcup.creator }}</td>
        <td>{{ wldcup.title }}</td>
        <td>{{ wldcup.details }}</td>
        <td>{{ wldcup.views }}</td>
        <td>{{ wldcup.likeCount || 0 }}</td>
        <td>{{ calcRounds(wldcup.images.length) }}</td>
        <td>{{ wldcup.updatedAt }}</td>
        <td>{{ wldcup.hashtags }}</td>
      </tr>
      </tbody>
    </table>

    <router-view />
  </div>
</template>

<script>
import { fetchUserWldcups } from '@/services/firebase/db';
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";

export default {
  name: 'CreatedWorldcups',
  components: {LoadingSpinner},
  data() {
    return {
      wldcups: [],
      isLoading: false,
    };
  },
  async created() {
    await this.loadWldcups();
  },
  watch: {
    '$route.query.uid': 'loadWldcups',
  },
  methods: {
    async loadWldcups() {
      try {
        this.isLoading = true;
        let initWldcups = Array.isArray(await fetchUserWldcups(this.$route.query.uid))
            ? await fetchUserWldcups(this.$route.query.uid)
            : [];

        this.wldcups = initWldcups.map((item) => {
          if (Array.isArray(item.hashtags)) {
            item.hashtags = item.hashtags
                .map((hashtag) => hashtag.replace('__HASH__', '#'))
                .join(', ');
          }

          return {
            ...item,
          };
        });
      } catch (error) {
        console.error('불러오기 실패:', error);
      }
      finally {
        this.isLoading = false;
      }
    },
    calcRounds(totalItemCnt) {
      return Math.pow(2, Math.floor(Math.log2(totalItemCnt))); // 가장 가까운 2의 제곱수 (최대 라운드)
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

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: var(--theme);
}
</style>
