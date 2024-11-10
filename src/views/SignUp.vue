<template>
  <div class="signup-container">
    <div class="signup-content">
      <div class="header">회원가입</div>
      <form class="sign-up-form" @submit.prevent="signUp">
        <div class="sign-up-line email">
          <div class="left">이메일</div>
          <input class="right" v-model="email" type="email" placeholder="user@gmail.com" maxlength="30" required />
        </div>
        <div class="sign-up-line password">
          <div class="left">비밀번호</div>
          <input class="right" v-model="password" type="password" placeholder="********" required />
        </div>
        <div class="sign-up-line nickname">
          <div class="left">닉네임</div>
          <input class="right" placeholder="홍길동" maxlength="10" required />
        </div>
        <div class="sign-up-line calendar">
          <div class="left">생년월일</div>
          <input class="right" placeholder="YYYY. MM. DD" maxlength="13" required />
        </div>
        <!-- // TODO: 버튼 형식의 input으로 개선중 - 신건호 -->
        <div class="sign-up-line gender">
          <div class="gender-list">
            <button
              :class="['gender-btn', { selected: selectedGender === 'M' }]"
              @click="selectGender('M')"
            >
              남성
            </button>
            <button
              :class="['gender-btn', { selected: selectedGender === 'F'}]"
              @click="selectGender('F')"
            >
              여성
            </button>
          </div>
        </div>
        <!-- // TODO END: 버튼 형식의 input으로 개선중 - 신건호 -->
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
        selectedGender: '',
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
      selectGender(gender) {
        this.selectedGender = gender;
      }
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
  .sign-up-form {
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

  .gender-list {
    display: flex;
    width: 100%;
  }
  .gender-btn {
    flex: 1;
    padding: 0.4rem;
    border: 2px solid #ececec;
    border-radius: 4px;
    background: none;
    cursor: pointer;
    transition: border-color 0.5s ease;
  }
  .gender-btn:first-child {
    border-radius: 4px 0 0 4px;
    border-right-width: 1px;
  }
  .gender-btn:last-child {
    border-radius: 0 4px 4px 0;
    border-left-width: 1px;
  }
  .gender-btn.selected:first-child {
    border-color: #98B7D4;
    border-right-width: 2px;
  }
  .gender-btn.selected:last-child {
    border-color: #98B7D4;
    border-left-width: 2px;
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