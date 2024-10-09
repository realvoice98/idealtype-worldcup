<template>
  <nav class="gnb">
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
            <img class="btn-toggle-theme" src="" alt="테마 변경" />
          </button>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/sign-in">로그인</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import SignIn from "@/views/SignIn.vue";

  export default {
    name: 'GNB',
    components: {
      SignIn,
    },
    methods: {
      toggleTheme() {
        // TODO: 다크모드/라이트모드 토글
      },
    },
  };
</script>

<style scoped>
  .gnb {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .5);
  }

  .gnb-nav {
    display: flex;
    gap: 2rem;
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
</style>