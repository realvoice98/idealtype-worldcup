<template>
  <!-- define classes
    .modal-wrap
    .modal-container
    .modal-overlay
    .modal-content
    .modal-buttons
    .modal-buttons button
  -->
  <div class="modal-wrap">
    <div v-if="isProgress" class="modal-container">
      <img src="@/assets/trophy.png" alt="" />
      <h2>{{ title }} 진행 이력이 존재하는 경우</h2>
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

    <div v-if="!isProgress" class="modal-container">
      <img src="@/assets/trophy.png" alt="" />
      <h2>{{ title }} 진행 이력이 존재하지 않는 경우</h2>
      <div class="modal-description">{{ description }}</div>
      <div class="hashtag-container">
        <span v-for="(hashtag, index) in hashtags" :key="index">{{ hashtag }}</span>
      </div>
      <em>총 {{ totalItemCnt }}명의 후보 중 무작위 {{ selectItemCnt }}명으로 토너먼트가 진행됩니다.</em>
      <div class="modal-buttons">
        <!-- TODO: 버튼 부착 -->
      </div>
    </div>
  </div>
</template>

<script>
  import { auth } from '@/services/firebase/auth';
  import { checkInProgressWldcup } from '@/services/firebase/db';
  
  import CommonButton from '@/components/buttons/CommonButton.vue';
  
  export default {
    name: 'TournamentModal',
    components: {
      CommonButton
    },
    data() {
      return {
        isProgress: false, // 월드컵 진행 이력이 존재하는지
        title: '',
        description: '',
        hashtags: [],
        totalItemCnt: 0,
        selectItemCnt: 0,
        rounds: [],
      };
    },
    created() {
      this.checkInProgressWldcup();
    },
    methods: {
      test1() {
        console.log(1)
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
  
        this.isProgress = await checkInProgressWldcup(user, wldcupId);
      },
    },
  }
</script>

<style scoped>
  .modal-description {
  
  }
  
  .hashtag-container {
  
  }
</style>
