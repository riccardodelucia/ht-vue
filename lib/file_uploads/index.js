import { ref, inject } from 'vue';
import HTFileUploads from './HTFileUploads.vue';

const uploads = ref([]);

export function useUploads() {
  return inject('uploads');
}

export function addFileUpload(upload) {
  uploads.value.push(upload);
}

export function removeFileUpload({ filename }) {
  uploads.value = uploads.value.filter(
    (upload) => upload.filename !== filename
  );
}

export default {
  install(app) {
    app.provide('uploads', uploads);
    app.config.globalProperties.$uploads = uploads;

    app.component(HTFileUploads.name, HTFileUploads);
  },
};
