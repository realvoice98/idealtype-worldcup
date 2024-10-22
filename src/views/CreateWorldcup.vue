<template>
  <div class="container">
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
                     placeholder="#태그 입력 (최대 10개)" />
          </div>
        </div>
      </div>
      <p class="warn-message" v-if="warnMessage">{{ warnMessage }}</p>
      <div class="content-box">
        <div class="image-area" @click="openModal"> <!-- 매 추가마다 image-box arr.append() -->
          <div class="image-box" v-for="(image, index) in images" :key="index">
            <img :src="image.preview" alt="이미지 영역" />
          </div>
          <div v-if="images.length === 0">
            여기를 클릭해서 이미지를 등록해주세요.
          </div>
        </div>
      </div>

      <ImageRegistModal
        :is-visible="isModalVisible"
        @update:isVisible="isModalVisible = $event"
        @images-selected="addImages"
      />

      <button class="btn-create"> <!-- Component 처리 -->
        <span>만들기</span>
      </button>
      <button class="btn-back">  <!-- Component 처리 -->
        <span>돌아가기</span>
      </button>
    </div>
  </div>
</template>

<script>
import ImageRegistModal from "@/components/modals/ImageRegistModal.vue";

export default {
  name: "CreateWorldcup",
  components: {ImageRegistModal},
  data() {
    return {
      title: '',
      details: '',
      hashtagValue: '',
      hashtags: [],
      warnMessage: '',
      isModalVisible: false,
      images: [],
    };
  },
  methods: {
    goBack() {
      // Component 처리
    },
    /**
     * 해시태그 입력 처리 함수
     * @param {Event} event 사용자 입력 값 접근을 위한 입력 이벤트 객체
     */
    onInputHashtag(event) {
      // FIXME: 매끄럽지 않은 양방향 바인딩 상태
      this.hashtagValue = event.target.value
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
     *
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
    openModal() {
      this.isModalVisible = true;
    },
    addImages(images) {
      this.images.push(...images);
    }
  },
}
</script>

<style scoped>
  .container {
    width: 100%;
    justify-content: center;
    align-items: center;
    height: 75vh;
  }

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
  }

  .content-box > input { /* FIXME: title, details 임시 선택자 */
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
    padding: 8px;
  }

  .input-hashtag {
    display: flex;
    align-items: center;
  }

  .input-hashtag span {
    color: #757575;

    /* FIXME: placeholder font style과 동일하게 적용해야 하는데
        index.css 반영 사항이 제대로 적용되지 않고 있어서 임시로 사용 */
    font-size: 14px;
    font-family: '';
  }

  .image-area {
    display: flex;
    height: 10rem;
    flex-wrap: wrap;
    cursor: pointer;
    gap: 10px;
  }

  .image-box img{
    width: 100px;
    height: 100px;
  }

  button {
    width: 100%;
    margin-bottom: 1.5rem;
  }
</style>