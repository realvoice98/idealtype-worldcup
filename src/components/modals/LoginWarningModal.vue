<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button @click="$emit('confirm')">확인</button>
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
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
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

p {
  color: black; /* 다크모드 전환 시 변환되지 않도록 고유 색 할당 */
  white-space: pre-line; /* \n 문자 인식하여 줄바꿈 가능하게 처리 */
}
</style>
