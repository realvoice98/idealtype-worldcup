<template>
  <button
    class="btn-profile"
    type="button"
    :disabled="disabled"
    @click="onClick"
    :style="style"
  >
    <img
      :src="computedSrc"
      :width="width"
      :height="height"
      alt="" />
  </button>
</template>

<script>
  export default {
    name: 'ProfileButton',
    props: {
      src: {
        type: String,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      onClick: {
        type: Function,
        default: () => {},
      },
      style: {
        type: Object,
        default: () => ({}),
      },
      width: {
        type: String,
        default: '40', // 표준: 160, 84, 40, 36
      },
      height: {
        type: String,
        default: '40', // 표준: 160, 84, 40, 36
      },
      default: {
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/undefined-idealtype-worldcup.firebasestorage.app/o/users%2Fdummy%2Fdefault_profile_image.png?alt=media&token=f066a90e-2315-4deb-989d-aeb227628037', // 기본 이미지 URL
      },
    },
    computed: {
      computedSrc() {
        return this.src || this.default;
      },
    },
  };
</script>

<style scoped>
  .btn-profile {
    border-radius: 50%
  }
  .btn-profile > img {
    position: relative;
    border-radius: 50%;
  }
</style>