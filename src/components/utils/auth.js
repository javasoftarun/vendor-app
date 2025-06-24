// utils/auth.js
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getToken() {
  const user = getUser();
  return user?.token || null;
}

export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function isAuthenticated() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user.token) return false;
  try {
    const payload = JSON.parse(atob(user.token.split('.')[1]));
    // Check expiry (exp is in seconds)
    if (payload.exp && Date.now() < payload.exp * 1000) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function logout() {
  localStorage.removeItem("user");
}