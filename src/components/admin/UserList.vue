<template>
  <LoadingSpinner :visible="isLoading" />
  <div>
    <h1>사용자 목록</h1>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>닉네임</th>
          <th>이메일</th>
          <th>레벨</th>
          <th>경험치</th>
          <th>권한</th>
          <th>생년월일</th>
          <th>계정 생성일</th>
          <th>최근 로그인 시각</th>
          <th>성별</th>
          <th>생성한 월드컵</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.uid">
          <td>{{ index + 1 }}</td>
          <td>{{ user.nickname }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.level || 0 }}</td>
          <td>{{ user.exp || 0 }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.birthday }}</td>
          <td>{{ user.createdAt }}</td>
          <td>{{ user.lastLoginedAt }}</td>
          <td>{{ formattedGender(user.gender) }}</td>
          <td>
            <router-link
                :to="{ path: '/bo/user-list/created-wldcups', query: { uid: user.uid } }">
              {{ calcWldcupCnt(user.myWldcups) }}
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- TODO: 15개 단위 페이징 처리 -->

    <router-view />

  </div>
</template>

<script>
  import { getAllUsers } from '@/services/firebase/db.js'
  import { toRaw } from "vue";

  import CreatedWorldcups from '@/components/admin/CreatedWorldcups.vue';
  import LoadingSpinner from "@/components/common/LoadingSpinner.vue";

  export default {
    name: 'UserList',
    components: {
      LoadingSpinner,
      CreatedWorldcups,
    },
    data() {
      return {
        users: [],
        isLoading: false,
      }
    },
    async created() {
      try {
        this.isLoading = true;
        this.users = await getAllUsers(); // 컴포넌트 생성 시점에 유저 정보 조회
      } catch (error) {
        console.error('유저 정보 조회 실패:', error);
      } finally {
        this.isLoading = false;
      }
    },
    methods: {
      formattedGender(gender) {
        return gender === 'M' ? '남자' : gender === 'F' ? '여자' : '알 수 없음';
      },
      calcWldcupCnt(wldcups) {
        if (!wldcups) return 0;

        const rawData = toRaw(wldcups); // 타입이 Proxy(Object)인 경우, 별도로 JSON 파싱 필요
        return Object.keys(rawData).length;
      },
    },
  }
</script>

<style scoped>
  table {
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

  a {
    color: var(--theme);
    text-decoration: none;
  }
</style>