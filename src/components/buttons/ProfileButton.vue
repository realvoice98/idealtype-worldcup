<template>
  <button
    class="btn-profile"
    type="button"
    :disabled="disabled"
    @click="onClick"
    :style="style"
  >
    <img
      :src="src"
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