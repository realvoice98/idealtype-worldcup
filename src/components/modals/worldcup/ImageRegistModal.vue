<template>
  <LoadingSpinner :visible="isLoading" />

  <div class="modal-overlay" v-if="isVisible">
    <div class="header">
      <span class="image-index">{{ currentImageIndex + 1 }} / {{ selectedImages.length }}</span>
      <div class="button-group" v-if="!cropperVisible" @click.stop>
        <button @click="triggerFileSelection" class="button">+ 추가</button>
        <button @click="handleButtonClick" class="button">{{ isWldcupsPage ? '업데이트' : '확인' }}</button>
      </div>
      <button class="button close" @click="confirmClose">
        <img src="@/assets/x_icon.png" alt="x">
      </button>
    </div>

    <div v-if="!cropperVisible && selectedImages.length > 0" class="main-image-container" @click.stop>
      <button v-if="selectedImages.length > 1" class="arrow left-arrow" @click="previousImage">&lt;</button>

      <div class="image-container">
        <img :src="selectedImages[currentImageIndex]?.preview || selectedImages[currentImageIndex]?.path" class="main-image" @click="openCropper(currentImageIndex)" />
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

    <div v-if="cropperVisible && thumbnailList.length > 0" class="cropper-container" @click.stop>
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
          :src="image.preview || image.path"
          :class="{ 'active-thumbnail': image.isActive }"
          @click="updateCurrentIndex(index)"
      />
    </div>

    <CommonModal2
        v-if="isConfirmModalVisible"
        :visible="isConfirmModalVisible"
        content="취소하고 나가시겠습니까?"
        :buttons="confirmButtons"
    />

    <p v-if="errorMessage" class="error-message" @click.stop>{{ errorMessage }}</p>
  </div>
</template>

