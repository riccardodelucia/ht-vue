<template>
  <div v-if="uploads.length > 0" class="card uploads">
    <h4>Uploading Files</h4>
    <HTFileUploadController
      v-for="upload in uploads"
      :key="upload.storeItemId"
      :upload="upload"
      @upload:delete="deleteUpload(upload)"
    >
    </HTFileUploadController>
  </div>
</template>

<script>
import { useUploads } from './uploads.js';
import HTFileUploadController from './HTFileUploadController.vue';

export default {
  name: 'HTFileUploads',
  components: { HTFileUploadController },
  setup() {
    const uploads = useUploads();

    const deleteUpload = function (upload) {
      uploads.value = uploads.value.filter((item) => item !== upload);
    };
    return {
      uploads,
      deleteUpload,
    };
  },
};
</script>
