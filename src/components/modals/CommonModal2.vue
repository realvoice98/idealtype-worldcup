<template>
  <div class="modal-wrap" v-if="visible" @click="closeModal"> <!-- dim 클릭 시에도 닫기 -->
    <div class="modal-container" @click.stop> <!-- 이벤트 버블링 방지 -->
      <div class="modal-header" v-if="title"> <!-- 제목 생략 가능 -->
        <h2>{{ title }}</h2>
      </div>
      <div class="btn-modal">
        <div class="content">{{ content }}</div>
        <div class="btn-box">
        <span v-for="(button, index) in buttons" :key="index">
          <CommonButton variant="primary" @click="button.callback">{{ button.text }}</CommonButton>
        </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CommonButton from "@/components/buttons/CommonButton.vue";

  export default {
    name: "CommonModal",
    components:{
      CommonButton,
    },
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
      },
      content: {
        type: String,
      },
      buttons: {
        type: Array,
        default: () => [],
      }
    },
    methods: {
      closeModal() {
        this.$emit('update:visible', false); // 부모 vue가 모달 visible 제어
      }
    },
  }
</script>

<style scoped>

.btn-modal{
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.content{
  display: flex;
  align-items: center;
  justify-content: center;
  font-size:20px;
}
.btn-box{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  
}
</style>