<template>
  <nav class="gnb">
    <div class="gnb-container">
      <ul class="gnb-nav">
        <li class="nav-tab logo"><router-link to="/introduction">undefined</router-link></li>
        <li class="nav-tab" :class="{ active: $route.path === '/' }">
          <router-link to="/">이상형 월드컵</router-link>
        </li>
        <li class="nav-tab" :class="{ active: $route.path === '/create-wldcup' }">
          <a href="javascript:void(0)" @click="navigateTo('/create-wldcup')">월드컵 만들기</a>
        </li>
        <li class="nav-tab" :class="{ active: $route.path === '/my-page' }">
          <a href="javascript:void(0)" @click="navigateTo('/my-page')">마이페이지</a>
        </li>
        <li class="nav-tab" :class="{ active: $route.path === '/wldcup-result' }">
          <router-link to="/wldcup-result">랭크</router-link>
        </li>
        <li>
          <button @click="toggleTheme">
            <img class="btn-toggle-theme" :src="isDarkMode ? require('@/assets/dark-mode-icon.png') : require('@/assets/light-mode-icon.png')" alt="" />
          </button>
        </li>
        <div :class="['auth-container', { 'em': !isLoggedIn }]">
          <li v-if="!isLoggedIn || this.$route.path === '/sign-up'">
            <router-link to="/sign-in">로그인</router-link>
          </li>
          <li v-else>
            <button @click="signOut">로그아웃</button>
          </li>
        </div>
      </ul>
      <ul class="gnb-nav-filter" v-show="gnbNavFilterVisible && $route.path === '/'">
        <li><button class="btn-toggle" :class="{'active': isPopularityActive}" @click="setSortFilter('popular')">인기순</button></li>
        <li><button class="btn-toggle" :class="{'active': !isPopularityActive}" @click="setSortFilter('latest')">최신순</button></li>
        <li>
          <div class="search-container">
            <input v-model="searchQuery" type="text" class="search-input" placeholder="검색어 입력" @keyup.enter="searchWldcups" />
            <button v-if="searchQuery" class="btn-clear" @click="clearSearch">
              <span class="icon">close</span>
            </button>
          </div>
        </li>
        <li><CommonButton variant="white" :onclick="searchWldcups" style="border: 2px solid var(--theme)">검색</CommonButton></li>
      </ul>
    </div>
    <LoginWarningModal
        v-if="isModalVisible"
        :message="modalMessage"
        @close="closeModal"
        @confirm="confirmModal"
    />
  </nav>
</template>

<script>
  import { auth } from '@/services/firebase/auth';
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import { fetchAllWldcups } from '@/services/firebase/db.js';
  import CommonButton from '@/components/buttons/CommonButton.vue';
  import LoginWarningModal from '@/components/modals/LoginWarningModal.vue';

  export default {
    name: 'GNB',
    components: {
      CommonButton,
      LoginWarningModal
    },
    data() {
      return {
        lastScrollPosition: 0,      // 마지막 스크롤 위치
        isDarkMode: null,
        isLoggedIn: false,          // 로그인 상태
        gnbNavFilterVisible: true, // 초기 상태는 true
        searchQuery: '',
        isPopularityActive: true,
        isModalVisible: false,
        modalMessage: '',
        modalConfirmRoute: '',
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
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
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
          const currentPath = this.$route.path;

          await signOut(auth);
          this.isLoggedIn = false;

          if (currentPath === '/create-wldcup') {
            this.showModal('로그인 상태에서만 월드컵을 만들 수 있어요.\n로그인하러 가시겠어요?', currentPath);
          } else if (currentPath === '/my-page') {
            this.showModal('로그인 상태에서만 확인할 수 있어요.\n로그인하러 가시겠어요?', currentPath);
          } else if (currentPath === '/') {
            window.location.reload();
          } else {
            this.$router.push('/');
          }
        } catch (error) {
          console.error('로그아웃 실패:', error);
        }
      },
      navigateTo(targetPath) {
        if (!this.isLoggedIn) {
          if (targetPath === '/create-wldcup') {
            this.showModal(
                '로그인 상태에서만 월드컵을 만들 수 있어요.\n로그인하러 가시겠어요?',
                targetPath
            );
          } else if (targetPath === '/my-page') {
            this.showModal(
                '로그인 상태에서만 확인할 수 있어요.\n로그인하러 가시겠어요?',
                targetPath
            );
          }
        } else {
          this.$router.push(targetPath);
        }
      },
      showModal(message, targetPath) {
        this.modalMessage = message;
        this.modalConfirmRoute = targetPath;
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
        this.$router.push('/');
      },
      confirmModal() {
        this.isModalVisible = false;
        localStorage.setItem('targetPath', this.modalConfirmRoute);
        console.log(this.modalConfirmRoute)
        this.$router.push('/sign-in');
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
    background-color: whitesmoke;
  }

  .gnb-nav {
    display: flex;
    gap: 2rem;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .nav-tab, .logo {
    color: black; /* 다크모드 시에도 GNB는 독립적인 색상을 유지 */
  }

  .auth-container {
    padding-right: 10px;
    margin-left: auto;
    display: flex;
  }
  .em {
    background-color: var(--theme);
    border-radius: 5px;
  }

  .gnb-nav-filter {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  ul {
    padding: 0;
    margin: 0;
  }
  li {
    padding: 10px 15px;
    list-style-type: none;
    color: black;
  }
  li.logo {
    padding-left: 100px;
    border: 5px solid var(--theme);
    background-color: var(--theme);
    border-radius: 0 5px 5px 0;
  }
  li.nav-tab {
    margin-bottom: 2px; /* 현재 탭 하단 바 두께와 동일해야 함 */
    padding-bottom: 5px;
  }
  li.nav-tab.active {
    border-bottom: 2px solid var(--theme);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .btn-toggle-theme {
    width: 20px;
    height: 20px;
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
    border-radius: 6px;
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