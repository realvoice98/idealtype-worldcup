<template>
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
          <td>{{ wldcup.title }}</td>
          <td>{{ wldcup.details }}</td>
          <td>{{ wldcup.views }}</td>
          <td>{{ wldcup.likes }}</td>
          <td>{{ calcRounds(wldcup.images) }}</td>
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

  export default {
    name: 'CreatedWorldcups',
    data() {
      return {
        wldcups: [],
      };
    },
    async created() {
      this.wldcups = await fetchUserWldcups(); // TODO: a태그에서 받아온 user context로 param 주입
    },
    methods: {
      calcRounds(totalItemCnt) {
        const rounds = [];
        let current = Math.pow(2, Math.floor(Math.log2(totalItemCnt))); // 가장 가까운 2의 제곱수 (최대 라운드)

        // 라운드의 최소값은 4강
        while (current >= 4) {
          rounds.push(current);
          current /= 2;
        }
        return rounds; // ex. [ 128, 64, 32, 16, 8, 4 ]
      },
    },
  };
</script>

<style scoped>
  table {
    margin-top: 2.5rem;
    width: 100%;;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background-color: var(--theme);
  }
</style>