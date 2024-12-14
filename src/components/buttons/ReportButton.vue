<template>
  <button
      v-if="user"
      class="btn-report icon"
      type="button"
      :disabled="disabled"
      :style="style"
      @click="report"
  >
    <img
        :src="require('@/assets/report-icon.png')"
        alt="Report Icon"
        @animationend="initTilt"
        width="24px"
        height="24px"
    />
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