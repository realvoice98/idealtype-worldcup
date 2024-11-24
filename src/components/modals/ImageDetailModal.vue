<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="header">
      <span class="image-index">{{ currentImageIndex + 1 }} / {{ selectedImages.length }}</span>
      <button class="close-button" @click="confirmImages">확인</button>
      <button class="close-button" @click="triggerFileSelection">이미지 변경</button>
      <button class="close-button" @click="closeModal">X</button>
    </div>

    <div v-if="selectedImages.length > 0" class="main-image-container" @click.stop>
      <button v-if="selectedImages.length > 1" class="arrow left-arrow" @click="previousImage">&lt;</button>

      <div class="image-container">
        <img :src="selectedImages[currentImageIndex]?.preview" class="main-image" />
        <input
            :value="selectedImages[currentImageIndex]?.customName || ''"
            @input="updateCustomName($event.target.value)"
            type="text"
            class="image-name-input"
            placeholder="이미지 이름 입력"
        />
        <button class="remove-button" @click="removeImage(currentImageIndex)">X</button>
      </div>

      <button v-if="selectedImages.length > 1" class="arrow right-arrow" @click="nextImage">&gt;</button>
    </div>

    <div class="thumbnails" @click.stop>
      <img
          v-for="(image, index) in selectedImages"
          :key="index"
          :src="image.preview"
          :class="{ 'active-thumbnail': index === currentImageIndex }"
          @click="currentImageIndex = index"
      />
    </div>

    <p v-if="errorMessage" class="error-message" @click.stop>{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'ImageDetailModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    modelValue: { // v-model로 바인딩된 데이터
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedImages: [...this.modelValue], // v-model로 받은 데이터를 로컬 상태로 복사
      currentImageIndex: 0,
    };
  },
  watch: {
    selectedImages(newVal) {
      this.currentImageIndex = newVal.length > 0 ? 0 : -1;
    },
  },
  methods: {
    triggerFileSelection() {
      // 동적으로 파일 입력 엘리먼트 생성
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/png, image/jpeg';  // 이미지 파일만 선택 가능
      fileInput.multiple = false;  // 여러 파일 선택은 불가
      fileInput.addEventListener('change', this.onFileChange);
      fileInput.click();  // 파일 탐색기 열기
    },
    onFileChange(event) {
      const file = event.target.files[0]; // 첫 번째 파일만 선택

      if (file) {
        // 선택된 파일을 읽어서 메인 이미지로 설정
        const reader = new FileReader();
        reader.onload = (e) => {
          // 현재 메인 이미지를 선택된 파일로 교체
          this.selectedImages[this.currentImageIndex].preview = e.target.result;
        };
        reader.readAsDataURL(file);  // 파일을 Data URL로 읽기
      }
    },
    updateCustomName(value) {
      if (this.selectedImages[this.currentImageIndex]) {
        this.selectedImages[this.currentImageIndex].customName = value;
      }
    },
    confirmImages() {
      this.$emit('update:modelValue', this.selectedImages); // 수정된 데이터를 부모로 전달
      this.closeModal();
    },
    closeModal() {
      this.$emit('update:isVisible', false);
    },
    removeImage(index) {
      if (index >= 0 && index < this.selectedImages.length) {
        this.selectedImages.splice(index, 1);
        if (this.selectedImages.length === 0) {
          this.currentImageIndex = 0;
        } else if (this.currentImageIndex >= this.selectedImages.length) {
          this.currentImageIndex = this.selectedImages.length - 1;
        }
      }
    },
    previousImage() {
      if (this.selectedImages.length > 0) {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.selectedImages.length) % this.selectedImages.length;
      }
    },
    nextImage() {
      if (this.selectedImages.length > 0) {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.selectedImages.length;
      }
    },
  },
};
</script>


<style scoped>
.modal-overlay {
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2vh;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90vw;
  margin-bottom: 2vh;
  color: white;
}

.header .close-button {
  background: none;
  border: none;
  font-size: 2vw;
  color: white;
  cursor: pointer;
}

.image-index {
  flex-grow: 1;
  text-align: center;
  font-size: 1.5vw;
}

.main-image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70vw;
}

.image-container {
  position: relative;
}

.main-image {
  width: 60vw;
  height: 60vh;
  object-fit: cover;
  border-radius: 1vw;
}

.remove-button {
  position: absolute;
  width: 2vw;
  height: 2vw;
  top: 1vh;
  right: 1vh;
  background-color: red;
  font-size: 1vw;
  color: white;
  border: none;
  padding: 0.5vh;
  border-radius: 0.5vw;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.image-container:hover .remove-button {
  opacity: 1;
}

.arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 1vh;
  cursor: pointer;
  font-size: 2vw;
  border-radius: 50%;
  z-index: 1001;
}

.left-arrow {
  left: 5vw;
}

.right-arrow {
  right: 5vw;
}

.thumbnails {
  display: flex;
  justify-content: center;
  margin-top: 2vh;
  width: 90vw;
}

.thumbnails img {
  width: 7vw;
  height: 7vw;
  object-fit: cover;
  margin: 0 1vw;
  border-radius: 0.5vw;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.thumbnails img.active-thumbnail {
  border: 0.3vw solid #333;
  opacity: 1;
}


.error-message {
  color: red;
  font-size: 1vw;
  margin-top: 1vh;
}

.image-name-input {
  position: absolute;
  bottom: 1vh;
  left: 1vh;
  width: calc(100% - 2vh);
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.5vh;
  border-radius: 0.5vw;
  font-size: 1vw;
  box-sizing: border-box;
}
</style>
