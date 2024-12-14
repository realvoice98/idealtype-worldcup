<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode, 'light-mode': !isDarkMode }">
    <GlobalNavBar v-if="isGnbVisible" :isDarkMode="isDarkMode" />
    <CustomModal v-if="isModalVisible" :visible="isModalVisible" @close="closeModal" />
    <router-view />
  </div>
</template>

<script>
  import GlobalNavBar from '@/components/GlobalNavBar.vue';
  import CustomModal from '@/components/modals/LoginWarningModal.vue';
  import { onAuthStateChanged } from 'firebase/auth';
  import { auth } from '@/services/firebase/auth';
  import { nextTick } from 'vue';
  import router from '@/router';
  export default {
    name: 'App',
    components: {
      GlobalNavBar,
      CustomModal,
    },
    data() {
      return {
        isGnbVisible: true,
        isDarkMode: false, // 초기 상태는 라이트모드
        isModalVisible: false, // 모달 상태 추가
        isAuthEmailModalVisible : false,
      };
    },
    mounted() {
      this.checkGnbVisibility();
      // 로컬 스토리지에서 테마 상태 가져오기
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'light';
      this.setupRouterGuard();
      this.checkAuthEmail();
    },
    watch: {
      // route가 변경될 때마다 GNB 상태 확인
      '$route': 'checkGnbVisibility',
    },
    methods: {
      /**
       * 현재 접속 계정의 관리자 권한 여부 검사
       * @param auth 현재 계정 정보
       */
      checkAdmin(auth) {
        // TODO: 관리자 여부 검사
      },
      /**
       * 현재 페이지에 따라 GNB 노출 상태 제어
       * @returns {boolean} GNB 노출 여부
       */
      checkGnbVisibility() {
        const url = this.$route.path; // 현재 route 경로

        // FIXME: 현재 url 데이터로 GNB 노출 유무를 제어하고 있는데,
        //  관리자 계정으로 bo url 접근인 경우
        //  GNB 컴포넌트 자체에 대해서 전혀 고려하지 않는 별개의 페이지 환경으로 조성되어야 함
        this.isGnbVisible = !url.startsWith('/bo'); // 관리자 페이지는 GNB 미노출
      },
      openModal() {
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
      },
      openAuthEmailModal() {
        this.isAuthEmailModalVisible = true;
      },
      closeAuthEmailModal() {
        this.isAuthEmailModalVisible = false;
      },
      setupRouterGuard() {
        router.beforeEach((to, from, next) => {
          onAuthStateChanged(auth, (user) => {
            const isLoggedIn = !!user;

            if (to.meta.requiresAuth && !isLoggedIn) {

              nextTick(() => {
                this.openModal();
              });

              next({name: 'SignIn'});
            } else {
              next();
            }
          });
        });
      },
      checkAuthEmail() {
        router.beforeEach((to, from, next) => {
          onAuthStateChanged(auth, (user) => {
            const isLoggedIn = !!user;

            if (to.meta.requiresAuth && !isLoggedIn) {

              nextTick(() => {
                this.openAuthEmailModal();
              });

              // next({name: 'SignUp'});
            } else {
              next();
            }
          });
        });
      },
    },
  };
</script>

<style>
  /* 기본값 설정 */
  :root {
    --background-color: #fff;
    --text-color: #000;
  }

  #app {
  }

  .dark-mode {
    --background-color: #333;
    --text-color: #fff;
  }

  .light-mode {
    --background-color: #fff;
    --text-color: #000;
  }

  html {
    background-color: var(--background-color, #fff);
    color: var(--text-color, #000);
    transition: background-color 0.5s, color 0.5s;
  }
</style>
