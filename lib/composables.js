import { ref } from 'vue';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

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
