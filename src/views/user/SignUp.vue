<template>
  <div class="signup-container">
    <div class="signup-content">
      <div class="header">회원가입</div>
      <form class="signup-form" @submit.prevent="signUp">
        <div class="signup-line email">
          <div class="left">이메일</div>
          <input class="right" v-model="email" type="email" placeholder="user@gmail.com" maxlength="30" />
        </div>
        <div class="signup-line password">
          <div class="left">비밀번호</div>
          <input class="right" v-model="password" type="password" placeholder="********" />
        </div>
        <div class="signup-line nickname">
          <div class="left">닉네임</div>
          <input class="right" :value="nickname" @input="updateNickname" placeholder="홍길동" maxlength="10" />
        </div>
        <div class="signup-line birthday">
          <div class="left">생년월일</div>
          <input class="right" v-model="birthday" @input="autoHyphen" placeholder="YYYY-MM-DD" maxlength="10" />
        </div>
        <div>
        <div class="signup-line phoneNumber">
          <div class="left">전화번호</div>
          <div class="content-wrap">
            <input class="right" style="border:none" v-model="phoneNumber" @input="autoPhoneHyphen" placeholder="010-0000-0000" maxlength="15" />
            <button class="submit-btn" id="verificationPhone" @click="submitPhone">발송</button>
          </div>
        </div>
        <div class="submit-status" v-if="submitStatus">{{ submitStatus }}</div>
      </div>
      <div>
        <div class="signup-line verification">
          <div class="left">인증번호</div>
          <div class="content-wrap">
            <input class="right" style="border:none" placeholder="인증번호 6자리" v-model="verification" @input="updateVerification" maxlength="6" />
            <button class="confirm-btn" id="confirmVerification" @click="confirmVerification">확인</button>
          </div>
        </div>
        <div class="submit-status" v-if="verificationMessage">{{ verificationMessage }}</div>
      </div>
        <div class="signup-line gender">
          <div class="gender-list">
            <button
              type="button"
              :class="['gender-btn', { selected: gender === 'M' }]"
              @click="selectGender('M')"
              style="color: inherit"
            >남성</button>
            <button
              type="button"
              :class="['gender-btn', { selected: gender === 'F'}]"
              @click="selectGender('F')"
              style="color: inherit"
            >여성</button>
          </div>
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
  import { auth, createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from '@/services/firebase/auth';
  import { createUser } from '@/services/firebase/db';

  auth.languageCode = 'ko';

  export default {
    name: 'SignUp',
    data() {
      return {
        email: '',
        password: '',
        nickname: '',
        birthday: '',
        phoneNumber: '',
        noHyphenPhoneNumber: '',
        submitStatus: '',
        verification: '',
        verificationStatus: '',
        verificationMessage: '',
        gender: '',
        errorMessage: ''
      };
    },
    mounted() {
      document.title = '이상형 월드컵 : 회원가입';

      window.recaptchaVerifier = new RecaptchaVerifier(auth,'verificationPhone', {
        size: 'invisible', callback: (response) => {
          console.log("reCAPTCHA 통과:", response);
        },
      });
      document.getElementById("confirmVerification").addEventListener("click", (e) => {
        e.preventDefault();
        const code = this.verification;
        window.confirmationResult.confirm(code)
          .then((result) => {
            this.verificationStatus = 'Y';
            this.verificationMessage = '인증되었습니다.'
          })
          .catch((error) => {
            console.log("error :", error);
            // firebaseError(error)
        });
      });
    },
    methods: {
      /**
       * Firebase Auth 연동 회원가입 및 DB에 회원 데이터 추가
       */
      async signUp() {
        if (!this.validate()) return;

        try {
          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
          const user = {
            uid: userCredential.user.uid,
            email: this.email,
            nickname: this.nickname,
            birthday: this.birthday,
            gender: this.gender,
            metadata: userCredential.user.metadata,
          }

          await createUser(user);

          // TODO: 회원가입 완료 페이지로 랜딩 + 자동 로그인 처리 (세션 60분)
          //   해당 페이지 상단에서 멤버스 혜택 설명
          //   해당 페이지 하단에서 시작하기 버튼 제공, 클릭 시 홈으로 이동
          this.$router.push('/');
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
      /**
       * 회원가입 유효성 검사
       * @returns {boolean}
       */
      validate() {
        // TODO: 입력 값이 있는지만 체크하는 약한 검증 레벨임. 깊이 있는 검증 레벨로 개선 필요
        if (!this.email) {
          this.errorMessage = '이메일을 입력해주세요.';
          return false;
        }
        if (!this.password) {
          this.errorMessage = '비밀번호를 입력해주세요.';
          return false;
        }
        // TODO: password 강도 체크
        if (!this.nickname) {
          this.errorMessage = '닉네임을 입력해주세요.';
          return false;
        }
        // TODO: nickname 특수문자, 비속어 필터링
        if (!this.birthday) {
          this.errorMessage = '생년월일을 입력해주세요.';
          return false;
        }

        if (!this.verificationStatus) {
          this.errorMessage = '인증번호를 입력해주세요';
          return false;
        }

        // TODO: birthday 숫자, 공백, `.` 문자만 포함 (정규식)
        if (!this.gender) {
          this.errorMessage = '성별을 선택해주세요.';
          return false;
        }

        return true;
      },
      selectGender(gender) {
        this.gender = gender; // 성별 버튼 선택 시 데이터 바인딩, 'M' 또는 'F'
      },
      updateNickname(e) {
        this.nickname = e.target.value; // 닉네임 입력 값 양방향 바인딩
      },
      /**
       * 생년월일 입력 시, YYYY-MM-DD 형식으로 '-' 문자 자동 포맷
       */
      autoHyphen(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 4) {
          value = value.slice(0, 4) + '-' + value.slice(4);
        }
        if (value.length > 7) {
          value = value.slice(0, 7) + '-' + value.slice(7);
        }
        this.birthday = value;
      },
      autoPhoneHyphen(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 3) {
          value = value.slice(0, 3) + '-' + value.slice(3);
        }
        if (value.length > 8) {
          value = value.slice(0, 8) + '-' + value.slice(8);
        }
        this.phoneNumber = value;
        this.noHyphenPhoneNumber = value.replace(/-/g, '');
      },
      updateVerification(e) {
        this.verification = e.target.value; // 인증번호 값 바인딩
      },

      submitPhone(e) {
        e.preventDefault();
        const phoneNumber = "+82" + this.noHyphenPhoneNumber //한국 지역번호 +82
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            this.submitStatus = '발송 되었습니다.';
          }).catch((error) => {
            console.log("에러",error)
          });
      }
    },
    watch: {
      email(value) {
        if (value && this.errorMessage.includes('이메일')) {
          this.errorMessage = '';
        }
      },
      password(value) {
        if (value && this.errorMessage.includes('비밀번호')) {
          this.errorMessage = '';
        }
      },
      nickname(value) {
        if (value && this.errorMessage.includes('닉네임')) {
          this.errorMessage = '';
        }
      },
      birthday(value) {
        if (value && this.errorMessage.includes('생년월일')) {
          this.errorMessage = '';
        }
      },
      gender(value) {
        if (value && this.errorMessage.includes('성별')) {
          this.errorMessage = '';
        }
      },
    },
  };
</script>

<style scoped>
  .signup-container {
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

  input {
    outline: none;
  }

  .signup-content {
    /* padding: 2rem; */
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 25px 35px;
  }
  .signup-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 290px;
    .signup-line {
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
        display: flex;
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
    border-color: var(--theme);
    border-right-width: 2px;
  }
  .gender-btn.selected:last-child {
    border-color: var(--theme);
    border-left-width: 2px;
  }
  
  .signup-button {
    width: 100%;
    /* margin-top: 1.5rem; */
    background-color: var(--theme);
    border: none;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  .signup-button:hover {
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

  .content-wrap {
    display: flex;
    align-items: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    width : 213px;
  }
  .content-wrap input {
    width: 128.5px; /* NOTE: 당장 고쳐야 해서 급하게 하드코딩 */
  }
  .content-wrap button {
    margin-right: 4px;
  }

  .submit-btn, .confirm-btn {
    background-color: white;
    border: 2px solid var(--theme);
    border-radius: 5px;
    font-size: 13px;
    padding: 2px 10px;
    cursor: pointer;
    width: 3.2rem;
  }

  .submit-status {
    font-size: 12px;
    color: crimson;
    text-align: end;
    padding: 1px 20px 0px 0px;
  }
</style>
