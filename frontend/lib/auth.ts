const STORAGE_KEY = "url-shortener:userId";
const AUTH_EVENT = "url-shortener:auth-changed";

export function getUserId(): number | null {
  if (typeof window === "undefined") {
    return null;
  }
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value ? Number(value) : null;
}

export function setUserId(userId: number) {
  window.localStorage.setItem(STORAGE_KEY, String(userId));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearUserId() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function subscribeToAuthChanges(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_EVENT, callback);
  };
}
