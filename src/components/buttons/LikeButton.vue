<template>
  <button
    class="btn-like icon"
    type="button"
    :disabled="disabled"
    :style="style"
    @click="toggleState"
  >
    <svg
      class="icon-svg"
      :class="{ active: isActived, tilt: isTilting }"
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 -960 960 960"
      :fill="isActived ? '#EA3323' : '#000000'"
      @animationend="initTilt"
    >
      <path
        :d="isActived
          ? 'm480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z'
          : 'm480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z'"
      />
    </svg>
  </button>
</template>

<script>
import { getLikedWorldcups, toggleLike } from "@/services/firebase/db";

export default {
  name: "LikeButton",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    style: {
      type: Object,
      default: () => ({}),
    },
    user: {
      type: Object,
      default: null,
    },
    wldcupId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isActived: false,
      isTilting: false,
    };
  },
  methods: {
    /**
     * 현재 월드컵에 대한 좋아요 상태 변경
     */
    async toggleState() {
      if (!this.user) {
        alert("로그인 후에 좋아요 버튼을 누를 수 있습니다.");
        return;
      }

      try {
        await toggleLike(this.user, this.wldcupId);
        this.isActived = !this.isActived;
        this.isTilting = true; // 흔들림 애니메이션 트리거
      } catch (e) {
        console.error("좋아요 토글 실패:", e);
      }
    },
    initTilt() {
      this.isTilting = false; // 애니메이션 종료 후 상태 초기화
    },
    /**
     * 좋아요 데이터 로드 및 초기화
     */
    async loadLikes() {
      try {
        if (!this.user) return;

        const likes = await getLikedWorldcups(this.user);
        this.isActived = likes[this.wldcupId] === true;
      } catch (e) {
        console.error("좋아요 데이터 로드 실패:", e);
      }
    },
  },
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser) this.loadLikes();
      },
    },
  },
};
</script>


<style scoped>
  .btn-like {
    background-color: transparent;
    border: none;
  }
  .icon-svg {
    transition: fill 0.3s ease-in-out;
  }
  .icon-svg.active {
    fill: #EA3323;
  }
  .icon-svg:not(.active) {
    fill: #000000;
  }

  /* 흔들림 애니메이션 */
  @keyframes tilt {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-10deg);
    }
    50% {
      transform: rotate(10deg);
    }
    75% {
      transform: rotate(-10deg);
    }
  }
  .icon-svg.tilt {
    animation: tilt 0.5s ease-in-out; /* 흔들림 애니메이션 */
    transform-origin: center bottom; /* 하단 중심을 축으로 회전 */
  }
</style>