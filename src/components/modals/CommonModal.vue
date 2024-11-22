<template>
  <button @click="openModal">{{ openBtnText }}</button>
  <div class="modal-wrap" v-show="isModalVisible" @click="openModal"> <!-- dim 클릭 시에도 닫기 -->
    <div class="modal-container" @click.stop> <!-- 이벤트 버블링 방지 -->
      <div class="modal-header" v-if="title"> <!-- 제목 생략 가능 -->
        <h2>{{ title }}</h2>
      </div>
      <div class="btn-modal">
        <p>{{ content }}</p>
        <span v-for="(button, index) in buttons" :key="index">
          <button @click="button.callback">{{ button.text }}</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CommonModal",
    props: {
      openBtnText: {
        type: String,
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

</style>