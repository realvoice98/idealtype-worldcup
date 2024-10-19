<template>
  <div class="admin-container"> <!-- TODO: 접근 권한 유효성 검사 (admin 권한 없이 URL로 접근한 경우 별도 alert 없이 home으로 이동)-->
    <Sidebar />
    <router-view />
  </div>
</template>

<script>
  import Sidebar from '@/components/admin/Sidebar.vue';

  export default {
    name: "BackOffice",
    components: {
      Sidebar,
    },
  }
</script>

<style scoped>
  .admin-container {
    display: flex;
    border: #d4e2fd 1px solid;
  }
</style>