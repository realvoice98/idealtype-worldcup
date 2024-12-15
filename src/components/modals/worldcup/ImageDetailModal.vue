<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="header">
      <span class="image-index">{{ currentImageIndex + 1 }} / {{ selectedImages.length }}</span>
      <div v-if="!cropperVisible" class="button-group">
        <button class="button" @click="triggerFileSelection">이미지 변경</button>
        <button class="button" @click="confirmImages">확인</button>
      </div>
      <button class="button close" @click="confirmClose">
        <img src="@/assets/x_icon.png" alt="close_icon">
      </button>
    </div>

    <div v-if="!cropperVisible && selectedImages.length > 0" class="main-image-container" @click.stop>
      <button v-if="selectedImages.length > 1" class="arrow left-arrow" @click="previousImage">&lt;</button>

      <div class="image-container">
        <img :src="selectedImages[currentImageIndex]?.preview" class="main-image" @click="openCropper(currentImageIndex)" />
        <input
            :value="selectedImages[currentImageIndex]?.customName || ''"
            @input="updateCustomName($event.target.value)"
            type="text"
            class="image-name-input"
            placeholder="이미지 이름 입력"
            ref="customNameInput"
        />
        <button class="remove-button" @click="removeImage(currentImageIndex)">
          <img src="@/assets/x_icon.png" alt="x">
        </button>
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
          v-for="(image, index) in thumbnailList"
          :key="index"
          :src="image.preview"
          :class="{ 'active-thumbnail': image.isActive }"
          @click="updateCurrentIndex(index)"
      />
    </div>

    <CommonModal2
        v-if="isConfirmModalVisible"
        :visible="isConfirmModalVisible"
        content="변경사항이 저장되지 않았습니다. 저장하시겠습니까?"
        :buttons="confirmButtons"
        @update:visible="isConfirmModalVisible = $event"
    />

    <p v-if="errorMessage" class="error-message" @click.stop>{{ errorMessage }}</p>
  </div>
</template>

