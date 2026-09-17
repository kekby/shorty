const STORAGE_KEY = "url-shortener:userId";

export function getUserId(): number | null {
  if (typeof window === "undefined") {
    return null;
  }
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value ? Number(value) : null;
}

export function setUserId(userId: number) {
  window.localStorage.setItem(STORAGE_KEY, String(userId));
}

export function clearUserId() {
  window.localStorage.removeItem(STORAGE_KEY);
}
