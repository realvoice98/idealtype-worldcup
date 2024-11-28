<template>

  <TournamentModal v-if="this.isModalVisible" />
</template>

<script>
  import TournamentModal from '@/components/modals/TournamentModal.vue';

  // 전체 플로우
  //  0. router-link 에서 worldcupId를 router param으로 전달하여 라우팅 추적
  //  1. WorldcupDetail 페이지 로드
  //  2. TournamentModal 노출 (시작 분기)
  //  3. 시작하면 본 로직. 취소면 this.moveToPreviousPage 처리
  //  4. component\tournamentDetail.vue로 진행률 props & binding (하나의 토너먼트 진행 완료마다 진행률 저장을 위한 POST 요청 필요)
  //  5. views\WorldcupResult.vue에 최종 결과 반환 (통계 데이터 시각화 개발 필요)

  export default {
    name: 'WorldcupDetail',
    components: {
      TournamentModal,
    },
    props: {
      data: {
        type: Object,
      },
    },
    data() {
      return {
        isModalVisible: false,
      }
    },
    mounted() {
      this.changeModalState();
    },
    methods: {
      changeModalState() {
        this.isModalVisible = !this.isModalVisible;
      },
      selectWinner() {
        // if (다음 경기가 있으면) {
        //   move to next tournament
        //   return;
        // }
        // finishWorldcup
        //  => return result & route 이동(wolrdcup-result?${worldcupId}&${n강})
      },
    }
  };
</script>

<style scoped>

</style>