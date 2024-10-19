<template>
  <div class="modal-wrapper">
    <div class="modal-container">
      <div class="modal-header">
        <img src="@/assets/trophy.png">
      </div>
      <div class="modal-title">
        {{title}}
      </div>
      <div class="modal-description">
        {{description}}
      </div>
      <div class="modal-tag">

      </div>
      <div class="modal-announcement">
        총 {{default_round}}개의 후보 중 무작위 {{select_round}}강으로 토너먼트가 시작됩니다.
      </div>
      <div class="modal-buttons">
        <select v-model="select_round" @change="change" class="select-button">
          <option v-for="(item, index) in round_list" :key="index">{{item.round}}</option>
        </select>
        <button class="button start-button">
          시작하기
        </button>
        <button class="button back-button">
          돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  //FIXME: 추후 DB 데이터에 맞게 round 값 수정하기
  name: "TournamentModal",
  data() {
    return{
      title: "[고화질,움짤] 한국 여자 아이돌 월드컵 256강",
      description: "가장 매력있는 한국 여자 아이돌을 선택해주세요!!\n" +
          "추천 댓글 많이 달아주세요",
      round_list:[
          {round:256},
        {round:128},
        {round:64},
        {round:32},
        {round:16}
      ],
      default_round: null,
      select_round: null,
    }
  },mounted() {
    // round_list의 첫 번째 값을 default_round에 설정
    this.default_round = this.round_list[0].round;
    this.select_round = this.default_round;
  },
  methods: {
    change(){
      console.log(this.select_round) // select 값이 변하면 콘솔에 남김
    }
  }
}
</script>

<style scoped>
.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px 50px;
  gap: 15px;
  border: 1px black solid;
  background: #FFFFFF;
  width: 40%;
  height: 60%; /* 높이 */
  overflow-y: auto;
}

.modal-header {
  flex: 1;
  order: 0;
  align-self: stretch;
}

.modal-title {
  flex: 1;
  order: 1;
  align-self: stretch;
  font-size: calc(1rem + 1vw);
}

.modal-description {
  flex: 1;
  order: 2;
  align-self: stretch;
}

.modal-tag {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px 10px;
  gap: 10px;
  flex: 1;
  order: 3;
  align-self: stretch;
}

.modal-announcement {
  flex: 1;
  order: 4;
  align-self: stretch;
}

.modal-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 10px;
  gap: 30px;
  flex: 1;
  order: 5;
  align-self: stretch;
}

.select-button {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 14px 24px;
  gap: 10px;
  margin: 0 auto;
  width: 220px;
  height: 72px;
  background: #98B7D4;
  border: 1px solid #000000;
}

.start-button {
  box-sizing: border-box;
  margin: 0 auto;
  width: 220px;
  height: 74px;
  background: #98B7D4;
  border: 1px solid #000000;
}

.back-button {
  box-sizing: border-box;
  margin: 0 auto;
  width: 220px;
  height: 74px;
  background: #D8D8D8;
  border: 1px solid #000000;
}
</style>
