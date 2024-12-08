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
        default: 'https://firebasestorage.googleapis.com/v0/b/undefined-idealtype-worldcup.firebasestorage.app/o/users%2Fdummy%2Fdummy-menhera-girl.png?alt=media&token=23481b1a-b6e5-45bc-98a8-db39c94b333f',
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
    background-color: transparent;
    border: none;
    border-radius: 50%
  }
  .btn-profile > img {
    position: relative;
    border-radius: 50%;
  }
</style>