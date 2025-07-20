//EXample Roles
export enum UserRole {
  DEVELOPER = "DEVELOPER",
  ADMIN = "ADMIN",
  USER = "USER",
}

export const rolePriority: Record<UserRole, number> = {
  [UserRole.DEVELOPER]: 3,
  [UserRole.ADMIN]: 2,
  [UserRole.USER]: 1,
};

/**
 * Can currentRole perform actions allowed for targetMinRole?
 */
export function canPerformGeneralAction(
  currentRole: UserRole,
  targetRole: UserRole
): boolean {
  return rolePriority[currentRole] >= rolePriority[targetRole];
}

/**
 * Can currentRole modify the targetRole?
 * (e.g. DEV > ADMIN, ADMIN > USER, but ADMIN can't > DEV)
 */
export function canPerformPrivilegedAction(
  currentRole: UserRole,
  targetRole: UserRole
): boolean {
  if (currentRole === UserRole.DEVELOPER) {
    return rolePriority[currentRole] > rolePriority[targetRole];
  }
  return rolePriority[currentRole] >= rolePriority[targetRole];
}
