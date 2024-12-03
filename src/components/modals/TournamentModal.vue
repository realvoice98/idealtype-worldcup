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
    </div>

    <div v-if="!isProgress" class="modal-container">
      <img src="@/assets/trophy.png" alt="" />
      <h2>{{ title }} 진행 이력이 존재하지 않는 경우</h2>
    </div>
  </div>

<!--  <div class="modal-wrapper">-->
<!--    <div class="modal-container">-->
<!--      <div class="modal-header">-->
<!--        <img src="@/assets/trophy.png" alt="">-->
<!--      </div>-->
<!--      <div class="modal-title">-->
<!--        {{title}}-->
<!--      </div>-->
<!--      <div class="modal-description">-->
<!--        {{description}}-->
<!--      </div>-->
<!--      <div class="modal-tags" >-->
<!--        <div class="tag-box" v-for="(item, index) in tags" :key="index">-->
<!--          #{{item.tag}}-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="modal-announcement">-->
<!--        총 {{default_round}}개의 후보 중 무작위 {{select_round}}강으로 토너먼트가 시작됩니다.-->
<!--      </div>-->
<!--      <div class="modal-buttons">-->
<!--        <select v-model="select_round" @change="change" class="button select-button">-->
<!--          <option v-for="(item, index) in round_list" :key="index">{{item.round}}</option>-->
<!--        </select>-->
<!--        <button class="button start-button">-->
<!--          시작하기-->
<!--        </button>-->
<!--        <button class="button back-button">-->
<!--          돌아가기-->
<!--        </button>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script>
  import { auth } from '@/services/firebase/auth';
  import { checkInProgressWldcup } from '@/services/firebase/db';

  export default {
    name: 'TournamentModal',
    data() {
      return {
        isProgress: false, // 월드컵 진행 이력이 존재하는지
        title: '',
        description: '',
        tags: [],
        rounds: [],
      };
    },
    created() {
      this.checkInProgressWldcup();
    },
    methods: {
      /**
       * 현재 월드컵에 대한 진행 이력이 존재하는지 체크
       */
      async checkInProgressWldcup() {
        const user = auth.currentUser;
        const wldcupId = this.$route.params.id;

        this.isProgress = await checkInProgressWldcup(user, wldcupId);
      },
    },
  }
</script>

<style scoped>

</style>