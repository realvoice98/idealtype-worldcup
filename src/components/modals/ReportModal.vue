<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <p>{{ message }}</p>
      <input
          v-model="inputValue"
          type="text"
          placeholder="신고 내용을 입력하세요"
      />
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="modal-actions">
        <button @click="confirm">확인</button>
        <button @click="$emit('close')">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      inputValue: '',
      errorMessage: '',
    };
  },
  methods: {
    confirm() {
      // 입력값이 있을 때만 emit
      if (this.inputValue.trim()) {
        this.$emit('confirm', this.inputValue);
        this.errorMessage = '';
      } else {
        this.errorMessage = '내용을 입력해주세요.';
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 350px;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:first-child {
  background-color: var(--theme);
  color: white;
}

button:last-child {
  background-color: #f5f5f5;
  color: #333;
}

input {
  width: 90%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

p {
  color: black;
  white-space: pre-line;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
