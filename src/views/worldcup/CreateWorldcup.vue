<template>
  <div class="create-wldcup container">
    <div class="content">
      <div class="content-box">
        <input v-model="title" type="text" placeholder="제목을 입력해주세요" />
      </div>
      <div class="content-box">
        <input v-model="details" type="text" placeholder="상세 설명" />
      </div>
      <div class="content-box">
        <div class="hashtag-text-area">
          <span class="hashtag" v-for="(hashtag, index) in hashtags" :key="index">{{ hashtag }}</span>
          <div class="input-hashtag">
              <span v-show="hashtagValue.length > 0">#</span>
              <input :value="hashtagValue"
                     @input="onInputHashtag"
                     @keydown.enter="appendHashtag"
                     @keydown.space="appendHashtag"
                     @keydown.backspace="removeHashtag"
                     type="text"
                     placeholder="#태그 입력 (최대 10개)"
              />
          </div>
        </div>
      </div>
      <p class="warn-message" v-if="warnMessage">{{ warnMessage }}</p>
      <div class="content-box">
        <div class="image-area" @click="openRegistModal">
          <div class="image-box" v-for="(image, index) in images" :key="index" @click.stop="openDetailModal(index)">
            <img :src="image.preview" alt="이미지 영역" />
          </div>
          <div class="image-registration" v-if="images.length === 0">
            여기를 클릭해서 이미지를 등록해주세요.
          </div>
        </div>
      </div>
      <div class="button-container">
        <CommonButton variant="primary" :onclick="createWldcup">
          만들기
        </CommonButton>
        <CommonButton variant="white" :onclick="this.moveToPreviousPage">
          돌아가기
        </CommonButton>
      </div>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>

      <CommonModal2
        v-if="isConfirmModalVisible"
        :visible="isConfirmModalVisible"
        content="저장되었습니다."
        :buttons="confirmButtons"
        @update:visible="isConfirmModalVisible = $event"
    />

      <ImageRegistModal
        :is-visible="isRegistModalVisible"
        @update:isVisible="isRegistModalVisible = $event"
        @images-selected="addImages"
      />
      <ImageDetailModal
        :is-visible="isRegistDetailVisible"
        @update:isVisible="isRegistDetailVisible = $event"
        :initialIndex="selectedImageIndex"
        :modelValue="imagesCopy"
        @update:modelValue="updateImages"
      />

    </div>
  </div>
</template>

<script>
  import { auth, onAuthStateChanged } from '@/services/firebase/auth';
  import { getUser, createWldcup, uploadImage } from '@/services/firebase/db';

  import ImageRegistModal from '@/components/modals/worldcup/ImageRegistModal.vue';
  import ImageDetailModal from '@/components/modals/worldcup/ImageDetailModal.vue';
  import CommonButton from '@/components/buttons/CommonButton.vue';
