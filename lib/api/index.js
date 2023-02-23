import axios from 'axios';
import lodash from 'lodash-es';
import deepdash from 'deepdash-es';
const _ = deepdash(lodash);

export const ConnectionManager = function (baseURL, auth = null) {
  this.requests = new Map();
  this.baseURL = baseURL;
  this.auth = auth;
};

ConnectionManager.prototype.getRequest = function (requestId) {
  let request = this.requests.get(requestId);
  if (request && !request.controller.signal.aborted) return request;
  request = this.createRequest();
  this.requests.set(requestId, request);
  return request;
};

ConnectionManager.prototype.createRequest = function () {
  const controller = new AbortController();
  const baseURL = this.baseURL;

  // cannot setup a timeout on upload , otherwise large file uploads get canceled
  const instance = axios.create({
    signal: controller.signal,
    baseURL,
  });

  this.auth &&
    instance.interceptors.request.use((config) => {
      const redirectUri = window.location.href;
      return this.auth.authorize(redirectUri).then((token) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
    });

  instance.interceptors.response.use(function (response) {
    // if this is a multipart file response, there is nothing to camelize
    if (response.headers['content-type'] === 'application/json') {
      const res = _.mapKeysDeep(response.data, function (value, key) {
        return _.camelCase(key);
      });
      response.data = res;
    }

    return response;
  });

  return {
    controller,
    instance,
  };
};

ConnectionManager.prototype.sendRequest = function (
  config,
  requestId = window.location.pathname
) {
  const request = this.getRequest(requestId);
  const { instance } = request;
  return instance(config);
};

ConnectionManager.prototype.abortAndDeleteRequest = function (requestId) {
  const request = this.requests.get(requestId);
  if (request && !request.controller.aborted) {
    request.controller.abort();
    this.requests.delete(requestId);
  }
};

///////////////////////////////////////////
// STATIC METHODS
ConnectionManager.makeFileUploadConfig = function ({ file, url }) {
  const formData = new FormData();
  formData.append('file', file, file.name);
  const config = {
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Content-Range': `bytes=0-${file.size}/${file.size}`,
    },
  };

  return config;
};
