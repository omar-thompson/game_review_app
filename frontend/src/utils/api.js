// ─── API client ───────────────────────────────────────────────────────────────
// This is the ONLY file in the whole frontend that talks to the backend.
// Every network request in the app funnels through request() below —
// components never call fetch() directly, they call one of the named
// functions in authApi/userApi/reviewApi, which call request() for them.
//
// Talks to the backend under /api. In dev, Vite proxies /api to the backend
// (see vite.config.js); in production the backend serves the frontend itself,
// so /api is already same-origin.

// The one place fetch() actually gets called — this is the literal moment
// a request leaves the browser and goes over the network to Express.
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    credentials: "include", // send the httpOnly jwt cookie with every request
    headers: { "Content-Type": "application/json" },
    ...options, // lets callers override/add method, body, etc.
  });

  const data = await res.json().catch(() => ({}));

  // Express returns { message: "..." } on errors (4xx/5xx) — turn that into
  // a real thrown error so callers can just do .catch(err => ...)
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Auth endpoints — register/login/logout/me (see backend/routes/authRoutes.js)
export const authApi = {
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"), // GET is the default method, no need to specify it
};

// Admin-only user management (see backend/routes/userRoutes.js)
export const userApi = {
  list: () => request("/users"),
  update: (id, updates) => request(`/users/${id}`, { method: "PUT", body: JSON.stringify(updates) }),
  remove: (id) => request(`/users/${id}`, { method: "DELETE" }),
};

// Reviews (see backend/routes/reviewRoutes.js)
export const reviewApi = {
  forGame: (gameId) => request(`/reviews?game=${gameId}`),     // public, no login needed
  create: (game, score, body) =>
    request("/reviews", { method: "POST", body: JSON.stringify({ game, score, body }) }), // must be logged in
  mine: () => request("/reviews/mine"),                        // must be logged in
};
