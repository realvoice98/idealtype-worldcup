import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App)
  .use(router)
  .mixin({
    methods: {
      /**
       * 이전 페이지로 돌아가기
       */
      moveToPreviousPage() {
        this.$router.back(); // 또는 $router.go(-1)
      }
    }
  })
  .mount('#app');