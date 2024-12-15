<template>
  <LoadingSpinner :visible="isNextRoundLoaded" />

  <div v-if="!isModalVisible" class="wldcup-details">
    <div class="match-container">
      <div class="match-title">
        <h2>{{ wldcup.title }} <span class="em">{{ currentRound }}강</span></h2> <!-- TODO: "결승전" 분기 -->
        <p class="match-subtitle"><span class="em">{{ currentMatch }}</span> / {{ totalMatches }}</p>
      </div>
      <div class="match-content">
        <div class="item-container">
          <img class="item-image" :src="wldcup.items[lIdx].path" alt="" />
          <span class="item-name">{{ wldcup.items[lIdx].customName }}</span>
        </div>
        <img class="versus" src="@/assets/vs.png" alt="" />
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

  <TournamentModal
    v-if="this.isModalVisible"
    @startWldcup="startWldcup"
    @roundSelected="roundSelection"
    @loadWldcupData="loadWldcupData"
  />
</template>

<script>
  import { auth } from '@/services/firebase/auth';
  import { initWldcupProgress, processMatchResult } from '@/services/firebase/db';

  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  import TournamentModal from '@/components/modals/worldcup/TournamentModal.vue';
  import CommonButton from '@/components/buttons/CommonButton.vue';

  //  4. component\tournamentDetail.vue로 진행률 props & binding (하나의 토너먼트 진행 완료마다 진행률 저장을 위한 POST 요청 필요)
  //  5. views\WorldcupResult.vue에 최종 결과 반환 (통계 데이터 시각화 개발 필요)

  export default {
    name: 'WorldcupDetail',
    components: {
      LoadingSpinner,
      TournamentModal,
      CommonButton,
    },
    data() {
      return {
        isModalVisible: true,
        isNextRoundLoaded: false,
        currentRound: null,
        wldcup: {},
        lIdx: 0,
        rIdx: 1,
      }
    },
    computed: {
      currentMatch() {
        return Math.floor(this.lIdx / 2) + 1; // 현재 진행 중인 매치 번호
      },
      totalMatches() {
        return this.currentRound; // 이번 라운드의 전체 매치 수 (n강)
      },
    },
    methods: {
      async startWldcup() {
        this.isModalVisible = false;

        // 로그인 상태인 경우, 진행도 저장 공간에 현재 월드컵 매치 정보 초기 데이터 세팅
        const user = auth.currentUser;
        if (user) {
          const wldcupId = this.$route.params.id;
          const round = this.currentRound;

          // 아이템 순서 셔플
          this.wldcup.items = shuffleItems(this.wldcup.items);

          // 1:1 매치 생성
          const matches = createMatches(this.wldcup.items, round);

          await initWldcupProgress(user, wldcupId, round, matches);
        }

        this.loading(1500);

        /**
         * 1:1 매치 대진 구조 생성 함수
         * @param {Object} wldcupItems 현재 잔향즁안 월드컵 내 전체 아이템 수
         * @param {number} currentRound 현재 라운드
         * @returns {Object} 현재 라운드의 전체 대진 구조
         */
        function createMatches(wldcupItems, currentRound) {
          const matches = {};
          let itemIndex = 0;

          for (let i = 0; i < currentRound / 2; i++) {
            matches[`match${i}`] = {
              item0: {
                title: wldcupItems[itemIndex]?.customName || '',
                path: wldcupItems[itemIndex]?.path || '',
              },
              item1: {
                title: wldcupItems[itemIndex + 1]?.customName || '',
                path: wldcupItems[itemIndex + 1]?.path || '',
              },
            };
            itemIndex += 2;
          }

          return matches;
        }

        /**
         * 월드컵 전체 아이템 순서 셔플
         * @param {Array} items 월드컵 전체 아이템
         * @returns {*[]} 순서가 셔플된 전체 아이템
         */
        function shuffleItems(items) {
          const shuffledItems = [...items]; // 원본 배열 복사
          for (let i = shuffledItems.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [shuffledItems[i], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[i]];
          }
          return shuffledItems;
        }
      },
      roundSelection(round) {
        // 토너먼트 모달에서 선택한 라운드 수 저장
        this.currentRound = round;
      },
      loadWldcupData(data) {
        // 토너먼트 모달에서 전달받은 월드컵 데이터 저장
        this.wldcup = data;
      },
      /**
       * 승리자 선택 시 다음 라운드로 이동 및 현재 진행률 저장
       * @param selectedIndex
       */
      selectWinner(selectedIndex) {
        this.loading(2300);

        const winner = this.wldcup.items[selectedIndex];
        // 승리자를 다음 라운드 배열에 추가

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
      async processMatchResult() {
        // const matchResult = await processMatchResult();
      },
      /**
       * 다음 라운드의 데이터가 로드 되기까지 로딩 스피너 노출
       * @param timeout 로딩 시간
       */
      loading(timeout) {
        this.isNextRoundLoaded = true;

        // TODO: 이미지가 바뀌는 것을 감지 한 후 변경, 현재는 네트워크 성공 유무와 관계 없이 하드 코딩
        setTimeout(() => {
          this.isNextRoundLoaded = false;
        }, typeof timeout !== undefined ? timeout : 1500);
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
  .match-subtitle {
    font-size: 1.3rem;
    margin: 0;
  }
  .em {
    color: var(--theme);
    font-weight: bold;
  }

  .match-content {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
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
    height: 500px; /* 각 이미지 별로 상이한 문제가 있으므로 반드시 고정 폭으로 할당 */
    object-fit: cover; /* 이미지가 영역을 채우되, 비율은 유지 */
  }
  .item-name {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.3);
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

  .versus {
    position: absolute;
    z-index: 1;
    width: 350px;
    height: auto;
    left: 50%;
    transform: translate(-50%); /* 중앙 위치 */
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