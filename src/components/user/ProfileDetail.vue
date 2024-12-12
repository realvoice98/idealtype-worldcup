<template>
  <div class="profile-container">
    <div class="profile-title">
      <strong>내 프로필 정보</strong>
    </div>
    <div class="profile-content">
      <div class="content-item">
        <p>{{ user.nickname }}</p>
      </div>
      <div class="content-item">
        <p>{{ user.email }}</p>
      </div>
      <div class="content-item">
        <p>{{ user.gender }}</p> <!-- 성별은 포맷 -->
      </div>
      <div class="content-item">
        <p>{{ user.birthday }}</p>
      </div>
      <div class="content-item">
        <p>{{ user.createdAt }}</p>
      </div>
      <div class="content-item">
        <p>{{ user.lastLoginedAt }}</p>
      </div>
    </div>
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
    },
  };
</script>

<style scoped>
  .profile-container {
    background-color: red;

  }

  .profile-title {
    background-color: var(--theme);
  }

  .profile-content {
    border: 2px solid lightgray;
    padding: 0 2rem;
  }
  .content-item {
    border-bottom: 1px solid lightgray;
  }
  .content-item:last-child {
    border-bottom: none;
  }
  p {
    padding: 0;
    margin: 0;
  }
</style>
