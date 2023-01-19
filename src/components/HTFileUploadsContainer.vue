<template>
  <div v-if="uploads.length > 0" class="uploads card">
    <h3 class="u-margin-bottom-small">Uploading Files</h3>
    <div class="uploads__controllers-container">
      <ht-file-upload-controller
        v-for="upload in uploads"
        :key="upload.storeItemId"
        :upload="upload"
      >
      </ht-file-upload-controller>
    </div>
  </div>
</template>

<script>
import { uploads } from './index.js';

export default {
  name: 'HTFileUploadsContainer',
  data() {
    return { uploads };
  },
};
</script>
