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
      <div class="modal-tags" >
        <div class="tag-box" v-for="(item, index) in tags" :key="index">
          #{{item.tag}}
        </div>
      </div>
      <div class="modal-announcement">
        총 {{default_round}}개의 후보 중 무작위 {{select_round}}강으로 토너먼트가 시작됩니다.
      </div>
      <div class="modal-buttons">
        <select v-model="select_round" @change="change" class="button select-button">
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
    //FIXME: 추후 DB 데이터에 맞게 수정하기
    name: 'TournamentModal',
    data() {
      return {
        title: '[고화질,움짤] 한국 여자 아이돌 월드컵 256강',
        description: '가장 매력있는 한국 여자 아이돌을 선택해주세요!!\n' +
            '추천 댓글 많이 달아주세요',
        tags: [
          {tag: 'K-POP'},
          {tag: '블랙핑크'},
          {tag:'에스파'},
          {tag:'뉴진스'},
          {tag:'고화질'},
          {tag:'뭉탱이'},
        ],
        round_list:[
          {round:256},
          {round:128},
          {round:64},
          {round:32},
          {round:16}
        ],
        default_round: null,
        select_round: null,
      };
    },
    mounted() {
      // round_list의 첫 번째 값을 default_round에 설정
      this.default_round = this.round_list[0].round;
      this.select_round = this.default_round;
    },
    methods: {
      change() {
        console.log(this.select_round) // select 값이 변하면 콘솔에 남김
      }
    }
  }
</script>

<style scoped>

  /*
  TODO: 화면 비율에 따라 css 조절이 필요함.
  */

  .modal-wrapper {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal-container {
    display: block;
    padding: 15px 50px;
    margin: 5% auto 0 auto;
    border: 1px solid black;
    background: #FFFFFF;
    width: 60vw;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .modal-header {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
  }

  .modal-title {
    text-align: center;
    font-size: calc(1rem + 1vw);
    margin-bottom: 20px;
  }

  .modal-description {
    text-align: center;
    margin-bottom: 10px;
    font-size: calc(1rem + 0.5vw);
  }

  .modal-tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; /* 태그가 넘치면 다음 줄로 넘어가게 함 */
    gap: 15px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  .tag-box {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    width: 8%;
    font-size: 0.8vw;
    border: 2px solid #000000;
    white-space: nowrap;
    flex-shrink: 0; /* 태그 크기가 줄어들지 않도록 설정 */
  }

  .modal-announcement {
    margin-bottom: 10px;
  }

  .modal-buttons {
    text-align: center;
    padding: 30px;
  }

  .button {
    width: 20%;
    height: 62px;
    margin: 0 30px;
    font-size: 20px;
  }

  .select-button {
    background: #98B7D4;
    border: 1px solid #000000;
  }

  .start-button {
    background: #98B7D4;
    border: 1px solid #000000;
  }

  .back-button {
    background: #D8D8D8;
    border: 1px solid #000000;
  }

</style>