<script>
  import VueCropper from 'vue-cropperjs';
  import 'cropperjs/dist/cropper.css';
  import { formatDate } from "@/common";
  import CommonModal2 from "@/components/modals/CommonModal2.vue";
  import {updateImage, updateWldcupImages} from "@/services/firebase/db";
  import LoadingSpinner from "@/components/common/LoadingSpinner.vue";

  export default {
    name: 'ImageRegistModal',
    components: {
      LoadingSpinner,
      CommonModal2,
      VueCropper,
    },
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
      wldcupId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      creatorId: {
        type: String,
        required: true,
      },
      existingImages: {
        type: Array,
        required: true,
      }
    },
    data() {
      return {
        selectedImages: [],
        deletedImages: [],
        errorMessage: '',
        cropperVisible: false,
        cropperImage: null,
        currentImageIndex: 0,
        isConfirmModalVisible: false,
        isLoading: false,
      };
    },
    computed: {
      thumbnailList() {
        const total = this.selectedImages.length;

        if (total <= 5) {
          return this.selectedImages.map((image, index) => ({
            ...image,
            isActive: index === this.currentImageIndex,
          }));
        }

        const range = 2;
        return Array.from({ length: 5 }, (_, i) => {
          const index = (this.currentImageIndex + i - range + total) % total;
          return {
            ...this.selectedImages[index],
            isActive: index === this.currentImageIndex,
          };
        });
      },
      confirmButtons() {
        // 경로에 따라 버튼을 다르게 설정
        if (this.isWldcupsPage) {
          return [
            {
              text: "업데이트",
              callback: this.confirmUpdateImages,
            },
            {
              text: "나가기",
              callback: this.closeModal,
            },
          ];
        } else {
          return [
            {
              text: "추가",
              callback: this.confirmImages, // 기본 '추가' 버튼
            },
            {
              text: "나가기",
              callback: this.closeModal,
            },
          ];
        }
      },
      hasAdd(){
        return this.selectedImages.length > 0;
      },
      isWldcupsPage() {
        return this.$route.path.startsWith('/my-page/wldcups');
      },
    },
    mounted() {
      if (this.isVisible && !this.isWldcupsPage) {
        this.triggerFileSelection();
      }

      window.addEventListener('keydown', this.handleKeydown);
    },
    beforeUnmount() {
      window.removeEventListener('keydown', this.handleKeydown);
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
      isVisible(newVal) {
        if (newVal && !this.isWldcupsPage) {
          this.triggerFileSelection();
        }
      },
      existingImages: {
        handler(newImages) {
          if (this.isWldcupsPage) {
            this.selectedImages = newImages.map(image => ({
              file: image.file,
              preview: URL.createObjectURL(image.file),
              name: image.fileName,
              customName: image.customName,
            }));
          }
        },
        immediate: true,
        deep: true,
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
          const timestamp = formatDate(new Date());
          const fileExtension = file.name.split('.').pop(); // 파일 확장자 추출
          const uniqueFileName = `${file.name.replace(`.${fileExtension}`, '')}_${timestamp}.${fileExtension}`;

          const reader = new FileReader();
          reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
              // 새 파일 객체 생성
              const newFile = new File([file], uniqueFileName, { type: file.type });

              // 새로운 파일 객체와 preview 이미지를 추가
              this.selectedImages.push({ file: newFile, preview: e.target.result, name: uniqueFileName, customName: '', });
            }
          };
          reader.readAsDataURL(file);
        });

        this.currentImageIndex = this.selectedImages.length === 1 ? 0 : this.currentImageIndex;
      },

      updateCurrentIndex(thumbnailIndex) {
        const total = this.selectedImages.length;
        this.currentImageIndex = (this.currentImageIndex + (thumbnailIndex - 2) + total) % total;
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

      handleButtonClick() {
        if (this.isDuplicateCustomName('', -1)) {
          this.errorMessage =
              '이미지 이름에 중복된 값이 있습니다. 모든 이미지 이름을 고유하게 설정해주세요.';
          return;
        }

        // 중복이 없으면 기존 로직 실행
        if (this.isWldcupsPage) {
          this.confirmUpdateImages();
        } else {
          this.confirmImages();
        }
      },

      confirmImages() {
        if (this.selectedImages.some((image) => !image.customName)) {
          this.isConfirmModalVisible = false;
          this.errorMessage = '모든 이미지에 이름을 입력해주세요.';
          return;
        }
        this.isConfirmModalVisible = false;
        this.$emit('images-selected', this.selectedImages);
        this.closeModal();
      },
      confirmClose(){
        if (this.hasAdd){
          this.isConfirmModalVisible = true;
        }else{
          this.$emit('update:isVisible', false);
        }
      },
      async confirmUpdateImages() {
        try {
          this.isLoading = true;
          const updateImages = await Promise.all(
              this.selectedImages.map(async (image) => {
                const imagePath = await updateImage(image.file, this.creatorId, this.title);
                return {
                  path: imagePath,
                  customName: image.customName,
                };
              })
          );

          // 업데이트된 이미지 정보를 Firebase에 반영
          await Promise.all(
              updateImages.map((imageData, index) => {
                return updateWldcupImages(index, this.wldcupId, updateImages);
              })
          );

          console.log('모든 이미지가 성공적으로 업데이트되었습니다.');
        } catch (e) {
          this.errorMessage = `오류: ${e.message}`;
          console.error('이미지 업데이트 중 오류 발생:', e);
        } finally {
          this.isLoading = false;
          this.closeModal();
        }
      },
      closeModal() {
        this.isConfirmModalVisible = false;
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
                image.customName === value && index !== this.currentImageIndex
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
  font-size: 2vw;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: scale(1.05);
  padding: 5px 15px;
  border-radius: 12px;
  background: none;
  border: 1px solid white;
  color: white;
}

.header .button-group {
  display: flex;
  justify-content: center;
  flex-grow: 1;
  justify-content: space-evenly;
}

.header .button.close {
  margin-left: auto;
}

.header .button:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
  border: 1px solid #98B7D4;
  color: #98B7D4;
}

.header .button:active {
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  transform: scale(0.95);
}

.button.close {
  background: none;
  border: none;
  font-size: 2vw;
  color: white;
  cursor: pointer;
}

.header .button.close img{
  width: 30px;
  height: 30px;
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
  cursor: pointer;
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
  bottom: 6px;
  left: 0;
  width: 100%;
  height: 8vh;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.5vh;
  border-radius: 0.5vw;
  font-size: 2vw;
  box-sizing: border-box;
  outline:none;
  padding: 0px 10px;
}

.image-name-input::placeholder{
  color:white;
  
}
</style>


