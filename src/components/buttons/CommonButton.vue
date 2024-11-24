<template>
  <button
    type="button"
    :class="`btn-${variant}`"
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
        default: 'primary', // primary, theme
      },
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
    background-color: transparent;
  }

  .btn-theme {
    background-color: var(--theme);
    color: white;
  }
</style>