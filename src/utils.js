import { AxiosError } from 'axios';
import lodash from 'lodash-es';
import deepdash from 'deepdash-es';
const _ = deepdash(lodash);

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

export function download(blob, filename) {
  const link = document.createElement('a');

  link.href = window.URL.createObjectURL(blob); // blob must be instance of Blob

  link.setAttribute('download', filename);

  document.body.appendChild(link);

  link.click();

  link.remove();
  URL.revokeObjectURL(link.href);
}

// this method allows to adapt from snake_case backend variable data (e.g. from python backends) to camelCase.
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

// this function is used when we want to extract size info for charts
export const getInnerChartSizes = function (width, height, margin) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return { innerWidth, innerHeight };
};
