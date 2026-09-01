// ─── API client ───────────────────────────────────────────────────────────────
// Talks to the backend under /api. In dev, Vite proxies /api to the backend
// (see vite.config.js); in production the backend serves the frontend itself,
// so /api is already same-origin.

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const authApi = {
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),
};

export const userApi = {
  list: () => request("/users"),
  update: (id, updates) => request(`/users/${id}`, { method: "PUT", body: JSON.stringify(updates) }),
  remove: (id) => request(`/users/${id}`, { method: "DELETE" }),
};
