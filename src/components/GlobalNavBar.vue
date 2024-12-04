<template>
  <nav class="gnb" >
    <div class="gnb-container">
      <ul class="gnb-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/introduction">undefined</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/">이상형 월드컵</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/create-wldcup">월드컵 만들기</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/my-page">마이페이지</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/wldcup-result">랭크</router-link>
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

      <ul class="gnb-nav-filter" v-show="gnbNavFilterVisible && $route.path === '/'">
        <li class="nav-item">
          <button class="btn-toggle" :class="{'active': isPopularityActive}" @click="setSortFilter('popular')">인기순</button>
        </li>
        <li class="nav-item">
          <button class="btn-toggle" :class="{'active': !isPopularityActive}" @click="setSortFilter('latest')">최신순</button>
        </li>
        <li class="nav-item">
          <div class="search-container">
            <input v-model="searchQuery" type="text" class="search-input" placeholder="검색어 입력" @keyup.enter="searchWldcups" />
            <button v-if="searchQuery" class="btn-clear" @click="clearSearch">x</button>
          </div>
        </li>
        <li class="nav-item">
          <CommonButton variant="white" :onclick="searchWldcups">검색</CommonButton>
        </li>
      </ul>

    </div>
  </nav>
</template>

<script>
  import { auth } from '@/services/firebase/auth';
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import { fetchAllWldcups } from '@/services/firebase/db.js';
  import CommonButton from '@/components/buttons/CommonButton.vue';

  export default {
    name: 'GNB',
    components: {
      CommonButton,
    },
    data() {
      return {
        lastScrollPosition: 0,      // 마지막 스크롤 위치
        isDarkMode: true,           // 초기 상태는 라이트모드
        isLoggedIn: false,          // 로그인 상태
        gnbNavFilterVisible: true, // 초기 상태는 true
        searchQuery: '',
        isPopularityActive: true,
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

        if (currentScrollPosition > this.lastScrollPosition) {
          this.gnbNavFilterVisible = false;
        } else {
          this.gnbNavFilterVisible = true;
        }

        this.lastScrollPosition = currentScrollPosition;
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
          await signOut(auth); // Firebase에서 로그아웃 처리
          this.isLoggedIn = false; // 로그인 상태 업데이트

          // 로그아웃 후 직접 라우터로 이동
          this.$router.push('/sign-in'); // 메인 페이지로 이동
        } catch(e) {
          console.error('로그아웃 실패:', e);
        }
      },
      setSortFilter(filter) {
        if (filter === 'popular') {
          this.isPopularityActive = true;
        } else if (filter === 'latest') {
          this.isPopularityActive = false;
        }
        fetchAllWldcups();
        this.$emit('updateSortFilter', filter);
      },
      // 검색 기능
      searchWldcups() {
        this.$emit("searchWldcups", this.searchQuery);
      },
      clearSearch() {
        this.searchQuery = '';
        this.$emit("clearSearchWldcups");
      },
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    background-color: var(--theme);
  }

  .gnb-nav {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .gnb-nav-filter {
    display: flex;
    gap: 1rem;
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

  .btn-toggle {
    padding: 0.5rem 1rem;
    background-color: var(--theme);
    color: white;
    cursor: pointer;
  }

  .btn-toggle.active {
    font-weight: bold;
    font-size: 1.02rem;
  }

  .search-input {
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 350px;
    margin-left: 50px;
    padding-right: 30px;
  }
  .search-container {
    position: relative;
  }
  .btn-clear {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    font-size: 16px;
    cursor: pointer;
    color: #888;
  }

  .btn-clear:hover {
    color: #000;
  }
</style>