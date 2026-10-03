import axios from "axios";
import { getToken } from "./localStorage";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/identity";

export const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const requestPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm Interceptor để đính kèm token vào mọi request
requestPrivate.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
