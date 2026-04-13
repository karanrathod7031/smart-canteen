const USER_KEY = "sc_user";
const TOKEN_KEY = "sc_token";

export function saveAuth(user, token) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);

    // 🚨 Fix here
    if (!raw || raw === "undefined") return null;

    return JSON.parse(raw);
  } catch (err) {
    console.error("Invalid user data in localStorage");
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function clearAuth() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}