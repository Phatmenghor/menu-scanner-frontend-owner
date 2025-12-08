/**
 * Auth API Models
 * API request/response models for authentication
 */

export interface UserAuthResponseModel {
  userId: string;
  userIdentifier: string;
  email: string;
  fullName: string;
  profileImageUrl?: string;
  userType: string;
  businessId?: string;
  roles: string[];
  accessToken: string;
  refreshToken?: string;
}
