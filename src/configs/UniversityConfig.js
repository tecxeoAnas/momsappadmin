import axios from "axios";

const api = axios.create({
  baseURL: "https://mom-app-ad61901f627b.herokuapp.com",
});

// Interceptor → har request ke sath token add karega
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
