import _ from 'lodash';
import { ref } from 'vue';

/**
 * Since the notification component is always used as a direct child of App, the provide/ inject pattern doesn0t work.
 * Instead, we export here the notification data and provide methods to manage notifications in vanilla JS.
 * This is useful also for managing notifications outside of Vue components, such as XState machine actions.
 * */
let notificationId = 0;
const notificationsTimeout = 5;
export const notifications = ref([]);

function timedOutNotificationDelete(id, timeout) {
  setTimeout(() => {
    notifications.value = notifications.value.filter((item) => item.id !== id);
  }, timeout);
}

function sendNotification(notification, timeout) {
  notification.id = notificationId++;
  notifications.value.push(notification);
  timeout && timedOutNotificationDelete(notification.id, timeout * 1000);
}

export const sendSuccessNotification = function ({
  title = 'Success!',
  message = 'Successful request',
  timeout = notificationsTimeout,
}) {
  sendNotification(
    {
      type: 'success',
      title,
      message,
    },
    timeout
  );
};

export const sendErrorNotification = function ({
  title = 'Something went wrong... 💥',
  message = 'Unknown error',
  timeout = notificationsTimeout,
}) {
  sendNotification(
    {
      type: 'error',
      title,
      message,
    },
    timeout
  );
};

//////////////////////////////////////////////////////
// UPLOADS CONTROLLER
export const uploads = ref([]);
export const addFileUpload = function (upload) {
  uploads.value.push(upload);
};

export const removeFileUpload = function ({ filename }) {
  uploads.value = uploads.value.filter(
    (upload) => upload.filename !== filename
  );
};

//////////////////////////////////////////////////////
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
