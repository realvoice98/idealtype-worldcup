<template>
  <div class="signin-container">
    <div class="signin-content">
      <div class="header">로그인</div>
      <form class="signin-form" @submit.prevent="signIn">
        <div class="signin-line">
          <div class="left">이메일</div>
          <input class="right" v-model="email" type="email" placeholder="이메일" required />
        </div>
        <div class="signin-line">
          <div class="left">비밀번호</div>
          <input class="right" v-model="password" type="password" placeholder="비밀번호" required />
        </div>
        <button class="login-button" type="submit">로그인</button>
      </form>
      <div class="bottom-container">
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      이상형 월드컵에 처음 오셨나요? <router-link class= "go-signup" to="/sign-up" style="color: var(--theme)">회원가입하기</router-link>
    </div>
    </div>
  </div>
</template>

<script>
  import { auth, signInWithEmailAndPassword } from '@/services/firebase/auth';
  import {updateLastLogin} from "@/services/firebase/db";

  export default {
    name: 'SignIn',
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
          const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
          const uid = userCredential.user.uid

          await updateLastLogin(uid);

          const targetPath = localStorage.getItem('targetPath') || '/';
          localStorage.removeItem('targetPath');
          this.$router.push(targetPath);


          // TODO: 60분 간 세션 유지

        } catch (e) {
          if (e.code === 'auth/invalid-credential') {
            this.errorMessage = '유효하지 않은 정보입니다.\n이메일과 비밀번호를 다시 확인해주세요.';
          } else {
            this.errorMessage = `오류: ${e.message}`;
          }
        }
      }
    },
    mounted() {
      document.title = '이상형 월드컵 : 로그인';
    }
  };
</script>

<style scoped>
  .signin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 75vh;
  }
  .header {
    font-size: 35px;
    padding:15px 10px;
    font-weight: 700;
  }
  .signin-content {
    /* padding: 2rem; */
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 25px 35px;
  }
  .signin-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    .signin-line {
      display: flex;
      gap: 10px;
      .left {
        flex:1;
        justify-content: start;
        display: flex;
        align-items: center;
      }
      .right {
        flex:3;
        padding: 8px 10px;
        border-radius: 3px;
        border: 1px solid #ccc;
      }
    }
  }
    
  .login-button {
    width: 100%;
    /* margin-top: 1.5rem; */
    background-color: var(--theme);
    border: none;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  .login-button:hover {
    color:white;
    transition: 0.3s;
  }
    
  .bottom-container {
    margin-top: 10px;
    .go-signup {
    /* color: black; */
    text-decoration: none;
    color: black;
    }
    .go-signup:hover {
      /* color: black; */
      color: var(--theme);
    }
  }
</style>