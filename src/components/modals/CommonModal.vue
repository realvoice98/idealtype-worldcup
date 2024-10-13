<template>
  <button @click="openModal">OPEN</button>
  <div class="modal-wrap" v-show="isModalVisible" @click="openModal">
    <div class="modal-container" @click.stop> <!-- 이벤트 버블링 방지 -->
<!--      <div class="modal-header">-->
      <div class="btn-modal">
        <button @click="openModal">닫기</button>
        <button @click="openModal">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonModal",
  data() {
    return {
      isModalVisible: false,
    };
  },
  methods: {
    openModal() {
      this.isModalVisible = !this.isModalVisible;
    }
  },
}
</script>

<style scoped>
  /* dimmed */
  .modal-wrap {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
  }

  .modal-container {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 550px;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
  }
</style>