<template>
  <div class="profile-detail">
    <p>{{ user.nickname }}</p>
    <p>{{ user.email }}</p>
    <p>{{ user.gender }}</p> <!-- 성별은 포맷 -->
    <p>{{ user.birthday }}</p>
    <p>{{ user.createdAt }}</p>
    <p>{{ user.lastLoginedAt }}</p>
  </div>
</template>

<script>
import { auth, onAuthStateChanged } from "@/services/firebase/auth";
import { getUser } from "@/services/firebase/db";

export default {
    name: 'ProfileDetail',
    data() {
      return {
        user: {
          nickname: '',
          email: '',
          emailVerified: '',
          gender: '',
          birthday: '',
          createdAt: '',
          lastLoginedAt: '',
        },
      };
    },
    created() {
      // TODO: 구현이 시급하여 props 전달 받지 않고 API 또 쏨,
      //  추후 router로 데이터 전달받을 수 있도록 수정
      //   ㄴ 개인정보를 url param에 담는 건 너무 상남자 코딩 같은데, sessionStorage 같은 공간에 담는 방향으로 진행
      onAuthStateChanged(auth, async (user) => {
        if (user) this.user = await getUser(user);
      });
      // TODO END
    },
    methods: {
    }
  };
</script>

<style scoped>

</style>
