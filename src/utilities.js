import lodash from 'lodash-es';
import deepdash from 'deepdash-es';
import { AxiosError } from 'axios';
const _ = deepdash(lodash);

export const getInnerChartSizes = function (width, height, margin) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return { innerWidth, innerHeight };
};

export const augmentedExtent = (data, augmentation = 0.05) => {
  const scaleMin = Math.min(...data);
  const scaleMax = Math.max(...data);

  const standardExtent = Math.abs(scaleMax - scaleMin);
  return [
    scaleMin - standardExtent * augmentation,
    scaleMax + standardExtent * augmentation,
  ];
};

export function getEnv(name) {
  return window?.configs?.[name] || import.meta.env[name];
}

export function download(data, filename) {
  const link = document.createElement('a');

  link.href = window.URL.createObjectURL(data); // data must be instaceof Blob

  link.setAttribute('download', filename);

  document.body.appendChild(link);

  link.click();

  link.remove();
  URL.revokeObjectURL(link.href);
}

export function date(dateTime) {
  const date = new Date(Date.parse(dateTime));
  return date.toLocaleString();
}

///////////////////////////////////////
// API utilities
export function interceptorCamelize(response) {
  // if this is a multipart file response, there is nothing to camelize
  if (response.headers['content-type'] === 'application/json') {
    const res = _.mapKeysDeep(response.data, function (__, key) {
      return _.camelCase(key);
    });
    response.data = res;
  }

  return response;
}

///////////////////////////////////////

// Manage async API calls errors
export function parseErrorMesssage(error) {
  let message = '';
  if (error instanceof AxiosError) {
    message = error?.response
      ? error.response?.data?.detail
        ? error.response.data.detail
        : 'Unknown API response error data'
      : error.message
      ? error.message
      : error;
  } else {
    message = error.message ? error.message : error;
  }
  return message;
}
