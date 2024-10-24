<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal">
      <h2>이미지 등록</h2>
      <div class="modal-images">
        <div class="modal-image" v-for="(image, index) in selectedImages" :key="index">
          <div class="image-container"><!--이미지 클릭시 크롭 모달 실행-->
            <img :src="image.preview" @click="openCropper(index)" />
            <button class="remove-button" @click="removeImage(index)">지우기</button>
          </div>
        </div>
      </div>
      <input type="file" @change="onFileChange" accept="image/png, image/jpeg" multiple />
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      <div class="modal-buttons">
        <button @click="confirmImages">확인</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>

    <!-- 크롭 모달 -->
    <div v-if="cropperVisible" class="cropper-modal">
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
          this.selectedImages.push({file, preview: e.target.result});
        };
        reader.readAsDataURL(file);
      });
      event.target.value = null;
    },

    openCropper(index) {
      this.cropperImage = this.selectedImages[index].preview;
      this.currentImageIndex = index;
      this.cropperVisible = true;
    },

    cropImage() {
      this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
        // 현재 파일 이름과 동일한 이름으로 파일 생성
        const originalFile = this.selectedImages[this.currentImageIndex].file;
        const croppedFile = new File([blob], originalFile.name, { type: blob.type });

        // FileReader로 미리보기 갱신
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImages[this.currentImageIndex] = {
            file: croppedFile,  // 자른 파일 객체
            preview: e.target.result,  // 미리보기 URL
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
  display: flex;
  flex-wrap: wrap;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid lightgray;
  padding: 1rem;
  margin-bottom: 1rem;
}

.modal-image {
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.image-container {
  position: relative;
}

.image-container img {
  max-width: 100%;
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
</style>
