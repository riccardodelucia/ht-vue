export * from './composables.js';
export * from './notifications.js';
export * from './uploads.js';
export * from './composables.js';

import _ from 'lodash';

import notifications from './notifications.js';
import uploads from './uploads.js';

export default {
  install(app) {
    const componentFiles = import.meta.globEager('./*.vue');
    Object.entries(componentFiles).forEach(([path, m]) => {
      const componentName = _.upperFirst(
        _.camelCase(
          path
            .split('/')
            .pop()
            .replace(/\.\w+$/, '')
        )
      );

      app.component(`${componentName}`, m.default);
    });

    app.provide('notifications', notifications);
    app.config.globalProperties.$notifications = notifications;

    app.provide('uploads', uploads);
    app.config.globalProperties.$uploads = uploads;

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
