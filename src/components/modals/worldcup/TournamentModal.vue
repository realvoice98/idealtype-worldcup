<template>
  <div class="modal-wrap">
    <LoadingSpinner :visible="isLoading" />

    <div v-if="isProgress" class="modal-container" style="padding: 40px">
      <img src="@/assets/trophy.png" alt="" />
      <h2>{{ title }}</h2>
      <div style="margin-bottom: 30px">
        <p>이 월드컵에 대한 진행 이력이 있어요!</p>
        <p><strong>이어서 진행</strong>하시겠어요?</p>
      </div>
      <div class="modal-buttons">
        <CommonButton variant="primary" :onclick="loadWldcup">불러오기</CommonButton>
        <CommonButton variant="white" :onclick="newWldcup">새로하기</CommonButton>
        <CommonButton variant="white" :onclick="this.moveToPreviousPage">뒤로가기</CommonButton>
      </div>
    </div>

    <div v-if="!isProgress && isProgress !== null" class="modal-container" style="padding: 40px">
      <img src="@/assets/trophy.png" alt="" />
      <h2>{{ title }}</h2>
      <div class="modal-description">
        <p>{{ description }}</p>
      </div>
      <div class="hashtag-container">
        <span class="hashtag" v-for="(hashtag, index) in hashtags" :key="index">
          {{ hashtag }}
        </span>
      </div>
      <p style="margin-bottom: 35px;">총 {{ totalItemCnt }}명의 후보 중 <b>무작위 {{ enterItemCnt }}명</b>으로 토너먼트가 진행됩니다.</p>
      <div class="modal-buttons">
        <div class="dropdown-container">
          <button class="btn-dropdown">
            {{ enterItemCnt }}강 <span class="icon">arrow_drop_down</span>
          </button>
          <div class="dropdown-content">
            <span v-for="(round, index) in rounds" :key="index" @click="selectTournamentCnt">
              {{ round }}강
            </span>
          </div>
        </div>
        <CommonButton variant="primary" :onclick="startWldcup">시작하기</CommonButton>
        <CommonButton variant="white" :onclick="this.moveToPreviousPage">뒤로가기</CommonButton>
      </div>
    </div>
  </div>
</template>

