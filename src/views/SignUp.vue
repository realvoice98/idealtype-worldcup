<template>
  <div class="signup-container">
    <div class="signup-content">
      <div class="header">회원가입</div>
      <form class="sign-up-form" @submit.prevent="signUp">
        <div class="sign-up-line email">
          <div class="left">이메일</div>
          <input class="right" v-model="email" type="email" placeholder="user@gmail.com" maxlength="30" />
        </div>
        <div class="sign-up-line password">
          <div class="left">비밀번호</div>
          <input class="right" v-model="password" type="password" placeholder="********" />
        </div>
        <div class="sign-up-line nickname">
          <div class="left">닉네임</div>
          <input class="right" :value="nickname" @input="updateNickname" placeholder="홍길동" maxlength="10" />
        </div>
        <div class="sign-up-line birthday">
          <div class="left">생년월일</div>
          <input class="right" v-model="birthday" placeholder="YYYY-MM-DD" maxlength="10" />
        </div>
        <div class="sign-up-line gender">
          <div class="gender-list">
            <button
              type="button"
              :class="['gender-btn', { selected: gender === 'M' }]"
              @click="selectGender('M')"
            >남성</button>
            <button
              type="button"
              :class="['gender-btn', { selected: gender === 'F'}]"
              @click="selectGender('F')"
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
  import { auth, createUserWithEmailAndPassword } from '@/services/firebase/auth';
  import { createUser } from '@/services/firebase/db';

  export default {
    name: 'SignUp',
    data() {
      return {
        email: '',
        password: '',
        nickname: '',
        birthday: '',
        gender: '',
        errorMessage: '',
      };
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
    }
  }
</script>

<style scoped>
</style>