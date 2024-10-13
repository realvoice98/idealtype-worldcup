<template>
  <div class="admin-container"> <!-- TODO: 접근 권한 유효성 검사 (admin 권한 없이 URL로 접근한 경우 별도 alert 없이 home으로 이동)-->
    <div class="sidebar-container">
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
  </div>
</template>

<script>
  export default {
    name: "AdminHome",
    methods: {

    }
  }
</script>

<style scoped>
  .admin-container {
    display: flex;
    border: #d4e2fd 1px solid;
  }

  .sidebar-container {
    flex: 1;
    background-color: #98b7d4;
    color: white;
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
    color: white;
    text-decoration: none;
  }
</style>