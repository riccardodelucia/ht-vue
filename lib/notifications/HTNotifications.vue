<template>
  <div
    v-for="notification in notifications"
    :key="notification.id"
    class="toast card"
    :class="`toast--${notification.type}`"
  >
    <div class="toast__close" @click="onClick(notification.id)"></div>
    <h4>{{ notification.title }}</h4>
    <p>{{ notification.message }}</p>
  </div>
</template>

<script>
import { useNotifications } from './index.js';
export default {
  name: 'HTNotifications',
  setup() {
    const notifications = useNotifications();

    const onClick = function (id) {
      notifications.value = notifications.value.filter(
        (notification) => notification.id !== id
      );
    };
    return { notifications, onClick };
  },
};
</script>
