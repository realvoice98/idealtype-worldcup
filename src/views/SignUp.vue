<template>
  <div class="signup-container">
    <div class="signup-content">
      <h1>회원가입</h1>
      <form @submit.prevent="signUp">
        <div>
          <label for="email">이메일</label>
          <input v-model="email" type="email" placeholder="이메일" required />
        </div>
        <br>
        <div>
          <label for="password">비밀번호</label>
          <input v-model="password" type="password" placeholder="비밀번호" required />
        </div>
        <button type="submit">회원가입</button>
      </form>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
  import { auth, createUserWithEmailAndPassword } from '@/services/firebase/auth';

  export default {
    name: 'SignUp',
    data() {
      return {
        email: '',
        password: '',
        errorMessage: '',
      };
    },
    methods: {
      /** Firebase Authentication 연동 회원가입 */
      async signUp() {
        try {
          await createUserWithEmailAndPassword(auth, this.email, this.password);
          alert("회원가입 완료!");
          // TODO: 자동 로그인 처리 (60분 간 세션 유지)
          location.href = origin;
        } catch (e) {
          if (e.code === 'auth/email-already-in-use') {
            this.errorMessage = '이미 가입된 이메일입니다.';
          } else if (e.code === 'auth/weak-password') {
            this.errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.';
          } else {
            this.errorMessage = `오류: ${e.message}`;
          }
        }
      },
    },
  }
</script>

<style>
  .signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 75vh;
  }

  .signup-content {
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
</style>