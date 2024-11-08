<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="header">
      <span>{{ currentImageIndex + 1 }} / {{ selectedImages.length }}</span>
      <button class="close-button" @click="closeModal">X</button>
    </div>

    <div v-if="!cropperVisible && selectedImages.length > 0" class="main-image-container" @click.stop>
      <button v-if="selectedImages.length > 1" class="arrow left-arrow" @click="previousImage">&lt;</button>

      <div class="image-container">
        <img :src="selectedImages[currentImageIndex]?.preview" class="main-image" @click="openCropper(currentImageIndex)" />
        <button class="remove-button" @click="removeImage(currentImageIndex)"> X </button>
      </div>

      <button v-if="selectedImages.length > 1" class="arrow right-arrow" @click="nextImage">&gt;</button>
    </div>

    <div v-if="cropperVisible" class="cropper-container" @click.stop>
      <VueCropper
          ref="cropper"
          :src="cropperImage"
          :aspect-ratio="1"
          :view-mode="1"
          :drag-mode="'move'"
          :zoomable="false"
          :movable="true"
          class="vue-cropper"
      />
      <div class="cropper-buttons">
        <button @click="cropImage">자르기</button>
        <button @click="closeCropper">취소</button>
      </div>
    </div>

    <div v-if="!cropperVisible" class="thumbnails" @click.stop>
      <img
          v-for="(image, index) in selectedImages"
          :key="index"
          :src="image.preview"
          :class="{ 'active-thumbnail': index === currentImageIndex }"
          @click="currentImageIndex = index"
      />
      <button v-if="selectedImages.length < 5" @click="triggerFileSelection">+ 추가</button>
    </div>

    <div class="modal-buttons" v-if="!cropperVisible" @click.stop>
      <button @click="confirmImages">확인</button>
    </div>

    <p v-if="errorMessage" class="error-message" @click.stop>{{ errorMessage }}</p>
  </div>
</template>

<script>// TODO: 변경사항 경고 모달 추가하기
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  name: 'ImageRegistModal',
  components: {
    VueCropper,
  },
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
      cropperVisible: false,
      cropperImage: null,
      currentImageIndex: 0,
    };
  },
  mounted() {
    if (this.isVisible) {
      this.triggerFileSelection();
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.triggerFileSelection();
      }
    },
  },
  methods: {
    triggerFileSelection() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/png, image/jpeg';
      fileInput.multiple = true;
      fileInput.addEventListener('change', this.onFileChange);
      fileInput.click();
    },

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

      // 첫 번째 이미지가 추가되면 currentImageIndex를 0으로 설정
      if (this.selectedImages.length === 1) {
        this.currentImageIndex = 0;
      }
    },

    openCropper(index) {
      if (this.selectedImages && this.selectedImages[index]) {
        this.cropperImage = this.selectedImages[index].preview; // 'preview'가 undefined인 경우를 방지
        this.cropperVisible = true;
      }
    },

    cropImage() {
      this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
        const originalFile = this.selectedImages[this.currentImageIndex].file;
        const croppedFile = new File([blob], originalFile.name, { type: blob.type });

        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImages[this.currentImageIndex] = {
            file: croppedFile,
            preview: e.target.result,
          };
          this.closeCropper();
        };
        reader.readAsDataURL(croppedFile);
      });
    },

    closeCropper() {
      this.cropperVisible = false;
      this.cropperImage = null;
    },

    confirmImages() {
      if (this.selectedImages.length > 0) {
        this.$emit('images-selected', this.selectedImages);
        this.closeModal();
      }
    },

    closeModal() {
      this.$emit('update:isVisible', false);
      this.selectedImages = [];
      this.currentImageIndex = 0; // 모달을 닫을 때 currentImageIndex 초기화
    },

    removeImage(index) {
      // 배열에서 이미지 삭제
      if (index >= 0 && index < this.selectedImages.length) {
        this.selectedImages.splice(index, 1);

        // 삭제 후, currentImageIndex가 유효한지 확인하고 인덱스를 조정
        if (this.selectedImages.length === 0) {
          this.currentImageIndex = 0;  // 모든 이미지가 삭제되면 첫 번째 이미지로 초기화
        } else if (this.currentImageIndex >= this.selectedImages.length) {
          this.currentImageIndex = this.selectedImages.length - 1; // 범위 내 인덱스로 조정
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
  padding: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  margin-bottom: 1rem;
  color: white;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: white;
  cursor: pointer;
}

.main-image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

.image-container {
  position: relative;
}

.main-image {
  position: relative;
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}

.remove-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: red;
  color: white;
  border: none;
  padding: 5px;
  border-radius: 3px;
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
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1.5rem;
  border-radius: 50%;
  z-index: 1001;
}

.left-arrow {
  left: 10px;
}

.right-arrow {
  right: 10px;
}

.thumbnails {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  width: 100%;
  max-width: 600px;
}

.thumbnails img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.thumbnails img.active-thumbnail {
  border: 2px solid #333;
  opacity: 1;
}

.cropper-container {
  margin-top: 1rem;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vue-cropper {
  width: 70vw;
  height: 70vh;
}

.cropper-buttons {
  position: absolute;
  bottom: 20px;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  gap: 20px;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
}

.cropper-buttons button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 150px;
}

.cropper-buttons button:hover {
  background-color: #0056b3;
}

.modal-buttons button,
.cropper-buttons button {
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.modal-buttons button:first-child {
  background-color: white;
  color: black;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 1rem;
}
</style>

