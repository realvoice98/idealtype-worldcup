<template>
  <div class="comment-section">
    <div class="comment-input">
      <input v-model="newComment" placeholder="댓글을 입력하세요." />
      <CommonButton
          variant="primary"
          :disabled="!newComment.trim()"
          @click="submitComment"
      >
        댓글 달기
      </CommonButton>
    </div>

    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <div class="profile-box">
          <ProfileButton width="40" height="40" />
          <div class="nickname">{{ comment.nickName }}</div>
          <div class="timestamp">{{ comment.timestamp }}</div>
        </div>
        <div class="text"> {{ comment.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {fetchWldcupComments, createComment, fetchNickname} from '@/services/firebase/db.js';
import { auth, onAuthStateChanged } from '@/services/firebase/auth';
import ProfileButton from "@/components/buttons/ProfileButton.vue";
import CommonButton from "@/components/buttons/CommonButton.vue";

export default {
  components: {
    ProfileButton,
    CommonButton,
  },
  data() {
    return {
      newComment: "",
      comments: [],
      wldcupId: "",
      user: null,
    };
  },
  created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const nickname = await fetchNickname(user.uid);
          this.user = {
            nickname: nickname || '익명',
            uid: user.uid,
          };
        } catch (error) {
          console.error("닉네임을 가져오는 중 오류가 발생했습니다:", error);
        }
      } else {
        this.user = {
          nickname: '익명',
          uid: "anonymous-uid",
        };
      }
    });
  },
  methods: {
    async submitComment() {
      if (this.newComment.trim() === "") return;

      try {
        await createComment(this.user, this.wldcupId, this.newComment);
        this.newComment = "";
        this.fetchComments();
      } catch (e) {
        console.error("댓글 작성 실패:", e);
      }
    },

    async fetchComments() {
      try {
        const comments = await fetchWldcupComments(this.wldcupId);
        console.log(comments)
        this.comments = comments || [];
      } catch (e) {
        console.error("댓글 불러오기 실패:", e);
      }
    },
  },
  async mounted() {
    this.wldcupId = this.$route.params.id;
    this.fetchComments();
  },
};
</script>

<style scoped>
.comment-section {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.comment-input {
  display: flex;
  gap: 10px;
}

.comment-input input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.comments-list {
  margin-top: 20px;
}

.comment {
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.comment p {
  margin: 0;
}

.comment small {
  color: #888;
}

.comment .text {
  color: #888;
  text-align: start;
  padding: 5px;
}

.comment .profile-box{
  display: flex;
  gap: 10px;
  align-items: center;
  .nickname{
    font-size: 15px;
    font-weight: bold;
  }
  .timestamp{
    font-size: 12px;
    font-weight: lighter;
  }
}
</style>
