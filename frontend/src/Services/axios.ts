//frontend/src/services/axios.ts 

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;