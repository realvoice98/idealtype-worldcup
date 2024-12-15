<template>
  <button
      v-if="user"
      class="btn-report icon"
      type="button"
      :disabled="disabled"
      :style="style"
      @click="report"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 -960 960 960"
      fill="#000000"
    >
      <path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z"/>
    </svg>
  </button>
</template>

<script>
export default {
  name: "ReportButton",
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
  methods: {
    report() {
      this.$emit('open-modal');
    },
  },
};
</script>