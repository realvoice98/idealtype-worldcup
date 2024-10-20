<template>
  <nav class="gnb" :class="{ show: isVisible }">
    <div class="gnb-container">
      <ul class="gnb-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/introduction">undefined</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/">이상형 월드컵</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/create-worldcup">월드컵 만들기</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/my-page">마이페이지</router-link>
        </li>
        <li class="nav-item">
          <button @click="toggleTheme">
            <img class="btn-toggle-theme" :src="isDarkMode ? require('@/assets/light-mode-icon.png') : require('@/assets/dark-mode-icon.png')" alt="테마 변경" />
          </button>
        </li>
        <li class="nav-item" v-if="!isLoggedIn">
          <router-link class="nav-link" to="/sign-in">로그인</router-link>
        </li>
        <li class="nav-item" v-else>
          <button class="nav-link" @click="signOut">로그아웃</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import {auth} from '@/services/firebase/auth';
import {onAuthStateChanged, signOut as firebaseSignOut} from 'firebase/auth';

export default {
  name: 'GNB',
  data() {
    return {
      isVisible: true,         // 네비게이션의 표시 상태
      lastScrollPosition: 0,   // 마지막 스크롤 위치
      isDarkMode: true,       // 초기 상태는 라이트모드
      isLoggedIn: false,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);

    // 로컬 스토리지에서 테마 상태 가져오기
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme(); // 테마 적용

    // 사용자 인증 상태 확인
    onAuthStateChanged(auth, (user) => {
      this.isLoggedIn = !!user;
    });
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const currentScrollPosition = window.scrollY;
      this.isVisible = currentScrollPosition <= this.lastScrollPosition; // 상단 방향 스크롤 시 상단탭 표시
      this.lastScrollPosition = currentScrollPosition; // 마지막 스크롤 위치 업데이트
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('theme', this.isDarkMode ? 'light' : 'dark');
      this.applyTheme();
    },
    applyTheme() {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
      } else {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
      }
    },

    async signOut() {
      try {
        await firebaseSignOut(auth); // Firebase에서 로그아웃 처리
        this.isLoggedIn = false; // 로그인 상태 업데이트

        // 로그아웃 후 직접 라우터로 이동
        this.$router.push('/'); // 메인 페이지로 이동
      } catch (error) {
        console.error('로그아웃 실패:', error);
      }
    }



  },
};
</script>

<style scoped>
.gnb {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(51, 51, 51, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: translateY(-100%);
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.gnb.show {
  opacity: 1;
  transform: translateY(0);
}

.gnb-nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-item {
  list-style-type: none;
}

.nav-link {
  color: white;
  text-decoration: none;
}

button {
  background: transparent;
  border: none;
}

.btn-toggle-theme {
  width: 30px;
  height: 30px;
}
</style>
