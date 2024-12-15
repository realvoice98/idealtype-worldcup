<template>
  <div class="card-container">
    <router-link :to="wldcupLink">
      <div class="card-thumbnails">
        <div class="card-thumbnail">
          <img :src="thumbnails[0].path" alt="썸네일 이미지 1"/>
          <p>{{ thumbnails[0].customName }}</p>
        </div>
        <div class="card-thumbnail">
          <img :src="thumbnails[1].path" alt="썸네일 이미지 2"/>
          <p>{{ thumbnails[1].customName }}</p>
        </div>
      </div>
      <div class="card-title" id="card-title-link">
        {{ title }}
      </div>
    </router-link>
    <div class="card-description">
      <ProfileButton width="32" height="32" :src="profileImage"/>
      <span class="creator">{{ creator }}</span><!-- // TODO: 레벨 뱃지 아이콘 -->
    </div>
    <div class="card-description detail">
      <span>조회수 {{ views }}회 · {{ updatedAt }} 업데이트됨</span>
      <LikeButton :user="user" :wldcupId="data.wldcupId"/>
      <CommonButton variant="transparent" :onclick="moveToResultPage" style="border: none; font-size: 1.3rem; padding: none;">
        <span class="icon">equalizer</span>
      </CommonButton>
      <ReportButton :user="user" :wldcupId="data.wldcupId" @open-modal="openReportModal" />
    </div>
  </div>
</template>

<script>
  import ProfileButton from '@/components/buttons/ProfileButton.vue';
  import CommonButton from '@/components/buttons/CommonButton.vue';
  import LikeButton from '@/components/buttons/LikeButton.vue';
  import ReportButton from '@/components/buttons/ReportButton.vue';

  export default {
    name: 'WorldcupCard',
    components: {
      ProfileButton,
      CommonButton,
      LikeButton,
      ReportButton,
    },
    props: {
      data: {
        type: Object,
      },
      profileImage: {
        type: String,
        default: '',
      },
      user: Object,
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
      wldcupLink() {
        return `/wldcup/${this.data.wldcupId}`;
      }
    },
    methods: {
      openReportModal() {
        this.$emit('open-modal', this.data.wldcupId);
      },
      moveToResultPage() {
        const wldcupId = this.data.wldcupId;
        this.$router.push(`wldcup-result/${wldcupId}`);
      }
    },
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
    p {
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
    justify-content: flex-start;
    width: 100%;
  }
  .card-description > span {
    margin-right: 1rem; /* 텍스트가 아무리 길어져도 버튼과 약간의 이격 거리 유지 */
  }
  .card-description.detail button {
    padding: 0;
    margin-left: 0.5rem;
  }

  .creator {
    margin-left: 10px;
  }

  a {
    color: inherit; /* 부모 요소의 색상 상속 */
    text-decoration: none;
  }
</style>