import CommonModal2 from '@/components/modals/CommonModal2.vue';

  export default {
    name: 'CreateWorldcup',
    components: {
      ImageRegistModal,
      ImageDetailModal,
      CommonButton,
      CommonModal2
    },
    data() {
      return {
        title: '',
        details: '',
        hashtagValue: '',
        hashtags: [],
        isRegistModalVisible: false,
        isRegistDetailVisible: false,
        images: [],
        imagesCopy: [],
        user: null,
        warnMessage: '',
        errorMessage: '',
        selectedImageIndex: 0,
        isConfirmModalVisible: false,
      };
    },
    created() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // 사용자가 로그인된 상태라면
          this.user = user;
        } 
        // else {
        //   // TODO: 커스텀 모달로 수정 적용
        //   if (confirm('로그인 상태에서만 월드컵을 만들 수 있어요. 로그인하러 가시겠어요?')) {
        //     this.$router.push('/sign-in');
        //   } else {
        //     this.$router.push('/');
        //   }
        // }
      });
    },
    computed:{
      confirmButtons() {
      return [
        {
          text: "확인",
          callback: () => this.moveRoot(),
        },
      ];
    }
    },
    mounted() {
      document.title = '이상형 월드컵 : 월드컵 만들기';
    },
    methods: {
      /**
       * 해시태그 입력 처리 함수
       * @param {Event} e 사용자 입력 값 접근을 위한 입력 이벤트 객체
       */
      onInputHashtag(e) {
        // FIXME: 매끄럽지 않은 양방향 바인딩 상태
        this.hashtagValue = e.target.value
          .replace(/#/g, '') // '#' 미포함
          .replaceAll(' ', '') // 공백 미포함
          .toLowerCase(); // 영문 소문자로 통합
      },
      /**
       * 해시태그 추가 함수
       */
      appendHashtag() {
        if (!this.hashtagValue) return;
        if (this.hashtags.length === 10) {
          this.warnMessage = '최대 10개의 해시태그만 추가할 수 있습니다.';
          return;
        }
        const hashtag = '#' + this.hashtagValue;
        if (this.hashtags.includes(hashtag)) {
          this.warnMessage = '중복된 해시태그를 추가할 수 없습니다.';
          return;
        }
        this.hashtags.push(hashtag);
        this.hashtagValue = '';
        this.warnMessage = '';
      },
      /**
       * 해시태그 삭제 함수
       * @param {Event} event 사용자 입력 값 접근을 위한 입력 이벤트 객체
       */
      removeHashtag(event) {
        // 해시태그 지우기와 입력값 지우기의 로직 분리
        if (this.hashtagValue === '') {
          // hashtagValue가 빈 문자열일 때만 해시태그 삭제
          this.hashtags.pop();
          if (this.hashtags.length < 10) this.warnMessage = '';
        } else {
          // 입력된 값이 있으면 해당 값에서 한 글자만 삭제
          event.preventDefault(); // 기본 동작 방지 (Backspace 중복 호출로 인해 2글자씩 지워지는 현상)
          this.hashtagValue = this.hashtagValue.slice(0, -1);
        }
        // TODO: 기추가 태그 클릭 후 Backspace 입력 통해 선택적으로 제거
      },
      openRegistModal() {
        this.isRegistModalVisible = true;
      },
      openDetailModal(index) {
        this.selectedImageIndex = index;
        this.imagesCopy = JSON.parse(JSON.stringify(this.images));
        this.isRegistDetailVisible = true;
      },
      addImages(images) {
        images.forEach((image) => {
          this.images.push({
            ...image,
            customName: image.customName,
          });
        });
      },
      updateImages(updatedImages) {
        this.images = JSON.parse(JSON.stringify(updatedImages));  // 자식에서 변경된 배열을 받아서 업데이트
      },
      moveRoot() {
      this.isConfirmModalVisible = false;
      this.$router.push('/');
    },
      /**
       * 월드컵 생성 요청 함수
       */
      async createWldcup() {
        // 유효성 검사
        if (!this.title.trim()) {
          this.errorMessage = '제목을 입력해주세요.';
          return;
        }
        if (!this.details.trim()) {
          this.errorMessage = '상세 설명을 입력해주세요.';
          return;
        }
        if (this.hashtags.length === 0) {
          this.errorMessage = '해시태그를 1개 이상 입력해주세요.';
          return;
        }
        if (this.images.length < 2) {
          this.errorMessage = '이미지는 최소 2개 이상 등록해야 합니다.';
          return;
        }

        try {
          const userData = await getUser(this.user);
          const user = {
            ...userData,
            uid: this.user.uid,
          }

          // 스토리지 저장 요청 후 경로 반환
          const uploadedImages = await Promise.all(
              this.images.map(async (image) => {
                const imagePath = await uploadImage(image.file, user.uid, this.title);
                return {
                  path: imagePath,
                  customName: image.customName, // 사용자 입력 이름 포함
                };
              })
          );

          const worldcup = {
            title: this.title,
            details: this.details,
            hashtags: this.hashtags,
            images: uploadedImages,
          }

          const create_result = await createWldcup(user, worldcup);
          if(create_result){
            this.isConfirmModalVisible = true;
            // this.$router.push('/');
          }
          
        } catch (e) {
          this.errorMessage = `오류: ${e.message}`;
        }
      },
    },
  };
</script>

<style scoped>
  .container {
    width: 100%;
    justify-content: center;
    align-items: center;
    height: 75vh;
  }
  .create-wldcup {
    .content {
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .content-box {
      border: 1px solid lightgray;
      border-radius: 5px;
      margin-bottom: 1rem;
    }

    input {
      border: none;
      outline: none;
      background-color: inherit; /* 다크모드 대응 */
      color: inherit; /* 다크모드 대응 */
    }

    .content-box{
      padding:5px 10px;
    }

    .content-box > input {
      width: 100%;
    }

    .hashtag-text-area {
      height: auto;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
      box-sizing: border-box;
      color: dimgray;
      line-height: 22px;
    }

    .input-hashtag {
      display: flex;
      align-items: center;
    }

    .input-hashtag span {
      color: #757575;
      font-size: 14px;
      font-family: '';
    }

    .image-area {
      display: flex;
      min-height: 10rem;
      flex-wrap: wrap;
      cursor: pointer;
      gap: 10px;
    }

    .image-box img{
      width: 100px;
      height: 100px;
    }

    .image-registration{
      width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    }

    .button-container {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
    }
  }
</style>