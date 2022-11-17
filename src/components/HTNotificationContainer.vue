<template>
  <div class="notification">
    <ht-notification-bar
      v-for="notification in notifications"
      :key="notification.storeItemId"
      :notification="notification"
    >
    </ht-notification-bar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HTNotificationBar from "@/components/HTNotificationBar.vue";
export default {
  name: "HTNotificationContainer",
  components: { HTNotificationBar },
  computed: {
    ...mapState("notification", ["notifications"]),
  },
};
</script>
