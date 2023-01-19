<template>
  <div class="uploads__file upload-controller">
    <div class="upload-controller__file">
      <vue-feather
        v-if="state.matches('uploaded')"
        class="upload-controller__icon upload-controller__icon--uploaded"
        type="check-circle"
        size="20px"
      >
      </vue-feather>
      <span>{{ filename }}</span>
    </div>
    <span
      v-if="state.matches('uploading') || state.matches('uploaded')"
      class="upload-controller__percentage"
      >{{ state.context.percentage }}%</span
    >
    <vue-feather
      v-if="state.matches('uploading')"
      class="upload-controller__icon upload-controller__icon--delete"
      type="trash-2"
      size="20px"
      @click="abort"
    >
    </vue-feather>
    <vue-feather
      v-else
      class="upload-controller__icon upload-controller__icon--remove"
      type="x-circle"
      size="20px"
      @click="remove"
    >
    </vue-feather>
    <div class="upload-controller__status">
      <div
        v-if="state.matches('uploading')"
        class="upload-controller__progress-bar-container"
      >
        <div
          class="upload-controller__progress-bar"
          :style="{ width: state.context.percentage + '%' }"
        ></div>
      </div>
      <div
        v-else-if="state.matches('uploaded')"
        class="upload-controller__uploaded-msg-container"
      >
        <span class="upload-controller__status-message"
          >Uploaded. Click &nbsp;</span
        >
        <vue-feather type="x-circle" size="10px"> </vue-feather>
        <span class="upload-controller__status-message"> &nbsp; to close</span>
      </div>
      <span
        v-else-if="state.matches('aborted') || state.matches('error')"
        class="upload-controller__status-message"
        >{{ state.context.errorMessage }}</span
      >
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue';
import { useMachine } from '@xstate/vue';
import uploadFileMachine from '@/machines/uploadFileMachine.js';
import { removeFileUpload } from './index.js';

export default {
  name: 'HTFileUploadController',
  props: {
    upload: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const upload = toRaw(props.upload); //to remove proxies from reactive props
    const { filename } = upload;
    const { state, send } = useMachine(uploadFileMachine, {
      context: {
        upload,
      },
    });

    const pause = () => send('PAUSE');
    const resume = () => send('RESUME');
    const abort = () => send('ABORT');
    const remove = () => removeFileUpload(upload);

    return {
      state,
      filename,
      pause,
      resume,
      abort,
      remove,
    };
  },
};
</script>
