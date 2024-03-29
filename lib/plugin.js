import _ from 'lodash';

export const HTVue = {
  install(app) {
    const componentFiles = import.meta.glob('./components/*.vue', {
      eager: true,
    });
    const layoutsFiles = import.meta.glob('./layouts/*.vue', { eager: true });

    Object.entries({ ...componentFiles, ...layoutsFiles }).forEach(
      ([path, m]) => {
        const componentName = _.upperFirst(
          _.camelCase(
            path
              .split('/')
              .pop()
              .replace(/\.\w+$/, ''),
          ),
        );

        app.component(`${componentName}`, m.default);
      },
    );

    app.directive('click-outside', {
      beforeMount(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event, el);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      beforeUnmount(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      },
    });
  },
};
