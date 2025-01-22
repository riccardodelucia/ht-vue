import { ref, inject } from 'vue';

export function useNotifications() {
  return inject('notifications');
}

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

export function sendSuccessNotification({
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
    timeout,
  );
}

export function sendErrorNotification({
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
    timeout,
  );
}

export function removeNotification(id) {
  notifications.value = notifications.value.filter(
    (notification) => notification.id !== id,
  );
}

let notificationId = 0;
const notificationsTimeout = 5;
const notifications = ref([]);

export const HTNotificationsPlugin = {
  install(app) {
    app.config.globalProperties.$sendSuccessNotification =
      sendSuccessNotification;
    app.config.globalProperties.$sendErrorNotification = sendErrorNotification;
    app.config.globalProperties.$removeNotification = removeNotification;

    app.provide('notifications', notifications);
  },
};
