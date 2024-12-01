<template>
  <button
    type="button"
    :class="`btn-${variant}`"
    :disabled="disabled"
    @click="onClick"
    :style="style"
  >
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'CommonButton',
    props: {
      variant: {
        type: String,
        default: 'primary', // primary, gray, white, transparent
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
      }
    },
  };
</script>

<style scoped>
  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
  }
  .btn-primary {
    background-color: var(--theme);
    color: white;
  }
  .btn-gray {
    background-color: lightgray;
  }
  .btn-white {
    background-color: #f8f8f8;
  }
  .btn-transparent {
    background-color: transparent;
  }
</style>