<template>
  <div class="activity-container">
    <span class="icon" style="font-size: 40px; color: black;">crown</span>

    <like-worldcup-list class="activity-section" />
    <comment-list class="activity-section" />
  </div>
</template>

<script>
import LikeWorldcupList from './LikeWorldcupList.vue';
import CommentList from './CommentList.vue';

export default {
  name: 'Activity', // 마이페이지 > 내 활동 (댓글 확인, 최근에 진행하던 월드컵 확인 등)
  components: {
    LikeWorldcupList,
    CommentList,
  },
};
</script>

<style scoped>
.activity-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.activity-section {
  margin-top: 2rem;
  width: 100%;
}

</style>
