<template>
  <div class="form-progressbar">
    <HTProgress
      :value="progressPercentage"
      aria-label="Progress Percentage"
    ></HTProgress>
    <ol class="ht-reset">
      <li
        v-for="(step, idx) in steps"
        :key="idx"
        :aria-current="step === currentStep ? 'step' : null"
      >
        <div
          class="ht-number-indicator"
          :data-state="idx <= currentStepIndex ? 'completed' : null"
        >
          {{ idx + 1 }}
          <span v-if="idx < currentStepIndex" class="ht-visually-hidden"
            >Completed</span
          >
          <span v-else-if="idx === currentStepIndex" class="ht-visually-hidden"
            >Current</span
          >
          <small>{{ step }}</small>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup>
import HTProgress from './HTProgress.vue';
import { computed } from 'vue';

const props = defineProps({
  currentStep: {
    type: String,
    required: true,
  },
  steps: {
    type: Array,
    required: true,
    validator(value) {
      return value.length > 1;
    },
  },
});

const nSteps = computed(() => {
  return props.steps.length;
});

const currentStepIndex = computed(() => props.steps.indexOf(props.currentStep));

const progressPercentage = computed(() => {
  const nIntervals = nSteps.value - 1;

  const stepWidthPercentage = 100 / nIntervals;

  return currentStepIndex.value * stepWidthPercentage;
});
</script>

<style scoped>
.form-progressbar {
  padding-bottom: 3rem;

  display: grid;
  grid-template-rows: repeat(2, auto);
  align-items: center;

  progress {
    grid-row: 1 / 2;
    grid-column: 1 / -1;
  }
}

ol {
  grid-row: 1 / 2;
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ht-number-indicator {
  position: relative;

  & > small {
    position: absolute;
    text-align: center;
    line-height: var(--font-lineheight-0);
    top: calc(100% + 0.2em);
    color: var(--ht-text-color-1);
    max-width: 200%;
    max-height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:not([data-state='completed']) {
    background-color: var(--progressbar-background, var(--ht-surface-1));
  }
}
</style>
