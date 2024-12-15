<template>
  <div class="bo-container"> <!-- TODO: 접근 권한 유효성 검사 (admin 권한 없이 URL로 접근한 경우 별도 alert 없이 home으로 이동)-->
    <Sidebar />
    <div class="bo-content">
      <router-view />
    </div>
  </div>
</template>

<script>
  import Sidebar from '@/components/admin/Sidebar.vue';

  export default {
    name: 'BackOffice',
    components: {
      Sidebar,
    },
  };
</script>

<style scoped>
  .bo-container {
    display: flex;
    border: #d4e2fd 1px solid;
  }

  .bo-content {
    flex: 7;
    padding: 1rem;
    margin-left: 40px;
  }
</style>