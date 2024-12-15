<template>
  <div class="modal-wrap">
    <div class="modal-container">
      <h1>
        <span class="icon em" v-for="(item, index) in 7" :key="index">abc</span>
        <span class="title em">VICTORY</span>
        <span class="icon em" v-for="(item, index) in 7" :key="index">abc</span>
      </h1>
      <hr>
      <img :src="winner.path" alt="" />
      <h2 class="name">{{ winner.title }}</h2>
      <hr>
      <CommonButton variant="primary" :onclick="moveToResultPage">
        <span class="icon">bar_chart</span> 결과 보러 가기
      </CommonButton>
    </div>
  </div>
</template>

<script>
  import CommonButton from '@/components/buttons/CommonButton.vue';

  export default {
    name: 'VictoryModal',
    components: {
      CommonButton
    },
    props: {
      winner: {
        type: Object,
        required: true,
      },
    },
    methods: {
      /**
       * 현재 월드컵의 결과 페이지로 이동
       */
      moveToResultPage() {
        const wldcupId = this.$route.params.id;
        this.$router.push(`/wldcup-result/${wldcupId}`);
      },
    },
  };
</script>

<style scoped>
  .icon {
    font-size: 1.2rem;
  }
  .icon.em {
    font-size: 1.5rem;
    text-shadow: -2px -2px 5px rgba(0, 0, 0, 0.2);
  }
  .em {
    color: var(--theme);
  }
  .title {
    margin: 0 10px;
    text-shadow: -2px -2px 5px rgba(0, 0, 0, 0.2);
  }
  .name {
    display: -webkit-box; /* 다중 행 제한 */
    -webkit-line-clamp: 2; /* 최대 2줄 제한 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis; /* 초과 내용은 ...으로 표시 */
    white-space: normal; /* 줄바꿈 가능 */
    color: black; /* 다크모드 대응 */
  }

  img {
    max-width: 480px;
    height: 350px;
  }

  button {
    margin-top: 1rem;
    font-size: 1.2rem;
  }
</style>