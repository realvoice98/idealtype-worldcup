<template>
  <div class="profile-detail">

    <div class="profile-container">
      <div class="profile-title">
        <strong>내 프로필 정보</strong>
      </div>
      <div class="profile-content">
        <div class="content-item">
          <div class="label-wrap">
            <span class="icon">abc</span>
            <span class="label">닉네임</span>
          </div>
          <div class="value-wrap">
            <p>{{ user.nickname }}</p>
            <button class="btn-edit">
              <span class="icon">edit</span>
            </button>
          </div>
        </div>
        <div class="content-item">
          <div class="label-wrap">
            <span class="icon">email</span>
            <span class="label">이메일</span>
          </div>
          <p>{{ user.email }}</p>
        </div>
        <div class="content-item">
          <div class="label-wrap">
            <span class="icon">male</span>
            <span class="label">성별</span>
          </div>
          <div class="value-wrap">
            <p>{{ formattedGender }}</p>
            <button class="btn-edit">
              <span class="icon">edit</span>
            </button>
          </div>
        </div>
        <div class="content-item">
          <div class="label-wrap">
            <span class="icon">cake</span>
            <span class="label">생년월일</span>
          </div>
          <div class="value-wrap">
            <p>{{ user.birthday }}</p>
            <button class="btn-edit">
              <span class="icon">edit</span>
            </button>
            <span class="until-bday">{{ daysUntilBirthday }}</span>
          </div>
        </div>
        <div class="content-item">
          <div class="label-wrap">
            <span class="icon">person_add</span>
            <span class="label">가입일자</span>
          </div>
          <p>{{ user.createdAt }}</p>
        </div>
        <div class="content-item">
          <div class="label-wrap">
            <span class="icon">update</span>
            <span class="label">마지막 로그인 시간</span>
          </div>
          <p>{{ user.lastLoginedAt }}</p>
        </div>
      </div>
    </div>

    <div class="profile-container">
      <div class="profile-title">
        <strong>레벨 EXP</strong>
      </div>
      <div class="profile-content">
        <div class="content-item">
          <div class="label-wrap">
            <span class="icon">shield</span>
            <span class="label">{{ user.level }}레벨</span>
          </div>
          <div class="exp-container">
            <div class="exp-bar">
              <div class="exp-progress" :style="{ width: progressWidth + '%' }"></div>
            </div>
            <span class="exp-value">{{ user.exp }} / 100</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { auth, onAuthStateChanged } from "@/services/firebase/auth";
  import { getUser } from "@/services/firebase/db";

  import CommonButton from "@/components/buttons/CommonButton.vue";

  export default {
    name: 'ProfileDetail',
    components: {
      CommonButton,
    },
    data() {
      return {
        user: {
          nickname: '',
          email: '',
          emailVerified: '',
          gender: '',
          birthday: '',
          createdAt: '',
          lastLoginedAt: '',
          level: 1,
          exp: 0,
        },
        progressWidth: 0,
      };
    },
    created() {
      // TODO: 구현이 시급하여 props 전달 받지 않고 API 또 쏨,
      //  추후 router로 데이터 전달받을 수 있도록 수정
      //   ㄴ 개인정보를 url param에 담는 건 너무 상남자 코딩 같은데, sessionStorage 같은 공간에 담는 방향으로 진행
      onAuthStateChanged(auth, async (user) => {
        if (user) this.user = await getUser(user);
      });
      // TODO END
    },
    computed: {
      formattedGender() {
        return this.user.gender === 'M' ? '남자' : this.user.gender === 'F' ? '여자' : '알 수 없음';
      },
      daysUntilBirthday() {
        if (!this.user.birthday) return;

        const today = new Date();
        const [year, month, day] = this.user.birthday.split('-').map(Number);

        // 올해의 생일 날짜
        let birthdayThisYear = new Date(today.getFullYear(), month - 1, day);

        // 오늘보다 이전인 경우, 내년의 생일로 계산
        if (today > birthdayThisYear) {
          birthdayThisYear = new Date(today.getFullYear() + 1, month - 1, day);
        }

        // 남은 날짜
        const differenceInTime = birthdayThisYear - today;
        const daysLeft = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

        return `생일까지 앞으로 ${daysLeft}일 남으셨네요!`;
      },
      progressWidth() {
        return this.user.exp; // NOTE: 흠...
      }
    },
    mounted() {
      setTimeout(() => {
        this.progressWidth = this.user.exp;
      }, 100);
    },
    methods: {
    },
  };
</script>

<style scoped>
  .profile-detail {
    width: 90%;
  }

  .profile-container {
    border: 1px solid var(--theme);
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .profile-title {
    padding: 10px 0;
    background-color: var(--theme);
    border-radius: 8px 8px 0 0;
  }

  .content-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 1.5rem;
    border-bottom: 1px solid lightgray;
  }
  .content-item:last-child {
    border-bottom: none;
  }
  .content-item p {
    text-align: left;
    padding: 0;
    margin: 0 0.7rem 0 0;
  }

  .label-wrap {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
  }
  .icon {
    font-size: 1.3rem;
    color: dimgray;
  }
  .label {
    margin-left: 0.5rem;
    color: dimgray;
  }

  .value-wrap {
    display: flex;
    flex-direction: row;
  }

  .until-bday {
    color: var(--theme);
    margin-left: 1.5rem;
    font-size: 0.85rem;
    font-weight: bold;
  }

  .exp-container {
    width: 100%;
    padding: 0 10px;
    margin-top: 10px;
  }
  .exp-bar {
    width: 100%;
    height: 20px;
    background-color: lightgray;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
  }
  .exp-progress {
    height: 100%;
    background-color: var(--theme);
    transition: width 2s ease-in-out; /* TODO: 왜 애니메이션이 안 되는 것이지.... FUCK */
    border-radius: 10px;
  }
  .exp-value {
    margin-top: 50px;
    color: dimgray;
  }
</style>
