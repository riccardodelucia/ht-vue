<template>
  <div class="notification">
    <ht-notification-bar
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      @notification:delete="deleteNotification"
    >
    </ht-notification-bar>
  </div>
</template>

<script>
import { notifications } from './index.js';
export default {
  name: 'HTNotificationContainer',
  data() {
    return { notifications };
  },
  methods: {
    deleteNotification(id) {
      notifications.value = notifications.value.filter(
        (item) => item.id !== id
      );
    },
  },
};
</script>
