import axios from "axios";

const api = axios.create({
  baseURL: "http://mednat.ieeta.pt:8765",
});

export default api;