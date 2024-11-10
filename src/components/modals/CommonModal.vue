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