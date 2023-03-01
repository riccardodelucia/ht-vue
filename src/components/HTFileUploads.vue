<template>
  <div v-if="uploads.length > 0" class="card uploads">
    <h4>Uploading Files</h4>
    <HTFileUploadController
      v-for="upload in uploads"
      :key="upload.id"
      :upload="upload"
      v-bind="$attrs"
    >
    </HTFileUploadController>
  </div>
</template>

<script>
import HTFileUploadController from './HTFileUploadController.vue';

export default {
  name: 'HTFileUploads',
  components: { HTFileUploadController },
  inheritAttrs: false,
  props: {
    uploads: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
