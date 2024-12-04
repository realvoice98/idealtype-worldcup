<template>
  <div class="mypage-container">
    <div class="mypage-contents">
      <div
          v-for="(record, recordIndex) in chunkedWldcups"
          :key="recordIndex"
          class="card-record"
      >
        <WorldcupCard
            v-for="(card, cardIndex) in record"
            :key="cardIndex"
            :data="card"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { auth, onAuthStateChanged } from '@/services/firebase/auth';
import WorldcupCard from '@/components/WorldcupCard.vue';
import { fetchUserWldcups } from '@/services/firebase/db.js';

export default {
  name: 'MyPage',
  components: {
    WorldcupCard,
  },
  data() {
    return {
      user: null,
      wldcups: [],
      windowWidth: window.innerWidth,
    };
  },
  created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        await this.fetchUserWldcupsData(user.uid);
      }
      // else {
      //   // TODO: 커스텀 모달로 수정 적용
      //   if (confirm('로그인 상태에서만 가능합니다. 로그인하러 가시겠어요?')) {
      //     this.$router.push('/sign-in');
      //   } else {
      //     this.$router.push('/');
      //   }
      // }
    });

    // 화면 크기 변경 이벤트 리스너 추가
    window.addEventListener('resize', this.updateWindowWidth);
  },
  beforeUnmount() {
    // 화면 크기 변경 이벤트 리스너 제거
    window.removeEventListener('resize', this.updateWindowWidth);
  },
  methods: {
    async fetchUserWldcupsData(uid) {
      // 사용자 월드컵 데이터를 가져옴
      const wldcups = await fetchUserWldcups(uid);
      if (wldcups.result === -1) {
        console.error(wldcups.message); // 오류 처리
        return;
      }
      this.wldcups = wldcups; // 월드컵 데이터를 받아옴
      console.log(this.wldcups);
    },
    updateWindowWidth() {
      // 화면 크기 갱신
      this.windowWidth = window.innerWidth;
    },
  },
  computed: {
    chunkSize() {
      // 화면 크기에 따라 동적으로 청크 사이즈 계산
      const width = this.windowWidth;
      if (width >= 2560) {
        return 6;
      } else if (width >= 1440) {
        return 3;
      } else if (width >= 1024) {
        return 2;
      } else {
        return 1; // 작은 화면에서는 1개씩 보여주기
      }
    },
    chunkedWldcups() {
      // 월드컵 데이터를 chunkSize에 맞게 나누어줌
      const result = [];
      for (let i = 0; i < this.wldcups.length; i += this.chunkSize) {
        result.push(this.wldcups.slice(i, i + this.chunkSize));
      }
      return result;
    },
  },
};
</script>


<style scoped>
.mypage-container {
  text-align: left;
}

.mypage-contents {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card-record {
  display: flex;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
  /* margin-bottom: 1rem;  */
  width: 100%;
  justify-content: start;
}

</style>