<template>
  <div class="card-container">
    <div class="card-thumbnails">
      <div class="card-thumbnail">
        <img :src="require('@/assets/thumbnail-dummy.png')" alt=""/>
      </div>
      <div class="card-thumbnail">
        <img :src="require('@/assets/thumbnail-dummy.png')" alt=""/>
      </div>
    </div>
    <h3 class="card-title">
      <router-link id="card-title-link" to="/worldcup?월드컵토큰값">[고화질, 움짤] 한국 여자 아이돌 월드컵 256강</router-link>
    </h3>
    <div class="card-description">
      <span>조회수 1.9만회 · 1개월 전 업데이트됨</span>
      <button class="btn-like">
        <img :src="require('@/assets/like.png')" alt="" />
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "WorldcupCard",
    data() {
      return {
        worldcups: 5,
        worldcupLink: "https://worldcup.com/",
      };
    },
    methods: {

    },
  };
</script>

<style scoped>
  /*
    TODO 1: 창 width 줄였을 때 이미지 끼리 뽀뽀하는 현상 있음
     아무리 줄여도 1rem 만큼의 이격 거리는 남아야 함

    TODO 2: a 태그의 길이는 최대 2줄, 나머지는 ... 처리

    TODO 3: 레코드 별로 개행 처리

    TODO 4: 창 width 줄였을 때 일정 폭부터 콘텐츠를 fixed 처리 하던...
     레코드 별로 노출되는 카드의 수를 줄이던... (이 경우 script도 함께 처리해야 함)
     여하간 행 단위에서 카드 UI가 깨지지 않게 유지
  */
  .card-container {
    margin: 10px;
    padding: 15px;
    cursor: pointer;
    border: solid 1px #d0d0d0;
    border-radius: 10%;
  }
  .card-thumbnails {
    display: flex;
    justify-content: space-between;
  }
  .card-thumbnail > img {
    width: 10rem;
    border-radius: 7%;
  }

  .card-description {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .card-description > span {
    margin-right: 1rem; /* 텍스트가 아무리 길어져도 버튼과 약간의 이격 거리 유지 */
  }

  .btn-like {
    background: transparent;
    border: none;
  }
  .btn-like > img {
    width: 24px;
    height: 24px;
  }

  a {
    color: black;
    text-decoration: none;
  }
</style>