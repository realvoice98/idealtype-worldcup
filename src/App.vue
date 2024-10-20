<template>
  <div id="app">
    <GlobalNavBar v-if="isGnbVisible" />
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
    };
  },
  mounted() {
    this.checkGnbVisibility();
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
  },

}
</script>

<style>
#app {

}
</style>
