import { deleteCookie, getCookie, setCookie } from "cookies-next";

const ROLES_COOKIE_KEY = "auth-roles";

export function storeRolesRemember(role: string | undefined): void {
  if (typeof window === "undefined") {
    return;
  }

  setCookie(ROLES_COOKIE_KEY, JSON.stringify(role), {
    maxAge: 365 * 24 * 60 * 60, // 1 year
  });
}

export function getRoles(): string | null {
  const cookieValue = getCookie(ROLES_COOKIE_KEY);
  return typeof cookieValue === "string" ? cookieValue : null;
}

export function storeRole(role: string | undefined): void {
  if (typeof window === "undefined" || !role) {
    return;
  }

  setCookie(ROLES_COOKIE_KEY, role);
}

/**
 * Logout the current user
 */
export function logoutRole(): void {
  // Delete auth cookie
  deleteCookie(ROLES_COOKIE_KEY);
}

export function logoutRoles(): void {
  deleteCookie(ROLES_COOKIE_KEY);
}

export function hasRoles(): boolean {
  const roles = getRoles();
  return !!roles && roles.length > 0;
}
