<template>
  <div
    v-for="notification in notifications"
    :key="notification.id"
    class="toast card"
    :class="`toast--${notification.type}`"
  >
    <div class="toast__close" @click="onClick(notification)"></div>
    <h4>{{ notification.title }}</h4>
    <p>{{ notification.message }}</p>
  </div>
</template>

<script>
export default {
  name: 'HTNotifications',
  props: { notifications: { type: Array, default: () => [] } },
  emits: ['remove-notification'],
  setup(_, { emit }) {
    function onClick(notification) {
      emit('remove-notification', notification);
    }
    return { onClick };
  },
};
</script>
