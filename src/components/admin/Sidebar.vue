<template>
  <div class="sidebar-container">
    <router-link class="nav-link" to="/bo">
      <svg width="40" height="32"></svg>
      <span>Back Office</span>
    </router-link>
    <ul class="sidebar-nav">
      <!-- li prefix 심플 아이콘 -->
      <li class="nav-item">
        <router-link class="nav-link" to="/bo/dashboard">대시보드</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/bo/user-list">사용자 목록</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/bo/wldcup-management">월드컵 관리</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/bo/report-receive">신고접수</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/bo/questions">문의사항</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/bo/settings">설정</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Sidebar',

  }
</script>

<style scoped>
  .sidebar-container {
    flex: 1;
    background-color: var(--theme);
    padding: 1rem;
  }

  .nav-item {
    margin: 1rem;
    font-size: 20px;
    list-style-type: none;
  }
  .nav-link {
    color: black;
    text-decoration: none;
  }
</style>