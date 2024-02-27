import { onMounted, onUnmounted, watchEffect, ref } from 'vue';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

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

export const useTooltip = function (config = { animation: 'false' }) {
  const tooltipInstance = ref(null);

  const showTooltip = (event, content) => {
    const instance = tippy(event.target);
    instance.setProps(config);
    instance.setContent(content);
    tooltipInstance.value = instance;
  };

  const hideTooltip = () => {
    tooltipInstance.value.destroy();
  };

  return { showTooltip, hideTooltip };
};
