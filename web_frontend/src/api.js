const DEFAULT_API_BASE = 'http://localhost:3001';

const TOKEN_KEY = 'upm_token';

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the configured API base URL (env override supported). */
  return process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE;
}

// PUBLIC_INTERFACE
export function getToken() {
  /** Returns stored JWT token or null. */
  return window.localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Stores JWT token (or clears if null). */
  if (!token) window.localStorage.removeItem(TOKEN_KEY);
  else window.localStorage.setItem(TOKEN_KEY, token);
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  let json = null;
  const text = await res.text();
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    const message = (json && (json.message || json.error)) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json;
}

// PUBLIC_INTERFACE
export function apiRegister({ email, password, display_name, bio }) {
  /** Register a new user. */
  return request('/register', { method: 'POST', body: { email, password, display_name, bio } });
}

// PUBLIC_INTERFACE
export async function apiLogin({ email, password }) {
  /** Login and store JWT token. */
  const data = await request('/login', { method: 'POST', body: { email, password } });
  setToken(data.access_token);
  return data;
}

// PUBLIC_INTERFACE
export async function apiLogout() {
  /** Server logout (stateless) + clear token locally. */
  try {
    await request('/logout', { method: 'POST' });
  } finally {
    setToken(null);
  }
}

// PUBLIC_INTERFACE
export function apiGetProfile() {
  /** Fetch current user's profile (requires auth). */
  return request('/profile', { method: 'GET', auth: true });
}

// PUBLIC_INTERFACE
export function apiUpdateProfile({ display_name, bio }) {
  /** Update profile (requires auth). */
  return request('/profile', { method: 'PUT', auth: true, body: { display_name, bio } });
}

// PUBLIC_INTERFACE
export function apiProtectedPing() {
  /** Call example protected endpoint (requires auth). */
  return request('/protected', { method: 'GET', auth: true });
}
