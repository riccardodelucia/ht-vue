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

export default createMachine({
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
