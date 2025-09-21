import axios from "axios";

const API_BASE = "http://localhost:3000/api";
let token = null;

export function setToken(t) {
  token = t;
}

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(config => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (u, p) => api.post("/login", { username: u, password: p });
export const register = (u, p) => api.post("/register", { username: u, password: p });
export const getChannels = () => api.get("/channels");
export const createChannel = (name) => api.post("/channels/create", { name });
export const getMessages = (channel) => api.get("/messages", { params: { channel } });
export const sendMessage = (channel, text) => api.post("/message", { channel, text });
