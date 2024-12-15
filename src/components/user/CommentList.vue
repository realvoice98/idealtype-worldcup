<template>
  <div class="comment-container">
    <div class="page-title">
      <strong>내가 단 댓글</strong>
    </div>
    <div class="comment-contents">
      <div v-if="comments.length > 0" class="comments-list">
        <div
            v-for="(comment) in comments"
            :key="comment.id"
            class="comment"
        >
          <router-link :to="`/wldcup/${comment.wldcupId}/wldcup-result`" class="comment-link">
            <div class="title">{{ comment.title }}</div>
            <div class="profile-box">
              <ProfileButton width="40" height="40" :src="user.profileImage"/>
              <div class="nickname">{{ comment.nickName }}</div>
              <div class="timestamp">{{ comment.timestamp }}</div>
            </div>
            <div class="text">{{ comment.text }}</div>
          </router-link>
          <button class="delete-button" @click="confirmDelete(comment)">
            X
          </button>
        </div>
      </div>
      <p v-else class="no-comments-message">아직 작성한 댓글이 없습니다!</p>
    </div>
  </div>
</template>

<script>
import {auth, onAuthStateChanged} from "@/services/firebase/auth";
import {fetchMyComments, deleteComment} from "@/services/firebase/db";
import ProfileButton from "@/components/buttons/ProfileButton.vue";

export default {
  name: "CommentList",
  components: { ProfileButton },
  data() {
    return {
      user: null,
      comments: [],
    };
  },
  created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        await this.fetchComments(user.uid);
      }
    });
  },
  methods: {
    async fetchComments(uid) {
      try {
        this.comments = await fetchMyComments(uid);
      } catch (error) {
        console.error("댓글 데이터를 가져오는 중 오류 발생:", error);
      }
    },
    confirmDelete(comment) {
      if (confirm("정말 삭제하시겠습니까?")) {
        this.deleteComment(comment);
      }
    },
    async deleteComment(comment) {
      try {
        console.log(this.user)
        console.log(comment.wldcupId)
        console.log(comment)
        await deleteComment(this.user, comment.wldcupId, comment.commentId);
        this.comments = this.comments.filter((item) => item.commentId !== comment.commentId);
      } catch (error) {
        alert("댓글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
        console.error("댓글 삭제 실패:", error);
      }
    },
  },
};
</script>

<style scoped>
.comment-container {
  text-align: left;
}

.page-title {
  padding: 10px 0;
  background-color: var(--theme);
  border-radius: 8px 8px 0 0;
  text-align: center;
}

.comment-contents {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  position: relative;
}

.comment-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.profile-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.nickname {
  font-weight: bold;
  font-size: 1rem;
}

.timestamp {
  font-size: 0.8rem;
  color: #888;
}

.text {
  font-size: 0.9rem;
}

.no-comments-message {
  text-align: center;
  color: #888;
}

.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: red;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
