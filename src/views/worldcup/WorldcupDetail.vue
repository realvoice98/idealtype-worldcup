<template>
  <LoadingSpinner :visible="isNextRoundLoaded" />

  <div v-if="!isModalVisible" class="wldcup-details">
    <div class="match-container">
      <div class="match-title">
        <h2>{{ wldcup.title }} <span class="em">{{ currentRoundText }}</span></h2>
        <p v-if="showMatchProgress" class="match-subtitle">
          <span class="em">{{ currentMatch }}</span> / {{ totalMatches }}
        </p>
      </div>
      <div class="match-content" v-if="wldcup.matches && wldcup.matches[`match${currentMatch-1}`]"> <!-- v-if === 데이터 로드까지 대기 -->
        <div class="item-container">
          <img class="item-image" :src="wldcup.matches[`match${currentMatch-1}`].item0.path" alt="" />
          <span class="item-name">{{ wldcup.matches[`match${currentMatch-1}`].item0.title }}</span>
        </div>
        <img class="versus" src="@/assets/vs.png" alt="" />
        <div class="item-container">
          <img class="item-image" :src="wldcup.matches[`match${currentMatch-1}`].item1.path" alt="" />
          <span class="item-name">{{ wldcup.matches[`match${currentMatch-1}`].item1.title }}</span>
        </div>
      </div>
    </div>

    <div class="button-container">
      <!-- :onclick으로 함수 바인딩 시 화면 상에선 모든 데이터 정상 출력 되는데 컴파일은 에러남. WTF -->
      <CommonButton variant="white" @click="selectWinner(0)">선택</CommonButton>
      <CommonButton variant="white" @click="selectWinner(1)">선택</CommonButton>
    </div>
  </div>

  <TournamentModal
    v-if="this.isModalVisible"
    @startWldcup="startWldcup"
    @roundSelected="roundSelection"
    @loadWldcupData="loadWldcupData"
  />

  <VictoryModal
    v-if="this.isWldcupOvered"
    :winner="finalWinner"
  />
</template>

<script>
  import { auth } from '@/services/firebase/auth';
  import { initWldcupProgress, updateWldcupProgress, removeWldcupProgress, updateItemStats } from '@/services/firebase/db';

  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  import TournamentModal from '@/components/modals/worldcup/TournamentModal.vue';
  import CommonButton from '@/components/buttons/CommonButton.vue';
  import VictoryModal from '@/components/modals/worldcup/VictoryModal.vue';

  export default {
    name: 'WorldcupDetail',
    components: {
      VictoryModal,
      LoadingSpinner,
      TournamentModal,
      CommonButton,
    },
    data() {
      return {
        isModalVisible: true,
        isWldcupOvered: false,
        isNextRoundLoaded: false,
        currentRound: null,
        matchCnt: 0,
        wldcup: {
          title: '',
          items: [],
          matches: {}
        },
        finalWinner: null,
      }
    },
    computed: {
      currentMatch() {
        return this.matchCnt + 1; // 현재 진행 중인 매치의 번호
      },
      totalMatches() {
        return this.currentRound / 2; // 이번 라운드의 전체 매치 수 (n강 / 2)
      },
      currentRoundText() {
        return this.currentRound === 2 ? "결승전" : `${this.currentRound}강`;
      },
      showMatchProgress() {
        return this.currentRound !== 2; // 결승전인 경우 매치 현황은 숨김 처리
      },
    },
    methods: {
      async startWldcup() {
        this.isModalVisible = false;
        this.loading(2300);

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
          this.wldcup.matches = matches;
        }

        /**
         * 1:1 매치 대진 구조 생성 함수
         * @param {Object} wldcupItems 현재 잔향즁안 월드컵 내 전체 아이템 수
         * @param {number} currentRound 현재 라운드 수
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
       * @param selectedIndex 선택한 아이템 좌(0) / 우(1)
       */
      async selectWinner(selectedIndex) {
        this.loading(2100)

        // 현재 매치의 승리자
        const matchKey = `match${this.currentMatch - 1}`;
        const matchData = this.wldcup.matches[matchKey];
        const winner =  matchData[`item${selectedIndex}`];

        if (!this.winners) this.winners = [];
        this.winners.push(winner);

        // 로그인 상태인 경우, 진행 이력 저장 > RTDB에 승리자 데이터 업데이트
        const user = auth.currentUser;
        const wldcupId = this.$route.params.id;
        if (user) await updateWldcupProgress(user, wldcupId, this.currentRound, this.currentMatch, winner);

        // 승리자의 승률 데이터 업데이트 > 승리 수 1 증가
        await updateItemStats(wldcupId, winner.title, true);

        // 다음 매치로 이동
        this.matchCnt++;

        // 마지막 매치 진행 시, 현재 라운드 종료
        const matchCnt = Object.keys(this.wldcup.matches).length; // 현재 라운드의 총 매치 수
        if (this.currentMatch > matchCnt) {
          if (this.currentRound > 2) {
            // 다음 라운드
            this.currentRound /= 2;
            this.matchCnt = 0;

            // 다음 라운드의 매치 데이터 생성
            const currentRoundWinners = [...this.winners];
            this.wldcup.matches = createNextRoundMatches(currentRoundWinners);
            this.winners = []; // 현재 라운드의 승리자 목록 초기화
          } else {
            // 결승전 우승자 선택 완료
            this.isWldcupOvered = true;
            this.finalWinner = winner;

            // 우승자 승률 데이터 업데이트 > 승리 수, 우승 수 1 증가
            await updateItemStats(wldcupId, winner.title, true, true);

            // 기진행 이력 제거
            if (user) await removeWldcupProgress(user, wldcupId);
          }
        }

        /**
         * 현재 라운드의 승리자들로 다음 라운드 매치 구성
         * @param winners
         * @returns {{}}
         */
        function createNextRoundMatches(winners) {
          const matches = {};
          let itemIndex = 0;

          for (let i = 0; i < winners.length / 2; i++) {
            matches[`match${i}`] = {
              item0: winners[itemIndex],
              item1: winners[itemIndex + 1],
            };
            itemIndex += 2;
          }

          return matches;
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