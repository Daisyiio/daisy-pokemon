import axios from "axios";

const request = axios.create({
  baseURL:'/',
  withCredentials: false,
});

request.interceptors.request.use((config) => {
  config.headers.Authorization = "";
  return config;
});

export default request;
