<template>
  <LoadingSpinner :visible="isLoading" />
  <div class="mypage-container">
    <div class="page-title">
      <strong>내가 만든 월드컵</strong>
    </div>
    <div class="mypage-contents">
      <ul v-if="wldcups.length > 0" class="record-list">
        <li
          v-for="(data, index) in wldcups"
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
          <ImageRegistModal
            :is-visible="isRegistModalVisible"
            :wldcup-id="data.wldcupId"
            :title="data.title"
            :creator-id="data.creatorId"
            :existing-images="existingImages"
            @update:isVisible="isRegistModalVisible = $event"
          />
          <CommonModal2
            v-if="isConfirmModalVisible"
            :visible="isConfirmModalVisible"
            content="정말 삭제하시겠습니까?"
            :buttons="confirmButtons"
            @update:visible="isConfirmModalVisible = $event"
          />
          <button
            class="more-options"
            @click.stop="toggleMenu(index)"
          >
            <span class="icon">menu</span>
          </button>
          <div
            v-if="activeMenuIndex === index && !isRegistModalVisible && !isConfirmModalVisible"
            class="dropdown-menu"
          >
            <button @click.stop="editWldcup(data)">편집</button>
            <button @click.stop="openModal(data)">삭제</button>
          </div>
        </li>
      </ul>

      <p v-else class="no-records-message">나만의 월드컵을 만들어보세요!</p>
    </div>
  </div>
</template>

<script>
  import { auth, onAuthStateChanged } from '@/services/firebase/auth';
  import {fetchUserWldcups, deleteWldcup, deleteImages, fetchWldcup} from '@/services/firebase/db.js';
  import CommonModal2 from "@/components/modals/CommonModal2.vue";
  import ImageRegistModal from "@/components/modals/worldcup/ImageRegistModal.vue";
  import LoadingSpinner from "@/components/common/LoadingSpinner.vue";

  function extractFileNameFromUrl(url) {
    const urlParts = url.split('/');
    const fileWithExtension = urlParts[urlParts.length - 1];
    const fileName = fileWithExtension.split('?')[0];
    return decodeURIComponent(fileName);
  }

  export default {
    name: 'WorldcupList',
    components: {LoadingSpinner, ImageRegistModal, CommonModal2},
    data() {
      return {
        user: null,
        wldcups: [],
        activeMenuIndex: null,
        isConfirmModalVisible: false,
        isRegistModalVisible: false,
        existingImages: [],
        newImages:[],
        deletedImages: [],
        wldcupId: null,
        wldcupTitle: null,
        isLoading: false,
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
    computed:{
      confirmButtons() {
        return [
          {
            text: "삭제",
            callback: this.deleteWldcup,
          },
          {
            text: "취소",
            callback: this.closeModal,
          },
        ];
      },
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
      wldcupLink(data) {
        return `/wldcup/${data.wldcupId}`;
      },
      toggleMenu(index) {
        this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
      },

      async editWldcup(data) {
        if (this.isRegistModalVisible) return;

        this.isRegistModalVisible = true;
        this.isLoading = true; // 데이터 로딩 시작

        console.log('편집 기능 실행:', data.wldcupId, data.title, data.creatorId);

        try {
          const wldcupData = await fetchWldcup(data.wldcupId);

          if (wldcupData && wldcupData.images) {
            console.log('가져온 이미지 데이터:', wldcupData.images);

            const filePromises = wldcupData.images.map(async (image) => {
              const response = await fetch(image.path);
              const blob = await response.blob();
              const url = extractFileNameFromUrl(image.path);
              const fileName = url.substring(url.lastIndexOf('/') + 1);
              const customName = image.customName;
              const file = new File([blob], fileName, { type: blob.type });
              console.log(fileName);

              return {
                customName,
                fileName,
                path: image.path,
                file,
              };
            });

            this.existingImages = await Promise.all(filePromises);
          } else {
            console.log('이미지 데이터가 없습니다.');
          }
        } catch (error) {
          console.error('월드컵 데이터를 가져오는 중 오류 발생:', error);
        } finally {
          this.isLoading = false; // 데이터 로딩 끝
        }
      },

      async deleteWldcup() {
        try {
          await deleteWldcup(this.user.uid, this.wldcupId);
          console.log('월드컵 삭제 완료');

          await deleteImages(this.user.uid, this.wldcupTitle);
          console.log('이미지 삭제 완료');

          this.wldcups = this.wldcups.filter(wldcup => wldcup.wldcupId !== this.wldcupId);

          this.isConfirmModalVisible = false;

        } catch (error) {
          console.error('오류: 월드컵 삭제 중 문제 발생', error);
        }
      },
      openModal(data) {
        this.wldcupId = data.wldcupId;
        this.wldcupTitle = data.title;
        this.isConfirmModalVisible = true;
      },
      closeModal() {
        this.isConfirmModalVisible = false;
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

.more-options {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: absolute;
  top: 35%;
  right: 10px;
  transform: translateY(-50%);
  height: 10vh;
  width: 5vw;
}

.icon {
  font-size: 1.5rem;
}

.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 8vw;
}

.dropdown-menu button {
  padding: 8px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
}

.dropdown-menu button:hover {
  background: #f0f0f0;
}
</style>