<template>
  <div class="mypage-container">
    <div class="page-title">
      <strong>내가 좋아요한 월드컵</strong>
    </div>
    <div class="mypage-contents">
      <ul v-if="likedWldcups.length > 0" class="record-list">
        <li
            v-for="(data, index) in likedWldcups"
            :key="index"
            class="record-item"
        >
          <router-link :to="wldcupLink(data)" class="record-link">
            <img :src="data.thumbnails[0].path" alt="썸네일" class="thumbnail"/>
            <div class="record-info">
              <h3 class="title">{{ data.title }}</h3>
              <p class="stats">조회수 {{ data.views }}회 · {{ data.updatedAt }}</p>
            </div>
          </router-link>
        </li>
      </ul>

      <p v-else class="no-records-message">좋아요를 누른 월드컵이 없습니다!</p>
    </div>
  </div>
</template>

<script>
import {auth, onAuthStateChanged} from "@/services/firebase/auth";
import {fetchLikedWldcups} from "@/services/firebase/db";

export default {
  name: "LikedWorldcups",
  data() {
    return {
      user: null,
      likedWldcups: [], // 좋아요한 월드컵 리스트
    };
  },
  created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        await this.fetchLikedWldcups(user.uid);
      }
    });
  },
  methods: {
    async fetchLikedWldcups(uid) {
      try {
        this.likedWldcups = await fetchLikedWldcups(uid);
      } catch (error) {
        console.error("좋아요한 월드컵 데이터를 가져오는 중 오류 발생:", error);
      }
    },
    wldcupLink(data) {
      return `/wldcup/${data.wldcupId}`;
    },
  },
};
</script>

<style scoped>
a {
  color: inherit;
  text-decoration: none;
}

.mypage-container {
  text-align: left;
}

.page-title {
  padding: 10px 0;
  background-color: var(--theme);
  border-radius: 8px 8px 0 0;
  text-align: center;
}

.mypage-contents {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.record-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.record-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
}

.record-link {
  display: flex; /* 썸네일과 텍스트를 가로로 배치 */
  align-items: center;
  text-decoration: none;
  flex: 1; /* 버튼이 텍스트를 밀지 않도록 확장 */
}

.thumbnail {
  width: 10vw;
  height: 5vw;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
}

.record-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 30vw;
}

.title {
  font-size: 0.8vw;
  font-weight: bold;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 50vw;
  max-width: 20em;
}

.stats {
  font-size: 0.7rem;
  color: #888;
  margin-top: 4px;
}


</style>
