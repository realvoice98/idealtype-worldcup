<template>
  <div class="signin-container">
    <div class="signin-content">
      <div class="header">로그인</div>
      <form class="sign-in-form" @submit.prevent="signIn">
        <div class="sign-in-line">
          <div class="left">이메일</div>
          <input class="right" v-model="email" type="email" placeholder="이메일" required />
        </div>
        <div class="sign-in-line">
          <div class="left">비밀번호</div>
          <input class="right" v-model="password" type="password" placeholder="비밀번호" required />
        </div>
        <button class="login-button" type="submit">로그인</button>
      </form>
      <div class="bottom-container">
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      이상형 월드컵에 처음 오셨나요? <router-link class= "go-sign-up" to="/sign-up">회원가입하기</router-link>
    </div>
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
          this.$router.push('/');

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
  
  

  
</style>