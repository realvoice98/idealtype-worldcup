<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h2>로그인이 필요합니다!</h2>
      <button @click="closeModal">확인</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
    },
  };
</script>

<style scoped>


  .modal-content h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }

  .modal-content button {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .modal-content button:hover {
    background-color: #0056b3;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
