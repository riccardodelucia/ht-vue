import _ from 'lodash';
import { loadThemeProperties } from './theme/theme.js';

export const HTVue = {
  install(app) {
    // Load theme variables once when the plugin is installed
    loadThemeProperties();

    // Auto-register all Vue components and layouts in the project
    const componentFiles = import.meta.glob('./components/*.vue', {
      eager: true,
    });
    const layoutsFiles = import.meta.glob('./layouts/*.vue', { eager: true });

    Object.entries({ ...componentFiles, ...layoutsFiles }).forEach(
      ([path, m]) => {
        // Generate camelCase component name from file name
        const componentName = _.upperFirst(
          _.camelCase(
            path
              .split('/')
              .pop()
              .replace(/\.\w+$/, ''),
          ),
        );
        // Register the component globally
        app.component(`${componentName}`, m.default);
      },
    );

    // Register a global v-click-outside directive
    app.directive('click-outside', {
      beforeMount(el, binding) {
        // Add event listener to detect clicks outside the element
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event, el);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      beforeUnmount(el) {
        // Clean up the event listener
        document.body.removeEventListener('click', el.clickOutsideEvent);
      },
    });
  },
};
