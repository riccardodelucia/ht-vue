import { onMounted, onUnmounted, watchEffect } from 'vue';

export const resizeListener = function (resizeListener) {
  onMounted(() => {
    window.addEventListener('resize', resizeListener);
    window.dispatchEvent(new Event('resize'));
  });
  onUnmounted(() => {
    window.removeEventListener('resize', resizeListener);
  });
};

export const makeReactiveAxis = function (axisSetup) {
  watchEffect(axisSetup, {
    flush: 'post',
  });
};
