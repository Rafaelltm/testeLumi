import axios from "axios";

console.log(process.env);

const baseURL = process.env.REACT_APP_API_ADDRESS || "http://localhost:3001";

const api = axios.create({
  baseURL: baseURL,
  maxContentLength: 10000000,
  maxBodyLength: 10000000,
});

export default api;