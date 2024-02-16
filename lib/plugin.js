import _ from 'lodash';

export const HTVue = {
  install(app) {
    const componentFiles = import.meta.globEager('./components/*.vue');
    const layoutsFiles = import.meta.globEager('./layouts/*.vue');

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
