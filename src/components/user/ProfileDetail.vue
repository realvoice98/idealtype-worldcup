<template>
  <div class="profile-container">
    <div class="profile-title">
      <strong>내 프로필 정보</strong>
    </div>
    <div class="profile-content">
      <div class="content-item">
        <div class="label-wrap">
          <span class="icon">abc</span>
          <span class="label">닉네임</span>
        </div>
        <p>{{ user.nickname }}</p>
      </div>
      <div class="content-item">
        <div class="label-wrap">
          <span class="icon">email</span>
          <span class="label">이메일</span>
        </div>
        <p>{{ user.email }}</p>
      </div>
      <div class="content-item">
        <div class="label-wrap">
          <span class="icon">male</span>
          <span class="label">성별</span>
        </div>
        <p>{{ formattedGender }}</p>
      </div>
      <div class="content-item">
        <div class="label-wrap">
          <span class="icon">cake</span>
          <span class="label">생년월일</span>
        </div>
        <p>{{ user.birthday }}</p>
      </div>
      <div class="content-item">
        <div class="label-wrap">
          <span class="icon">person_add</span>
          <span class="label">가입일자</span>
        </div>
        <p>{{ user.createdAt }}</p>
      </div>
      <div class="content-item">
        <div class="label-wrap">
          <span class="icon">update</span>
          <span class="label">마지막 로그인 시간</span>
        </div>
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
    computed: {
      formattedGender() {
        return this.user.gender === 'M' ? '남자' : this.user.gender === 'F' ? '여자' : '알 수 없음';
      },
    },
    methods: {
    },
  };
</script>

<style scoped>
  .profile-container {
    padding: 0;
    width: 90%;
    border: 1px solid var(--theme);
    border-radius: 8px;
  }

  .profile-title {
    padding: 10px 0;
    background-color: var(--theme);
    border-radius: 8px 8px 0 0;
  }

  .content-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 1.5rem;
    border-bottom: 1px solid lightgray;
  }
  .content-item:last-child {
    border-bottom: none;
  }
  .content-item p {
    text-align: left;
    padding: 0;
    margin: 0;
  }

  .label-wrap {
    flex-direction: row;
    display: flex;
    margin-bottom: 0.5rem;
  }
  .icon {
    font-size: 1.3rem;
    color: dimgray;
    margin-right: 0.5rem;
  }
  .label {
    margin-right: 20px;
    color: dimgray;
  }

  .until-bday {
    color: var(--theme);
    margin-left: 1.5rem;
    font-size: 0.85rem;
  }
</style>
