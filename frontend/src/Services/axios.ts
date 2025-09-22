// frontend/src/services/axios.ts

import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// log útil no dev
console.debug("[axios] baseURL:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// log das requests (debug)
api.interceptors.request.use((config) => {
  console.debug("[axios] request:", (config.baseURL ?? "") + (config.url ?? ""));
  return config;
});

export default api;
