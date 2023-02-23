import { ref, inject } from 'vue';

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

export default uploads;
