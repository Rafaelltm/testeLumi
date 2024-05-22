import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:3000",
  maxContentLength: 10000000,
  maxBodyLength: 10000000,
});

export default api;