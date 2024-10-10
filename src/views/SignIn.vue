<template>
  <div class="signin-container">
    <div class="signin-content">
      <h1>로그인</h1>
      <form @submit.prevent="signIn">
        <div>
          <label for="email">이메일</label>
          <input v-model="email" type="email" placeholder="이메일" required />
        </div>
        <br>
        <div>
          <label for="password">비밀번호</label>
          <input v-model="password" type="password" placeholder="비밀번호" required />
        </div>
        <button type="submit">로그인</button>
      </form>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      <br>
      이상형 월드컵에 처음 오셨나요? <router-link to="/sign-up">회원가입하기</router-link>
    </div>
  </div>
</template>

<script>
  import { auth, signInWithEmailAndPassword } from '@/services/firebase/auth';

  export default {
    name: "SignIn",
    data() {
      return {
        email: '',
        password: '',
        errorMessage: '',
      };
    },
    methods: {
      /** Firebase Authentication 연동 로그인 */
      async signIn() {
        try {
          await signInWithEmailAndPassword(auth, this.email, this.password);
          location.href = origin;

          // TODO: 60분 간 세션 유지

        } catch (e) {
          if (e.code === 'auth/invalid-credential') {
            this.errorMessage = '유효하지 않은 정보입니다. 이메일과 비밀번호를 다시 확인해주세요.';
          } else {
            this.errorMessage = `오류: ${e.message}`;
          }
        }
      }
    },
  }
</script>

<style scoped>
  .signin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 75vh;
  }

  .signin-content {
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  label {
    margin-right: 1rem;
  }

  button {
    width: 100%;
    margin-top: 1.5rem;
  }

  a {
    color: black;
    text-decoration: none;
  }
</style>