import axios from "axios";

const api = axios.create({
  baseURL: "http://mednat.ieeta.pt:8757",
});

export default api;