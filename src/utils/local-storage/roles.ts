import { deleteCookie, getCookie, setCookie } from "cookies-next";

const ROLES_COOKIE_KEY = "auth-roles";

// Store multiple roles in cookie
export function storeRoles(roles: string[] | undefined): void {
  if (typeof window === "undefined" || !roles || roles.length === 0) return;

  setCookie(ROLES_COOKIE_KEY, JSON.stringify(roles), {
    maxAge: 365 * 24 * 60 * 60, // 1 year
  });
}

// Retrieve roles from cookie
export function getRoles(): string[] {
  const cookieValue = getCookie(ROLES_COOKIE_KEY);

  try {
    return cookieValue ? JSON.parse(cookieValue as string) : [];
  } catch (error) {
    return [];
  }
}

// Check if any roles exist
export function hasRoles(): boolean {
  const roles = getRoles();
  return roles.length > 0;
}

// Clear roles (logout)
export function clearRoles(): void {
  deleteCookie(ROLES_COOKIE_KEY);
}
