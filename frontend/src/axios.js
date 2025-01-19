import axios from 'axios';
import config from './config.json';

axios.defaults.baseURL = `http://localhost:${config.BACKEND_PORT}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const errorHandler = (error) => {
  if ('response' in error && 'data' in error.response && 'message' in error.response.data) {
    const strippedHTML = error.response.data.message
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace('&#39;', '\'');
    error.response.data.message = strippedHTML;
  }
  return Promise.reject({ ...error });
}

const responseHandler = (response) => {
  return response;
}

axios.interceptors.response.use(responseHandler, errorHandler);
