<template>
  <TournamentModal
    v-if="this.isModalVisible"
    @startWldcup="startWldcup"
    @roundSelected="roundSelection"
    @loadWldcupData="loadWldcupData"
  />

  <div v-if="!isModalVisible" class="wldcup-details">
    <div class="match-container">
      <div class="match-title">
        <h2>{{ wldcup.title }}</h2>
      </div>
      <div class="match-content">
        <div class="item-container">
          <img class="item-image" :src="wldcup.items[lIdx].path" alt="" />
          <span class="item-name">{{ wldcup.items[lIdx].customName }}</span>
        </div>
        <div class="item-container">
          <img class="item-image" :src="wldcup.items[rIdx].path" alt="" />
          <span class="item-name">{{ wldcup.items[rIdx].customName }}</span>
        </div>
      </div>
    </div>

    <div class="button-container">
      <!-- :onclick으로 함수 바인딩 시 화면 상에선 모든 데이터 정상 출력 되는데 컴파일은 에러남. WTF -->
      <CommonButton variant="white" @click="selectWinner(lIdx)">선택</CommonButton>
      <CommonButton variant="white" @click="selectWinner(rIdx)">선택</CommonButton>
    </div>
  </div>
</template>

<script>
  import { processMatchResult } from '@/services/firebase/db';

  import TournamentModal from '@/components/modals/worldcup/TournamentModal.vue';
  import CommonButton from '@/components/buttons/CommonButton.vue';

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
      CommonButton,
    },
    data() {
      return {
        isModalVisible: true,
        selectedRound: null,
        wldcup: {
          title: '',
          items: [],
        },
        lIdx: 0,
        rIdx: 1,
      }
    },
    created() {
      const wldcupId = this.$route.params.id;
    },
    methods: {
      startWldcup() {
        this.isModalVisible = false;
      },
      roundSelection(round) {
        // 모달에서 선택된 라운드 수 저장
        this.selectedRound = round;
      },
      /**
       * 승리자 선택 시 다음 라운드로 이동 및 현재 진행률 저장
       * @param selectedIndex
       */
      selectWinner(selectedIndex) {
        console.log('승리한 후보:', this.wldcup.items[selectedIndex].customName);

        // FIXME: 대기 화면으로 클릭 못 하게 막지 않으면 버튼 연타해서 스킵 가능한 이슈가 있음

        // 다음 매치로 이동
        this.lIdx += 2;
        this.rIdx += 2;

        // 라운드 종료 처리
        if (this.lIdx >= this.wldcup.items.length) {
          // TODO: 라운드 넘어갈 시 분기 처리
          //  IF 결승전이 아니면 다음 라운드로 이동
          //  ELSE 월드컵 종료 처리 및 WorldcupResult로 이동
        }
      },
      loadWldcupData(data) {
        // 토너먼트 모달에서 전달받은 데이터
        this.wldcup = data;
      },
      async processMatchResult() {
        // const matchResult = await processMatchResult();
      },
    }
  };
</script>

<style scoped>
  .wldcup-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .match-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
  }

  .match-title {
    margin-bottom: 1.5rem;
  }
  .match-title h2 {
    text-align: center;
    margin: 10px 0;
  }

  .match-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .item-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex: 1; /* 양 영역을 동일한 비율로 구분 */
    text-align: center;
    position: relative;
  }
  .item-image {
    width: 100%;
    height: 100%;
    max-height: 500px;
  }
  .item-name {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.4);
    color: whitesmoke;
    width: 100%;
    padding: 0.8rem;
    border-radius: 35px 35px 0 0;
    box-sizing: border-box;
    bottom: 0; /* 이미지 하단에 배치 */
    font-size: 1.2rem;
    word-wrap: break-word; /* 긴 문자는 줄바꿈 */
    white-space: normal; /* 여러 줄로 표시 */
  }

  .button-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 600px;
  }
  .button-container button {
    flex: 1; /* 각 버튼이 동일한 비율로 공간을 차지 */
    margin: 0 5rem;
    justify-content: center;
  }
</style>