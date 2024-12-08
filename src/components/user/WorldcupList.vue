<template>
  <div class="mypage-container">
    <div class="mypage-contents">
      <ul class="record-list">
        <li
          v-for="(data, index) in wldcups"
          :key="index"
          class="record-item"
        >
          <img :src="data.thumbnails[0].path" alt="썸네일" class="thumbnail" @click="wldcupLink(data.wldcupId)" />
          <div class="record-info">
            <h3 class="title">{{ data.title }}</h3>
            <p class="stats">조회수 {{ data.views }}회 · {{ data.updatedAt }}</p>
          </div>
          <button
            class="more-options"
            @click.stop="toggleMenu(index)"
          >
            <span class="icon">menu</span>
          </button>
          <div
            v-if="activeMenuIndex === index"
            class="dropdown-menu"
          >
            <button @click.stop="editWldcup(data)">편집</button>
            <button @click.stop="deleteWldcup(data)">삭제</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { auth, onAuthStateChanged } from '@/services/firebase/auth';
  import { fetchUserWldcups } from '@/services/firebase/db.js';

  export default {
    name: 'WorldcupList',
    data() {
      return {
        user: null,
        wldcups: [],
        activeMenuIndex: null,
      };
    },
    created() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.user = user;
          await this.fetchUserWldcupsData(user.uid);
        }
      });
    },
    methods: {
      async fetchUserWldcupsData(uid) {
        const wldcups = await fetchUserWldcups(uid);
        if (wldcups.result === -1) {
          console.error(wldcups.message);
          return;
        }
        this.wldcups = wldcups;
      },
      wldcupLink(wldcupId) {
        this.$router.push(`/wldcup/${wldcupId}`);
      },
      toggleMenu(index) {
        this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
      },
      editWldcup(data) {
        console.log('편집 기능 실행:', data);
        //TODO: 편집 로직 추가
      },
      deleteWldcup(data) {
        console.log('삭제 기능 실행:', data);
        //TODO: 삭제 로직 추가
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

  .record-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .record-item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    cursor: pointer;
    position: relative; /* 드롭다운 메뉴의 기준 */
  }

  .thumbnail {
    width: 10vw;
    height: 15vh;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 16px;
  }

  .record-info {
    flex: 1;
  }

  .title {
    font-size: 1vw;
    font-weight: bold;
    margin: 0;
  }

  .stats {
    font-size: 1vw;
    color: #888;
  }

  .more-options {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    position: relative;
  }

  .icon {
    font-size: 1.5vw;
  }

  .dropdown-menu {
    position: absolute;
    top: 60%;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
    display: flex;
    flex-direction: column;
    width: 5vw; /* 드롭다운 메뉴의 너비 */
  }

  .dropdown-menu button {
    padding: 8px 16px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
  }

  .dropdown-menu button:hover {
    background: #f0f0f0;
  }
</style>