<script>
  import { auth } from '@/services/firebase/auth';
  import { checkInProgressWldcup, increaseInViews, fetchWldcup, fetchInProgressWldcup } from '@/services/firebase/db';
  
  import CommonButton from '@/components/buttons/CommonButton.vue';
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  
  export default {
    name: 'TournamentModal',
    components: {
      LoadingSpinner,
      CommonButton,
    },
    data() {
      return {
        isLoading: true,
        isProgress: null, // 월드컵 진행 이력이 존재하는지
        title: '',
        description: '',
        hashtags: [],
        totalItemCnt: 0, // 전체 후보 수
        enterItemCnt: 0, // 출진 후보 수 (rounds * 2)
        rounds: [], // n강
      };
    },
    created() {
      this.increaseInViews();
      this.checkInProgressWldcup();

      // TODO: Promise 분기 통해 inProgress 값에 따라 fetchWldcup 여부 결정
      //  아닌 경우는 월드컵 데이터를 users/uid/inProgressWldcup 하위노드에서 가져옴
      //  >> 기존에 진행하던 스냅샷 데이터

      this.fetchWldcup();
    },
    methods: {
      /**
       * 현재 월드컵의 조회수 1 증가
       */
      async increaseInViews() {
        // TODO: 현재 IP를 대상으로 조회수 대기 시간 부여
        const wldcupId = this.$route.params.id;

        await increaseInViews(wldcupId);
      },
      /**
       * 현재 월드컵에 대한 진행 이력이 존재하는지 체크
       */
      async checkInProgressWldcup() {
        const wldcupId = this.$route.params.id;
        const user = auth.currentUser;
        if (user === null) {
          // 세션이 존재하지 않으면 무조건 진행 이력 없는 것으로 취급
          this.isProgress = false;
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
          return;
        }

        // NOTE: 이 경고에 속지 마시오 >> Vue: await has no effect on the type of this expression
        //       Promise resolve 처리 안 해주면 <pending> 상태로 return되어서 truthy한 값으로 인식됨 -> FUCK YOU JS
        this.isProgress = await checkInProgressWldcup(user, wldcupId);

        // Promise resolve 이후 1초 뒤 시점에 로딩 스피너 제거 (부드러운 화면 전환)
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      },
      async fetchWldcup() {
        const wldcupId = this.$route.params.id;
        const wldcup = await fetchWldcup(wldcupId);

        this.title = wldcup.title;
        this.images = wldcup.images;
        this.description = wldcup.description;
        this.hashtags = wldcup.hashtags;
        this.totalItemCnt = wldcup.images.length;
        this.enterItemCnt = Math.pow(2, Math.floor(Math.log2(this.totalItemCnt))); // 가장 가까운 2의 제곱수
        this.rounds = this.calcRounds(this.totalItemCnt); // 라운드 배열 연산

        // 부모 컴포넌트로 월드컵 데이터 전달
        this.$emit('loadWldcupData', {
          title: this.title,
          items: this.images,
        });
      },
      /**
       * 총 후보 수를 기준으로 최대 라운드부터 최소 라운드(4강)까지 배열 원소를 추가하는 연산 함수
       * @param totalItemCnt 단일 월드컵 내 총 후보 수
       * @returns {Array} 최대 라운드 ~ 최소 라운드(4강) 데이터를 담은 배열
       */
      calcRounds(totalItemCnt) {
        const rounds = [];
        let current = Math.pow(2, Math.floor(Math.log2(totalItemCnt))); // 가장 가까운 2의 제곱수 (최대 라운드)

        // 라운드의 최소값은 4강
        while (current >= 4) {
          rounds.push(current);
          current /= 2;
        }
        return rounds; // ex. [ 128, 64, 32, 16, 8, 4 ]
      },
      /**
       * 선택한 토너먼트 라운드 수로 UI 업데이트
       */
      selectTournamentCnt(e) {
        const innerText = e.target.innerText;

        const selectItem = document.querySelector('.btn-dropdown');
        selectItem.style.borderWidth = '1.5px';
        selectItem.style.backgroundColor = 'white';
        selectItem.style.borderColor = '#98B7D4';
        selectItem.innerHTML = innerText;

        const enterItemCnt = parseInt(innerText.replace('강', ''), 10);
        this.enterItemCnt = enterItemCnt; // n강 === n아이템 === n/2 매치

        // 드랍박스 하단 화살표 아이콘 업데이트
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('icon');
        iconSpan.style.fontSize = '20px';
        iconSpan.style.float = 'right';
        iconSpan.innerText = 'arrow_drop_down';
        selectItem.appendChild(iconSpan);
      },
      /**
       * 부모 컴포넌트로 선택한 라운드 데이터 및 모달 종료 이벤트 전달
       */
      startWldcup() {
        // 선택한 라운드 값 전달
        const $round = document.querySelector('.btn-dropdown');
        const selectedRound = parseInt($round.innerText.replace('강', ''), 10);
        this.$emit('roundSelected', selectedRound);

        // 모달 종료 이벤트 전달
        this.$emit('startWldcup');
      },
      /**
       * 진행 이력 존재 > 불러오기
       */
      async loadWldcup() {
        const wldcupId = this.$route.params.id;
        const user = auth.currentUser;

        // 진행 중인 월드컵 데이터 가져오기
        const inProgressWldcup = await fetchInProgressWldcup(user, wldcupId);

        const round = inProgressWldcup.round;

        // FIXME: 이 데이터 묶음이 WorldcupDetail에 바인딩 될 수 있게 수정 필요 (기존의 새로하기 로직과 구분이 되어야 함)
        if (inProgressWldcup) {
          this.$emit('loadWldcupData', inProgressWldcup.matches[round]);
          this.$emit('roundSelected', inProgressWldcup.round)
        } else {
          alert('알 수 없는 오류'); // TODO: CommonModal2로 교체
        }
      },
      /**
       * 진행 이력 존재 > 새로하기
       */
      newWldcup() {
        this.isProgress = false;
        // TODO: 기진행 이력 데이터를 지워야?
      },
    },
  };
</script>

<style scoped>
  h2, p {
    color: black; /* 다크모드에 영향을 받지 않도록 고유 속성을 강제 */
  }

  .modal-description {
    color: dimgray;
  }

  .hashtag-container {
    height: auto;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    color: dimgray;
    line-height: 22px;
    padding: 6px;
    margin-bottom: 20px;
  }

  .dropdown-container {
    position: relative;
    display: inline-block;
  }
  .dropdown-container:hover .dropdown-content {
    display: block;
  }
  .dropdown-container:hover .btn-dropdown {
    background-color: var(--theme);
  }

  .btn-dropdown {
    width: 100px;
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  .btn-dropdown .icon {
    font-size: 20px;
    float: right;
  }

  .dropdown-content {
    width: 100%;
    height: 170px;
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.3);
    z-index: 1;
    overflow: scroll;
  }
  .dropdown-content::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }
  .dropdown-content::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: var(--theme);
  }
  .dropdown-content span {
    display: block;
    text-decoration: none;
    font-size: 15px;
    padding: 12px 16px;
    color: black; /* 다크모드에 영향을 받지 않도록 고유 속성을 강제 */
  }
  .dropdown-content span:hover {
    background-color: #ddd;
  }
</style>
