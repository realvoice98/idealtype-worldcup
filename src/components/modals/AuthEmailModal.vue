<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h2>이메일 인증하기</h2>
      <div class="content-container">
        
      <div class="email-container">
        <div class="left">이메일 : </div>
        <div class="right">example@naver.com</div>
      </div>
      <div class="auth-code-container">
      <div class="left">인증 번호 :</div>
      <div class="right"> 
      <input placeholder="인증 번호 입력"/>
      <button>확인</button>
    </div>
    </div>
    <button @click="closeAuthEmailModal">닫기</button>
  </div>
      
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
    closeAuthEmailModal() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.content-container{
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.email-container{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size:15px;
  color: black;
  .left{
  flex:1;
  text-align: left;
}
.right{
  flex:3;
  text-align: left;
}
}


.auth-code-container{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
    color: black;
  .left{
    flex:1;
    text-align: left;
  }
  .right{
    flex:3;
    text-align: left;
    display: flex;
    gap: 10px;
  }
}

.modal-content {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

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
  padding: 5px 15px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

input{
  padding:5px;
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
