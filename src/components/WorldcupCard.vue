<template>
  <div class="card-container">
    <!-- // TODO: .card-container 내에 .card-description 영역 제외하고, 어느 곳을 클릭하던 a 태그 href로 연결될 수 있게끔 수정 -->
    <div class="card-thumbnails">
      <div class="card-thumbnail">
        <img :src="thumbnails[0].path" alt=""/>
        <p>{{ thumbnails[0].customName }}</p>
      </div>
      <div class="card-thumbnail">
        <img :src="thumbnails[1].path" alt=""/>
        <p>{{ thumbnails[1].customName }}</p>
      </div>
    </div>
    <router-link class="card-title" id="card-title-link" :to="worldcupLink">
      {{ title }}
    </router-link>
    <div class="card-description">
      <span>{{ creator }}</span><!-- // TODO: 레벨 뱃지 아이콘 -->
    </div>
    <div class="card-description">
      <span>조회수 {{ views }}회 · {{ updatedAt }} 업데이트됨</span>
      <button class="btn-like">
        <img :src="require('@/assets/like.png')" alt="" />
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'WorldcupCard',
    props: {
      data: {
        type: Object,
      },
    },
    computed: {
      thumbnails() {
        return this.data.thumbnails;
      },
      title() {
        return this.data.title;
      },
      creator() {
        return this.data.creator;
      },
      views() {
        return this.data.views;
      },
      updatedAt() {
        return this.data.updatedAt;
      },
      worldcupLink() {
        return `/worldcup/${this.data.worldcupId}`;
      }
    }
  };
</script>

<style scoped>

  .card-container {
    margin: 1rem;
    padding: 15px;
    /* cursor: pointer; */
    border: solid 1px #d0d0d0;
    border-radius: 3%;
    max-width: 25rem; /* 카드 하나 당 고정 너비 */
    width: 100%;
    box-sizing: border-box;
    
  }
  .card-thumbnails {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem; /* 2개 썸네일 이미지 사이 간격 */
    max-width: 100%;
    min-height: 260px;
  }

  .card-thumbnail > img {
    width: 10rem;
    border-radius: 7%;
    height: 200px;
  }

  .card-thumbnail {
    flex: 1;
    p{
      display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 6px 0px;
    }
  }

  .card-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 개행 최대 2줄 */
    overflow: hidden; /* 최대 길이 초과 텍스트는 ... 처리 */
    text-align: left; /* 텍스트 좌측 정렬 */
    width: 100%;
    /* overflow: hidden;
    white-space: nowrap; */
    min-height: 60px;
    font-size: 20px;
    font-weight: 600;
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

  a {
    color: black;
    text-decoration: none;
  }


</style>