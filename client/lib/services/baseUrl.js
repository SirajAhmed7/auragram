const { default: axios } = require("axios");

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default api;
