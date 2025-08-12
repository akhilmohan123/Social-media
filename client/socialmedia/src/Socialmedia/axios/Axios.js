import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100000 // 10 seconds
});

// Optional: Interceptor to only set JSON header when not sending FormData
apiClient.interceptors.request.use(config => {
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  } else {
    // Let Axios handle multipart headers
    delete config.headers['Content-Type'];
  }
  return config;
});

const _get = (url, config = {}) => {
  return apiClient.get(url, config);
};

const _delete = (url, config = {}) => {
  return apiClient.delete(url, config);
};

const _post = (url, data, config = {}) => {
  return apiClient.post(url, data, config);
};

const _put = (url, data, config = {}) => {
  return apiClient.put(url, data, config);
};

export { _get, _post, _put, _delete, apiClient };
