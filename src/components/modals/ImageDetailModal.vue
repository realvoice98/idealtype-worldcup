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
import { formatDate } from "@/common";

export default {
  name: 'ImageDetailModal',
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
      currentImageIndex: 0,
    };
  },
  methods: {
    triggerFileSelection() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/png, image/jpeg';
      fileInput.multiple = false;  // 다중 파일 업로드 비활성화
      fileInput.addEventListener('change', this.onFileChange);
      fileInput.click();  // 클릭을 통해 파일 선택 대화상자 열기
    },

    onFileChange(event) {
      const file = event.target.files[0];  // 단일 파일만 선택
      this.errorMessage = '';

      if (!file) return;

      const allowedExtensions = ['png', 'jpg', 'jpeg'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        this.errorMessage = '유효한 파일이 없습니다. PNG 또는 JPG/JPEG 파일만 선택할 수 있습니다.';
        return;
      }

      const timestamp = formatDate(new Date());
      const uniqueFileName = `${file.name.replace(`.${fileExtension}`, '')}_${timestamp}.${fileExtension}`;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          const newFile = new File([file], uniqueFileName, { type: file.type });
          this.selectedImages[this.currentImageIndex] = { file: newFile, preview: e.target.result, name: uniqueFileName, customName: '', };
        }
      };
      reader.readAsDataURL(file);
    },

    confirmImages() {
      if (this.selectedImages.some((image) => !image.customName)) {
        this.errorMessage = '모든 이미지에 이름을 입력해주세요.';
        return;
      }

      this.$emit('images-selected', this.selectedImages);
      this.closeModal();
    },

    closeModal() {
      this.$emit('update:isVisible', false);
      this.selectedImages = [];
      this.currentImageIndex = 0;  // 모달을 닫을 때 currentImageIndex 초기화
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

    updateCustomName(value) {
      if (this.selectedImages[this.currentImageIndex]) {
        this.selectedImages[this.currentImageIndex].customName = value;
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
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 2vh;
}

.modal-buttons button {
  padding: 1vh 2vw;
  font-size: 1.2vw;
  cursor: pointer;
  border: none;
  border-radius: 0.5vw;
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
