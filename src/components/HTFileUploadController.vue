<template>
  <div class="upload ht-card ht-container">
    <span class="upload__filename">
      {{ filename }}
    </span>
    <span
      v-if="state.matches('uploading') || state.matches('uploaded')"
      class="upload__percentage"
      >{{ state.context.percentage }}%</span
    >
    <HTButtonIcon
      v-if="state.matches('uploading')"
      type="button"
      icon-type="trash-2"
      width="20px"
      @click="abort"
    >
    </HTButtonIcon>
    <HTButtonIcon
      v-else
      type="button"
      icon-type="x-circle"
      width="20px"
      @click="remove"
    >
    </HTButtonIcon>
    <div class="upload__progress">
      <HTProgress
        v-if="state.matches('uploading')"
        :value="state.context.percentage"
      ></HTProgress>
      <small v-else-if="state.matches('uploaded')" class="green">
        Uploaded
      </small>
      <small
        v-else-if="state.matches('aborted') || state.matches('error')"
        class="red"
      >
        {{ state.context.errorMessage }}
      </small>
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue';
import { useMachine } from '@xstate/vue';
import { createMachine, assign } from 'xstate';
import HTButtonIcon from '@/components/HTButtonIcon.vue';
import HTProgress from '@/components/HTProgress.vue';

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

    const { instance, config } = upload;

    instance.interceptors.request.use((config) => {
      config.onUploadProgress = progressCallback;
      return config;
    });
    instance(config)
      .then(uploadedCallback)
      .catch((error) => {
        errorCallback(error);
      });

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
    { progress },
  ) => {
    const totalFileBytesUploaded = progress.loaded;
    const percentage = Math.min(
      Math.round((totalFileBytesUploaded * 100) / size),
      99,
    );
    return {
      totalFileBytesUploaded,
      percentage,
    };
  },
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

const abortUpload = ({ upload: { controller } }) => {
  controller.abort();
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

export default {
  name: 'HTFileUploadController',
  components: { HTButtonIcon, HTProgress },
  props: {
    upload: {
      type: Object,
      required: true,
    },
  },
  emits: ['remove-upload'],
  setup(props, { emit }) {
    const upload = toRaw(props.upload); //to remove proxies from reactive props
    const { filename } = upload;
    const { state, send } = useMachine(uploadFileMachine, {
      context: {
        upload,
      },
    });

    const abort = () => send('ABORT');
    const remove = () => {
      emit('remove-upload', upload);
    };

    return {
      state,
      filename,
      abort,
      remove,
    };
  },
};
</script>

<style lang="postcss" scoped>
.upload {
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 1fr) repeat(2, max-content);

  grid-template-areas:
    'filename percentage button'
    'progress progress progress';

  grid-column-gap: var(--size-2);

  background-color: var(--upload-background-color, var(--ht-surface-1));

  &__filename {
    grid-area: filename;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__percentage {
    grid-area: percentage;
  }

  button {
    grid-area: button;
    color: var(--ht-color-red);
  }

  &__progress {
    grid-area: progress;

    small {
      font-size: var(--font-size-0);
      line-height: var(--font-lineheight-1);
    }

    .green {
      color: var(--ht-color-green);
    }

    .red {
      color: var(--ht-color-red);
    }
  }
}
</style>
