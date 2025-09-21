const API_BASE = "http://localhost:3000/api";
let token = null;

function setToken(t) {
  token = t;
}

async function request(path, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  return res.json();
}

const api = {
  register: (u, p) => request("/register", "POST", { username: u, password: p }),
  login: (u, p) => request("/login", "POST", { username: u, password: p }),
  getChannels: () => request("/channels"),
  createChannel: (name) => request("/channels/create", "POST", { name }),
  getMessages: (channel) => request(`/messages?channel=${channel}`),
  sendMessage: (channel, text) => request("/message", "POST", { channel, text }),
  setToken
};
