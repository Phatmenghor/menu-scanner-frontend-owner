import { UserAuthResponseModel } from "@/redux/features/auth/store/models/response/auth-resposne";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

const USER_INFO_COOKIE_KEY = "auth-user-info";

export function storeUserInfo(user: UserAuthResponseModel | undefined): void {
  if (typeof window === "undefined" || !user) return;

  setCookie(USER_INFO_COOKIE_KEY, JSON.stringify(user), {
    maxAge: 365 * 24 * 60 * 60, // 1 year
  });
}

export function getUserInfo(): UserAuthResponseModel | null {
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
