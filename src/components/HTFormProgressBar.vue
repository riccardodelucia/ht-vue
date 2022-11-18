<template>
  <div class="form-progress-container">
    <div class="form-progress">
      <div class="form-progress__bar" :style="{ width: progress }"></div>
      <div
        v-for="(step, index) in steps"
        :key="step"
        class="form-progress__step"
        :class="{ 'form-progress__step--active': index <= currentStepIndex }"
        :data-title="step"
      >
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HTFormProgressBar",
  props: {
    currentStep: {
      type: String,
      required: true,
    },
    steps: {
      type: Array,
      required: true,
    },
  },
  computed: {
    progress() {
      return `${this.computeProgress(this.currentStepIndex)}%`;
    },
    currentStepIndex() {
      return this.steps.indexOf(this.currentStep) || 0;
    },
  },
  methods: {
    computeProgress(index) {
      return (100 / (this.steps.length - 1)) * index;
    },
  },
};
</script>
