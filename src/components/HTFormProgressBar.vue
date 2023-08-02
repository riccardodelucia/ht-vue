<template>
  <div class="progress-container">
    <ht-progress :value="progressPercentage" aria-label="Progress Percentage"></ht-progress>
    <ol class="ht-reset progress-steps">
      <li v-for="(step, idx) in steps" :key="idx" :aria-current="idx === currentStepIndex ? 'step' : null">
        <div class="ht-number-indicator" :class="{ 'completed': idx <= currentStepIndex }">
          {{ idx + 1 }}
          <span v-if="idx < currentStepIndex" class="ht-visually-hidden">Completed</span>
          <span v-else-if="idx === currentStepIndex" class="ht-visually-hidden">Current</span>
          <small>{{ step }}</small>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'HTFormProgressBar',
  props: {
    currentStep: {
      type: String,
      required: true,
    },
    steps: {
      type: Array,
      required: true,
      validator(value) {
        return value.length > 1;
      }
    },
  },
  computed: {
    currentStepIndex() {
      return this.steps.indexOf(this.currentStep);
    },
    nSteps() { return this.steps.length },
    progressPercentage() {
      const nIntervals = this.nSteps - 1;

      const stepWidthPercentage = 100 / nIntervals;

      return this.currentStepIndex * stepWidthPercentage;
    }
  },
};
</script>

<style lang="postcss" scoped>
.progress-container {

  padding-bottom: 3rem;

  display: grid;
  grid-template-rows: repeat(2, auto);
  align-items: center;

  progress {
    grid-row: 1 / 2;
    grid-column: 1 / -1;
  }
}

.progress-steps {
  grid-row: 1 / 2;
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ht-number-indicator {
  --background-color: var(--ht-surface-1);
  position: relative;

  &>small {
    position: absolute;
    text-align: center;
    line-height: var(--font-lineheight-0);
    top: calc(100% + .2em);
    color: var(--ht-text-color-1);
    max-width: 200%;
    max-height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.completed {
    --background-color: var(--ht-color-primary);
    --text-color: white;
  }
}
</style>