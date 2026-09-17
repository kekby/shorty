import { getUserId } from "./auth";
import type { Link, LinkStats, LinkWithClicks, LoginResponse } from "./model";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const userId = getUserId();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (userId) {
    headers.set("X-User-Id", String(userId));
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "Request failed");
  }

  return data as T;
}

export function login(email: string, password: string) {
  return request<LoginResponse>("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function createLink(url: string) {
  return request<Link>("/api/links", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

export function getLinks() {
  return request<LinkWithClicks[]>("/api/links");
}

export function getLinkStats(code: string) {
  return request<LinkStats>(`/api/links/${code}/stats`);
}

export function shortLinkUrl(code: string) {
  return `${API_URL}/${code}`;
}
