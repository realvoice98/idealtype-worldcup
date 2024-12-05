<template>
  <div class="modal-wrap">
    <div v-if="isProgress" class="modal-container" style="padding: 40px">
      <img src="@/assets/trophy.png" alt="" />
      <h2>{{ title }}</h2>
      <div style="margin-bottom: 30px">
        <p>이 월드컵에 대한 진행 이력이 있어요!</p>
        <p><strong>이어서 진행</strong>하시겠어요?</p>
      </div>
      <div class="modal-buttons">
        <CommonButton variant="primary" :onclick="test1">불러오기</CommonButton>
        <CommonButton variant="white" :onclick="test2">새로하기</CommonButton>
        <CommonButton variant="white" :onclick="test3">뒤로가기</CommonButton>
      </div>
    </div>

    <div v-if="!isProgress" class="modal-container" style="padding: 40px">
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
            <span v-for="(tournament, index) in tournaments" :key="index" @click="selectTournamentCnt">
              {{ tournament }}강
            </span>
          </div>
        </div>
        <CommonButton variant="primary" :onclick="test1">시작하기</CommonButton>
        <CommonButton variant="white" :onclick="test1">돌아가기</CommonButton>
      </div>
    </div>
  </div>
</template>

<script>
  import { auth } from '@/services/firebase/auth';
  import { checkInProgressWldcup, increaseInViews, fetchWldcup } from '@/services/firebase/db';
  
  import CommonButton from '@/components/buttons/CommonButton.vue';
  
  export default {
    name: 'TournamentModal',
    components: {
      CommonButton
    },
    data() {
      return {
        isProgress: false, // 월드컵 진행 이력이 존재하는지
        title: '천하제일 신창섭 AI 정상화 월드컵 (어디까지 늘어나는지 테스트)', // TODO: 테스트용 더미값 제거
        description: '젠장 에이스 이 공격은 대체 뭐냐!! --- 줄바꿈 테스트 줄바꿈 테스트 줄바꿈 테스트 줄바꿈 테스트 줄바꿈 테스트 줄바꿈 테스트 ',
        hashtags: ['#어디까지늘어날수', '#있는지테스트', '#한번해봐야합니다', '#이제여기서개행이되야함', '#오', '#개행도잘된다', '#된다된다잘된다', '#더잘된다잘된다'],
        totalItemCnt: 512, // 전체 후보 수
        enterItemCnt: 256, // 출진 후보 수 (tournaments * 2)
        tournaments: [256, 128, 64, 32, 16, 8, 4], // n강
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
        const user = auth.currentUser;
        const wldcupId = this.$route.params.id;

        await increaseInViews(user, wldcupId);
      },
      async fetchWldcup() {
        const wldcupId = this.$route.params.id;

        const wldcup = await fetchWldcup(wldcupId);
        // TODO: wldcup 객체를 각 data() 필드들에 바인딩
      },
      test2() {
        console.log(2)
      },
      test3() {
        console.log(3)
      },
      /**
       * 현재 월드컵에 대한 진행 이력이 존재하는지 체크
       */
      async checkInProgressWldcup() {
        // 현재 사용자 세션 존재 유무 확인
        const user = auth.currentUser;
        if (user === null) {
          // 세션이 존재하지 않으면 무조건 진행 이력 없는 것으로 취급
          this.isProgress = false;
          return;
        }
  
        const wldcupId = this.$route.params.id;

        // TODO: 네트워킹 딜레이가 있어, inProgress가 false 상태일 때 노출되는 모달이 먼저 보였다가 사라지는 현상이 있음.
        //  Promise resolve 되기 전에는 로딩중 화면으로 대체
        this.isProgress = await checkInProgressWldcup(user, wldcupId); // FIXME: 어째서 네트워크 경유하는데 return이 non-promise type인 것이지
      },
      selectTournamentCnt(e) {
        const selectItem = document.querySelector('.btn-dropdown');
        selectItem.style.borderWidth = '2px';
        selectItem.style.backgroundColor = 'white';
        selectItem.style.borderColor = '#98B7D4';
        selectItem.innerText = e.target.innerText; // TODO: <span class="icon"> 을 childNode로 append 해주어야 함
      },
    },
  };
</script>

<style scoped>
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
  }
  .dropdown-content span:hover {
    background-color: #ddd;
  }
</style>
