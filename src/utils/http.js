import {message} from 'antd';
import axios from 'axios';
import {getToken} from './token';
import history from './history';

const baseURL = '';

const HTTPErrorHandler = (error) => {
  if (error.response) {
    // got a response with abnormal status code
    if (error.response.data && error.response.data.message) {
      // 401 -> unauthorized
      if (error.response.status === 401) {
        message.error('令牌不存在或已过期，请重新登录！');
        history.push('/login');
      } else {
        console.error(error.response);
        message.error(error.response.data.message);
      }
    } else {
      console.error(error.response);
      message.error('发生未知错误!');
    }
  } else {
    console.error(error);
    message.error('发生未知错误!');
  }
  return Promise.reject(error);
};

// the http status code is in 2XX while the response body's code is not normal
const dataHandler = (response) => {
  const {data} = response;
  if (data.code !== 0) {
    const content = data.message ? data.message : '未知错误!';
    message.error(content);
    return Promise.reject(new Error(content));
  }
  return data.data;
};

const defaultRejectHandler = (data) => {
  console.error(data.message);
  return Promise.reject(data);
};

const getApi = (url, type) => {
  if (!type) type = 'application/json';
  const api = axios.create({
    baseURL: url,
    headers: {
      'Content-Type': type
    }
  });

  api.interceptors.request.use(
    (config) => {
      let newConfig = config;
      if (getToken()) {
        newConfig =
                    {
                      ...config,
                      headers: {
                        ...config.headers,
                        Authorization: 'Bearer '.concat(getToken()),
                      },
                    };
      }
      return newConfig;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use((response) => response, HTTPErrorHandler);
  return api;
};

const api = getApi(baseURL);

const getApiForClient = (url, type) => {
  if (!type) type = 'application/json';
  const clientApi = axios.create({
    baseURL: url,
    headers: {
      'Content-Type': type
    }
  });

  clientApi.interceptors.request.use(
      (config) => {
        let newConfig = config;
        if (getToken()) {
          newConfig =
              {
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: 'Bearer '.concat(getToken()),
                },
              };
        }
        return newConfig;
      }
  );
  return clientApi;
};

const generalApi = getApiForClient(baseURL);

export {
  baseURL, api, dataHandler, getApi, defaultRejectHandler, generalApi
};
