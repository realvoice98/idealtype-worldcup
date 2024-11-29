import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import DOMPurifyPlugin from './plugins/dompurify';

createApp(App)
  .use(router)
  .use(DOMPurifyPlugin)
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