<script>
import CommonModal2 from "@/components/modals/CommonModal2.vue";
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  name: 'ImageDetailModal',
  components: {
    CommonModal2,
    VueCropper,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    modelValue: { // v-model로 바인딩된 데이터
      type: Array,
      required: true,
    },
    initialIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      currentImageIndex: this.initialIndex,
      originalArray: JSON.parse(JSON.stringify(this.modelValue)),
      isConfirmModalVisible: false,
      cropperImage: null,
      cropperVisible: false,
    };
  },
  watch: {
    'selectedImages': {
      handler(newImages) {
        newImages.forEach((image, index) => {
          if (image.customName) {
            this.selectedImages[index].customName = image.customName.replace(/[\\\/:*?"<>|]/g, '');
          }
        });
      },
      deep: true,
    },
    initialIndex(newIndex) {
      this.currentImageIndex = newIndex;
    },
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.originalArray = JSON.parse(JSON.stringify(newValue));
      },
    },
  },
  computed: {
    selectedImages() {
      return this.modelValue; // 항상 부모의 v-model 데이터를 참조
    },
    thumbnailList() {
      const total = this.selectedImages.length;
      const range = 2;
      let result = [];

      if (total <= 5) {
        result = this.selectedImages.map((image, index) => ({
          ...image,
          isActive: index === this.currentImageIndex,
        }));
      } else {
        for (let i = -range; i <= range; i++) {
          const index = (this.currentImageIndex + i + total) % total;
          result.push({
            ...this.selectedImages[index],
            isActive: index === this.currentImageIndex,
          });
        }
      }
      return result;
    },
    hasChanges() {
      return !this.areArraysEqual(this.selectedImages, this.originalArray);
    },
    confirmButtons() {
      return [
        {
          text: "저장",
          callback: this.confirmImages,
        },
        {
          text: "나가기",
          callback: this.closeModal,
        },
      ];
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    areArraysEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;

      return arr1.every((item, index) => {
        const other = arr2[index];
        return (
            item.preview === other.preview &&
            item.customName === other.customName
        );
      });
    },
    updateCurrentIndex(thumbnailIndex) {
      const total = this.selectedImages.length;
      this.currentImageIndex = (this.currentImageIndex + (thumbnailIndex - 2) + total) % total;
    },
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
        reader.readAsDataURL(file);
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
          const customName = this.selectedImages[this.currentImageIndex].customName;
          this.selectedImages[this.currentImageIndex] = {
            file: croppedFile,
            preview: e.target.result,
            customName: customName,
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
      if (this.isDuplicateCustomName('', -1)) {
        this.errorMessage =
            '이미지 이름에 중복된 값이 있습니다. 모든 이미지 이름을 고유하게 설정해주세요.';
        return;
      }else if (this.selectedImages.some((image) => !image.customName)) {
        this.isConfirmModalVisible = false;
        this.errorMessage = '모든 이미지에 이름을 입력해주세요.';
        return;
      }

      this.isConfirmModalVisible = false;
      this.$emit('update:modelValue', this.selectedImages); // 수정된 데이터를 부모로 전달
      this.closeModal();
    },
    confirmClose(){
      if (this.hasChanges){
        this.isConfirmModalVisible = true;
      }else{
        this.$emit('update:isVisible', false);
      }
    },
    closeModal() {
      this.isConfirmModalVisible = false;
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

    focusInput() {
      this.$nextTick(() => {
        const input = this.$refs.customNameInput;
        if (input) {
          input.focus();
        }
      });
    },

    previousImage() {
      if (this.selectedImages.length > 0) {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.selectedImages.length) % this.selectedImages.length;
        this.focusInput();
      }
    },

    nextImage() {
      if (this.selectedImages.length > 0) {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.selectedImages.length;
        this.focusInput();
      }
    },

    handleKeydown(event) {
      if (event.key === 'ArrowLeft') {
        this.previousImage();
        this.focusInput();
      } else if (event.key === 'ArrowRight') {
        this.nextImage();
        this.focusInput();
      }
    },

    isDuplicateCustomName(value) {
      return this.selectedImages.some(
          (image, index) =>
              image.customName === value && index !== this.currentImageIndex // 현재 이미지 제외
      );
    },

    // customName 업데이트
    updateCustomName(value) {
      if (!this.selectedImages[this.currentImageIndex]) return;

      if (this.isDuplicateCustomName(value)) {
        this.errorMessage = `'${value}'는 이미 사용 중입니다. 다른 이름을 입력해주세요.`;
        return;
      }

      this.errorMessage = ''; // 에러 메시지 초기화
      this.selectedImages[this.currentImageIndex].customName = value;
    },
  },
};
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90vw;
  margin-bottom: 2vh;
  color: white;
}

.header .button {
  background: none;
  border: none;
  font-size: 2vw;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.header .button-group {
  display: flex;
  justify-content: center;
  flex-grow: 1;
}

.header .button.close {
  margin-left: auto;
}

.header .button:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
}

.header .button:active {
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  transform: scale(0.95);
}

.header .button.close img{
  width: 3vw;
  height: 3.5vh;
}

.image-index {
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
  color: white;
  border: none;
  padding: 0.5vh;
  border-radius: 0.5vw;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.remove-button img{
  width: 1vw;
  height: 1vw;
}

.image-container:hover .remove-button {
  opacity: 1;
}

.arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: none;
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

.cropper-container {
  margin-top: 1vh;
  width: 80vw;
  height: 70vh;
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
  top: 71vh;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  gap: 2vw;
}

.cropper-buttons button {
  padding: 1vh 2vw;
  font-size: 1.2vw;
  cursor: pointer;
  border: none;
  border-radius: 0.5vw;
}

.cropper-buttons button:hover {
  background-color: #0056b3;
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
  height: 8vh;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.5vh;
  border-radius: 0.5vw;
  font-size: 2vw;
  box-sizing: border-box;
}
</style>
