<template>
  <div>
    <h1>사용자 목록</h1>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>이메일</th>
          <th>이메일 인증 상태</th>
          <th>권한</th>
          <th>계정 생성일</th>
          <th>최근 로그인 시각</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.uid">
          <td>{{ index + 1 }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.emailVerified }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.createdAt }}</td>
          <td>{{ user.lastLoginedAt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { getAllUsers } from '@/services/firebase/db.js'

  export default {
    name: "UserList",
    data() {
      return {
        users: [],
      }
    },
    async created() {
      this.users = await getAllUsers(); // 컴포넌트 생성 시점에 유저 정보 조회
    },
    methods: {

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
    background-color: #f2f2f2;
  }
</style>