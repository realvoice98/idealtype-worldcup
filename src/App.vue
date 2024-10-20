<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode, 'light-mode': !isDarkMode }">
    <GlobalNavBar v-if="isGnbVisible" :isDarkMode="isDarkMode" @toggleTheme="toggleTheme" />
    <router-view />
  </div>
</template>

<script>
import GlobalNavBar from "@/components/GlobalNavBar.vue";

export default {
  name: 'App',
  components: {
    GlobalNavBar,
  },
  data() {
    return {
      isGnbVisible: true,
      isDarkMode: true, // 초기 상태는 라이트모드
    };
  },
  mounted() {
    this.checkGnbVisibility();

    // 로컬 스토리지에서 테마 상태 가져오기
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
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

      this.isGnbVisible = url !== '/admin-home'; // 관리자 페이지는 GNB 미노출
    },
  },

}
</script>

<style>
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
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.5s, color 0.5s;
}
</style>
