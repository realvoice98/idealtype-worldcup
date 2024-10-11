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
    startsWithHashSymbol() {
      if (!this.inputHashtag.startsWith('#')) {
        this.inputHashtag = '#' + this.inputHashtag.replace(/^#+/, '');
      }
    },
    appendHashtag() {
      if (this.inputHashtag && this.hashtags.length < 10) {
        // TODO: duplicate validation
        this.hashtags.push(this.inputHashtag);
        this.inputHashtag = '';
      } else if (this.hashtags.length >= 10) {
        this.warnMessage = '최대 10개의 해시태그만 추가할 수 있습니다.';
      }
    },
    removeHashtag() {
      // x 버튼을 매개체로 해시태그 지우기
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

  button {
    width: 100%;
    margin-bottom: 1.5rem;
  }
</style>