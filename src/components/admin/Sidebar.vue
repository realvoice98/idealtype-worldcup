<template>
  <div class="sidebar-container">
    <router-link class="nav-link" to="/admin-home">
      <svg width="40" height="32"></svg>
      <span>Back Office</span>
    </router-link>
    <ul class="sidebar-nav">
      <!-- li prefix 심플 아이콘 -->
      <li class="nav-item">
        <router-link class="nav-link" to="/dashboard">대시보드</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/user-list">사용자 목록</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/manage-worldcup">월드컵 관리</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/reports">신고접수</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/questions">문의사항</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/settings">설정</router-link>
      </li>
    </ul>
  </div>
  <div class="main-container">
    <div class="main-content">
      <p>Content Area</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Sidebar",

  }
</script>

<style scoped>
  .sidebar-container {
    flex: 1;
    background-color: #fefefe;
    padding: 1rem;
  }

  .main-container {
    flex: 5;
    background-color: #ecf0f1;
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