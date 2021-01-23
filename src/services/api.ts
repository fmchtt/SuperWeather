import axios from "axios";

const api = axios.create({
  baseURL: "http://metaweather.com/api",
});

export default api;
