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
            <input v-model="inputHashtag"
                   @input="startsWithHashSymbol"
                   @keyup.enter="appendHashtag"
                   @keyup.backspace="removeHashtag"
                   type="text"
                   placeholder="#태그 입력 (최대 10개)" />
          </div>
          <p class="warn-message" v-if="warnMessage">{{ warnMessage }}</p>
        </div>
      </div>
      <div class="content-box">
        <div class="image-box"> <!-- 매 추가마다 image-box arr.append() -->
          <img src="" alt="이미지 영역"/>
        </div>
      </div>
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
export default {
  name: "CreateWorldcup",
  data() {
    return {
      title: '',
      details: '',
      inputHashtag: '',
      hashtags: [],
      warnMessage: '',
    };
  },
  methods: {
    goBack() {
      // Component 처리
    },
    /**
     * 해시태그 입력 시 '#' 문자 자동 추가
     */
    startsWithHashSymbol() {
      // FIXME: 깔끔하지 못한 자동 추가 프로세스
      if (!this.inputHashtag.startsWith('#')) {
        this.inputHashtag = '#' + this.inputHashtag.replace(/^#+/, '');
      }
    },
    /**
     * 해시태그 입력창에서 텍스트 작성 후 Enter 입력 시, 작성한 텍스트로 해시태그 추가
     */
    appendHashtag() {
      // FIXME: if depth 개선 (early return)
      if (this.inputHashtag && this.hashtags.length < 10) {
        const normalizedHashtag = this.inputHashtag.toLowerCase(); // 영문 입력은 소문자로 통합

        if (this.hashtags.includes(normalizedHashtag)) {
          this.warnMessage = '중복된 해시태그를 추가할 수 없습니다.';
          return;
        }
        this.hashtags.push(normalizedHashtag);
        this.inputHashtag = '';
        this.warnMessage = '';
      } else if (this.hashtags.length >= 10) {
        this.warnMessage = '최대 10개의 해시태그만 추가할 수 있습니다.';
      }
    },
    /**
     * 해시태그 입력창에서 아무것도 작성하지 않은 상태로 Backspace 입력 시, 가장 최근에 추가된 태그 제거
     */
    removeHashtag() {
      if (!this.inputHashtag) this.hashtags.pop();
    },
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

  button {
    width: 100%;
    margin-bottom: 1.5rem;
  }
</style>