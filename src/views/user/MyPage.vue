<template>
  <LoadingSpinner :visible="isLoading" />

  <div class="layout-container">
    <header role="banner">
      <div class="header-container">

        <div class="profile-container">
          <ProfileButton
              :src="user.profileImage"
              width="160"
              height="160"
              @click="changeImage"
          />
          <p class="user-nickname">{{ user.nickname }}
            <span class="icon" style="color: var(--theme)">verified</span>
          </p>
          <p class="user-email">{{ user.email }}</p>
        </div>

        <div class="menu-container">
          <ul class="menu-list">
            <li><router-link to="/my-page/profile">내 프로필</router-link></li>
            <li><router-link to="/my-page/wldcups">내 월드컵</router-link></li>
            <li><router-link to="/my-page/activity">내 활동</router-link></li>
          </ul>
        </div>

        <footer role="contentinfo">
          <a href="javascript:void(0)">저작권</a>
          <a href="javascript:void(0)">고객문의</a>
          <a href="javascript:void(0)">FAQ</a>
        </footer>
      </div>
    </header>

    <div class="content">
      <router-view />
    </div>

  </div>
</template>

<script>
  import { auth, onAuthStateChanged } from '@/services/firebase/auth';
  import {getUser, uploadProfile, updateProfileImage} from '@/services/firebase/db.js';

  import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
  import ProfileButton from '@/components/buttons/ProfileButton.vue';
  import {formatDate} from "@/common";

  export default {
    name: 'MyPage',
    components: {
      LoadingSpinner,
      ProfileButton,
    },
    data() {
      return {
        isLoading: true,
        user: {
          profileImage: '',
          nickname: '',
          email: '',
        },
        errorMessage: '',
      };
    },
    created() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.user = await getUser(user);

          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        } else {
          // TODO: 로그인 분기 처리
        }
      });
    },
    mounted() {
      document.title = '이상형 월드컵 : 마이페이지';
    },
    methods: {
      async changeImage() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/png, image/jpeg';
        fileInput.multiple = false;

        fileInput.addEventListener('change', async (event) => {
          const file = event.target.files[0];

          if (!file) {
            this.errorMessage = '파일을 선택하지 않았습니다.';
            return;
          }

          const allowedExtensions = ['png', 'jpg', 'jpeg'];
          const fileExtension = file.name.split('.').pop().toLowerCase();

          if (!allowedExtensions.includes(fileExtension)) {
            this.errorMessage = '유효하지 않은 파일 형식입니다. PNG 또는 JPG/JPEG 파일만 업로드 가능합니다.';
            return;
          }

          try {
            this.isLoading = true;
            const userId = auth.currentUser.uid;

            const path = await uploadProfile(file, userId);

            await updateProfileImage(userId, path);

            this.user.profileImage = path;
          } catch (error) {
            console.error('이미지 업로드 오류:', error);
            this.errorMessage = '이미지 업로드 중 오류발생';
          } finally {
            this.isLoading = false;
          }
        });

        fileInput.click();
      },
    },
  };
</script>

<style scoped>
  a {
    text-decoration: none;
    color: inherit; /* 부모 요소의 색상 상속 */
  }

  .layout-container {
    display: grid;
    grid-template-columns: 0.5fr 1.2fr 2.5fr 0.5fr; /* 전체 영역 별 비율 */
    gap: 0;
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
  }

  header {
    grid-column: 2 / 3; /* 전체 영역 별 비율 중 가운데 위치 */
    display: flex;
    align-items: flex-start; /* 상단에서부터 콘텐츠 나열 */
    justify-content: center; /* 좌우 중앙 정렬 */
    padding: 20px;
    box-shadow: 5px 0 10px 1px rgba(0, 0, 0, 0.1);
    border-left: 2px solid #f2f2f2;
    margin-right: 20px;
  }

  .header-container {
    position: fixed;
    margin-top: 50px; /* TODO: 섹시하지 못한 위치 이동 */
  }

  .content {
    grid-column: 3 / 4; /* 2 비율 */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .profile-container {
    padding: 20px;
    flex-direction: column;
  }
  .profile-container p {
    font-size: 18px;
    margin: 10px;
  }
  .user-nickname {
    font-size: 20px;
    font-weight: bold;
  }
  .user-email {
    color: dimgray;
  }

  .menu-container {
    padding: 25px;
    margin: 0 10px;
  }
  .menu-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .menu-list li {
    display: flex;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--theme);
    padding-bottom: 7px;
  }

  footer {
    padding-top: 40px;
    display: flex;
    justify-content: center;
    gap: 20px;

    a {
      font-size: 15px;
      color: dimgray;
    }
  }

  @media (max-width: 768px) {
    .layout-container {
      grid-template-columns: 1fr; /* 모바일 크기에서 단일 열 */
      grid-template-rows: auto 1fr; /* 헤더(top), 콘텐츠(bottom) */
    }

    header {
      grid-column: 1 / -1; /* 전체 너비 차지 */
      border-left: none;
      box-shadow: none;
      margin-right: 0;
    }

    .content {
      grid-column: 1 / -1; /* 전체 너비 차지 */
    }
  }
</style>
