import { setCookie, getCookie, deleteCookie } from "cookies-next";

interface StoredUserInfo {
  userId: string;
  email: string;
  fullName: string;
  businessId: string;
  userType: string;
}

const USER_INFO_COOKIE_KEY = "auth-user-info";

export function storeUserInfo(user: StoredUserInfo | undefined): void {
  if (typeof window === "undefined" || !user) return;

  setCookie(USER_INFO_COOKIE_KEY, JSON.stringify(user), {
    maxAge: 365 * 24 * 60 * 60, // 1 year
  });
}

export function getUserInfo(): StoredUserInfo | null {
  const cookieValue = getCookie(USER_INFO_COOKIE_KEY);
  try {
    return cookieValue ? JSON.parse(cookieValue as string) : null;
  } catch {
    return null;
  }
}

export function clearUserInfo(): void {
  deleteCookie(USER_INFO_COOKIE_KEY);
}
