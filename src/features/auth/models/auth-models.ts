/**
 * Auth API Models
 * API request/response models for authentication
 */

export interface LoginCredentialsModel {
  userIdentifier: string;
  password: string;
}

export interface UserAuthResponseModel {
  accessToken?: string;
  tokenType?: string;
  userId?: string;
  userIdentifier?: string;
  email?: string;
  fullName?: string;
  profileImageUrl?: string;
  userType?: string;
  roles?: string[];
  businessId?: string;
  businessName?: string;
  welcomeMessage?: string;
}

export interface ProfileResponseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  userIdentifier: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  phoneNumber: string;
  profileImageUrl: string;
  userType: string;
  accountStatus: string;
  roles: string[];
  position: string;
  address: string;
  notes: any;
  businessId: any;
  businessName: any;
  socialProvider: string;
  hasTelegramLinked: boolean;
  telegramUserId: any;
  telegramUsername: any;
  telegramDisplayName: string;
  telegramLinkedAt: any;
  telegramNotificationsEnabled: boolean;
  canReceiveTelegramNotifications: boolean;
  active: boolean;
  businessUser: boolean;
  customer: boolean;
  platformUser: boolean;
  telegramUser: boolean;
  localUser: boolean;
  authenticationMethod: string;
}
