<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal">
      <h2>이미지 등록</h2>
      <div class="modal-images">
        <div class="modal-image" v-for="(image, index) in selectedImages" :key="index">
          <img :src="image.preview" />
          <button @click="removeImage(index)">지우기</button>
        </div>
      </div>
      <input type="file" @change="onFileChange" accept="image/png, image/jpeg" multiple />
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      <div class="modal-buttons">
        <button @click="confirmImages">확인</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageRegistModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selectedImages: [],
      errorMessage: '',
    };
  },
  methods: {
    onFileChange(event) {
      const files = Array.from(event.target.files);
      this.errorMessage = '';

      const allowedExtensions = ['png', 'jpg', 'jpeg'];

      const validFiles = files.filter(file => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
      });

      if (validFiles.length === 0) {
        this.errorMessage = '유효한 파일이 없습니다. PNG 또는 JPG/JPEG 파일만 선택할 수 있습니다.';
        return;
      }

      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImages.push({ file, preview: e.target.result });
        };
        reader.readAsDataURL(file);
      });
    },


    confirmImages() {
      if (this.selectedImages.length > 0) {
        this.$emit('images-selected', this.selectedImages); // Emit all selected images
        this.closeModal();
      }
    },
    closeModal() {
      this.$emit('update:isVisible', false);
      this.selectedImages = []; // Clear selected images on close
    },
    removeImage(index) {
      this.selectedImages.splice(index, 1); // 선택된 이미지 지우기
    },
  },
}
</script>

<style scoped>/*TODO: CSS 다듬기*/
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-images {
  display: flex; /* Flexbox를 사용하여 가로로 배치 */
  flex-wrap: wrap; /* 공간 부족 시 다음 줄로 넘기기 */
  max-height: 200px; /* 원하는 최대 높이 설정 */
  overflow-y: auto; /* 세로 스크롤 가능 */
  border: 1px solid lightgray; /* 테두리 추가 (선택 사항) */
  padding: 1rem; /* 패딩 추가 (선택 사항) */
  margin-bottom: 1rem; /* 버튼과의 간격 */
}

.modal-image {
  margin-right: 1rem; /* 이미지 간 간격 */
  margin-bottom: 1rem; /* 다음 줄로 넘어갈 때의 간격 */
}

.modal-image img {
  max-width: 100%;
  max-height: 150px; /* 원하는 최대 높이 설정 */
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.error-message {
  color: red;
}
</style>
