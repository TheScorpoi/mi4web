import axios from "axios";

const api = axios.create({
  baseURL: "http://mednat.ieeta.pt:8758",
});

export default api;