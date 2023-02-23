<template>
  <div class="upload-controller">
    <div class="upload-controller__file truncate">
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
      <div v-else-if="state.matches('uploaded')">
        Uploaded. Click
        <vue-feather type="x-circle" size="12px"> </vue-feather>
        to close
      </div>
      <span v-else-if="state.matches('aborted') || state.matches('error')">{{
        state.context.errorMessage
      }}</span>
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue';
import { useMachine } from '@xstate/vue';
import { createMachine, assign } from 'xstate';

////////////////////////////////////////////////////////////////
// SERVICES
const uploadFile =
  ({ upload }) =>
  (callback) => {
    const progressCallback = (progress) =>
      callback({
        type: 'PROGRESS',
        progress,
      });

    const uploadedCallback = () =>
      callback({
        type: 'UPLOADED',
      });

    const errorCallback = (error) =>
      callback({
        type: 'ERROR',
        payload: { error },
      });

    const { request, config } = upload;

    request
      .instance({
        ...config,
        onUploadProgress: progressCallback,
      })
      .then(uploadedCallback)
      .catch(errorCallback);

    return () => {};
  };

////////////////////////////////////////////////////////////////
// ACTIONS
const assignProgress = assign(
  (
    {
      upload: {
        file: { size },
      },
    },
    { progress }
  ) => {
    const totalFileBytesUploaded = progress.loaded;
    const percentage = Math.min(
      Math.round((totalFileBytesUploaded * 100) / size),
      99
    );
    return {
      totalFileBytesUploaded,
      percentage,
    };
  }
);

const assignProgress100 = assign({
  percentage: () => 100,
});

const assignErrorMessage = assign({
  errorMessage: (context, event) =>
    event.payload.error?.message || 'Upload error',
});

const assignAbortMessage = assign({
  errorMessage: () => 'canceled',
});

const abortUpload = ({ upload: { request } }) => {
  request.controller.abort();
};

////////////////////////////////////////////////////////////////
// GUARDS
/* const warnAbort = () =>
  window.confirm(
    "This action will permanently delete the file upload. Your job will not be able to be computed. Are you sure?"
  ); */

const uploadFileMachine = createMachine({
  predictableActionArguments: true,
  context: {
    upload: {},
    totalFileBytesUploaded: 0,
    percentage: 0,
    errorMessage: '', //filled only if an error occurs during the upload
  },
  initial: 'uploading',
  states: {
    uploading: {
      invoke: {
        id: 'uploadFile',
        src: 'uploadFile',
      },
      on: {
        PROGRESS: { actions: ['assignProgress'] },
        ABORT: {
          target: 'aborted',
          //cond: "warnAbort",
          actions: ['abortUpload'],
        },
        ERROR: {
          target: 'error',
        },
        UPLOADED: {
          target: 'uploaded',
        },
      },
    },
    uploaded: { type: 'final', entry: ['assignProgress100'] },
    aborted: {
      type: 'final',
      entry: ['assignAbortMessage'],
    },
    error: {
      type: 'final',
      entry: ['assignErrorMessage'],
    },
    idle: {
      on: {
        RESUME: {
          target: 'uploading',
        },
      },
    },
  },
}).withConfig({
  services: {
    uploadFile,
  },
  actions: {
    assignProgress,
    assignProgress100,
    assignErrorMessage,
    assignAbortMessage,
    abortUpload,
  },
});

/**
 * NOTE: Since XState authors didn't think to the possibility of having more thant one machine in one page (-.-') (onMounted and onBeforeMount called by te useMachine method)
 * we cannot condense both the file uploads container component and upload controller into one single component
 * like for the case of notifications
 */
export default {
  name: 'HTFileUploadController',
  props: {
    upload: {
      type: Object,
      required: true,
    },
  },
  emits: ['upload:delete'],
  setup(props, { emit }) {
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
    const remove = () => emit('upload:delete', upload); //removeFileUpload(upload);

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
