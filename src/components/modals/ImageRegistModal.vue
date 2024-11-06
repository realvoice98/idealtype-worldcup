<template>
  <div class="modal-overlay" v-if="isVisible" @click="closeModal">
    <div class="modal" @click.stop>
      <h2>이미지 등록</h2>
      <div class="modal-images" @click="triggerFileSelection">
        <div class="modal-image" v-for="(image, index) in selectedImages" :key="index" @click.stop>
          <div class="image-container">
            <img :src="image.preview" @click="openCropper(index)" /><!--이미지 클릭시 크롭 모달 실행-->
            <button class="remove-button" @click="removeImage(index)">지우기</button>
          </div>
        </div>
      </div>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      <div class="modal-buttons">
        <button @click="confirmImages">확인</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>

    <!-- 크롭 모달 -->
    <div v-if="cropperVisible" class="cropper-modal" @click.stop>
      <VueCropper
          ref="cropper"
          :src="cropperImage"
          :aspect-ratio="1"
      />
      <div class="cropper-buttons">
        <button @click="cropImage">이미지 자르기</button>
        <button @click="closeCropper">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
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
      currentImageIndex: null,
    };
  },
  mounted() {
    // 모달이 열릴 때 파일 선택 창을 자동으로 띄움
    if (this.isVisible) {
      this.triggerFileSelection();
    }
  },
  watch: {
    // 모달이 열릴 때마다 파일 선택 창을 트리거
    isVisible(newVal) {
      if (newVal) {
        this.triggerFileSelection();
      }
    },
  },
  methods: {
    triggerFileSelection() {
      // 파일 선택 창을 트리거하기 위한 가상 파일 입력 생성
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
    },

    openCropper(index) {
      this.cropperImage = this.selectedImages[index].preview;
      this.currentImageIndex = index;
      this.cropperVisible = true;
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
      this.currentImageIndex = null;
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
    },
    removeImage(index) {
      this.selectedImages.splice(index, 1);
    },
  },
};
</script>

<style scoped>
/*TODO: CSS 다듬기*/
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 40vw;
  max-height: 80vh;
}

.modal-images {
  display: flex;
  flex-wrap: wrap;
  width: 95%;
  height: 40vh;
  overflow-y: scroll;
  border: 1px solid lightgray;
  padding: 1rem;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.modal-image {
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.image-container {
  position: relative;
  flex: 0 0 calc(33.33% - 1rem); /* 이미지 너비를 3등분 */
  margin-bottom: 1rem;
}

.image-container img {
  width: 100%;
  max-height: 150px;
  display: block;
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

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem; /* 버튼과 모달 내용 사이에 여백 추가 */
}

.error-message {
  color: red;
}

.cropper-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;
  opacity: 1;
}

.cropper-buttons {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.cropper-buttons button {
  margin: 0 1rem;
  padding: 0.5rem 1rem;
}

h2{
  color: black;
}

@media (max-width: 768px) {
  .modal {
    width: 90vw; /* 모바일에서 너비 90% */
  }

  .modal-images {
    max-height: 150px; /* 모바일에서 최대 높이 조정 */
  }

  .image-container {
    flex: 0 0 calc(50% - 1rem); /* 모바일에서 이미지 너비를 2등분 */
  }
}

@media (max-width: 480px) {
  .modal {
    width: 95vw; /* 매우 작은 화면에서 너비 95% */
  }

  .modal-images {
    max-height: 120px; /* 매우 작은 화면에서 최대 높이 조정 */
  }

  .image-container {
    flex: 0 0 100%; /* 매우 작은 화면에서 이미지 너비를 100% */
  }
}
</style>


