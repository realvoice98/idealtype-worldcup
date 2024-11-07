<template>
  <div class="signup-container">
    <div class="signup-content">
      <div class="header">회원가입</div>
      <form class="sign-up-form" @submit.prevent="signUp">
        <div class="sign-up-line">
          <div class="left" for="email">이메일</div>
          <input class="right" v-model="email" type="email" placeholder="이메일" required />
        </div>
        <div class="sign-up-line">
          <div class="left" for="password">비밀번호</div>
          <input class="right" v-model="password" type="password" placeholder="비밀번호" required />
        </div>
        <button class="signup-button" type="submit">회원가입</button>
      </form>
      <div class="bottom-container">
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </div>
    </div>
  </div>
</template>

<script>
  import { auth, createUserWithEmailAndPassword } from '@/services/firebase/auth';
  import { saveUserToDatabase } from '@/services/firebase/db';

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
      /** Firebase Auth 연동 회원가입 및 DB에 회원 데이터 추가 */
      async signUp() {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
          const user = userCredential.user;

          await saveUserToDatabase(user);

          // FIXME: 회원가입 완료 페이지로 랜딩
          // FIXME: 해당 페이지 상단에서 멤버스 혜택 설명
          // FIXME: 해당 페이지 하단에서 시작하기 버튼 제공, 클릭 시 자동 로그인(세션 60분) 및 홈으로 이동
          location.href = origin;
          // FIXME END
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

<style scoped>
  .header{
    font-size: 35px;
    padding:15px 10px;
    font-weight: 700;
  }

  .signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 75vh;
  }

  .signup-content {
    /* padding: 2rem; */
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 25px 35px;
  }
  .sign-up-form{
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 290px;
    .sign-up-line{
      display: flex;
      gap: 10px;
      .left{
        flex:1;
        justify-content: start;
        display: flex;
        align-items: center;
      }
      .right{
        flex:3;
        padding: 8px 10px;
        border-radius: 3px;
        border: 1px solid #ccc;
      }
    }
  }

  .signup-button {
    width: 100%;
    /* margin-top: 1.5rem; */
    background-color: #98B7D4;
    border: none;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  .signup-button:hover{
    color:white;
    transition: 0.3s;
  }

  .bottom-container{
    margin-top: 10px;
    .go-sign-up {
    /* color: black; */
    text-decoration: none;
    color: black;
  }
  .go-sign-up:hover{
    /* color: black; */
    color: #98B7D4;
  }
  }
  

  
</style>