export interface AllUserResponse {
  content: UserModel[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UserModel {
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
  businessId: string;
  businessName: string;
  roles: string[];
  position: string;
  address: string;
  notes: string;

  // ===== TELEGRAM INTEGRATION FIELDS =====
  socialProvider: string;
  hasTelegramLinked: boolean;
  telegramUserId?: number;
  telegramUsername?: string;
  telegramDisplayName?: string;
  telegramLinkedAt?: string;
  telegramNotificationsEnabled?: boolean;
  canReceiveTelegramNotifications?: boolean;
}

export interface CreateUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  phoneNumber: string;
  userType: string;
  accountStatus: string;
  userIdentifier: string;
  businessId: string;
  businessName: string;
  roles: string[];
  position: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;

  // ===== TELEGRAM INTEGRATION FIELDS =====
  socialProvider: string;
  hasTelegramLinked: boolean;
  telegramUserId?: number;
  telegramUsername?: string;
  telegramDisplayName?: string;
  telegramLinkedAt?: string;
  telegramNotificationsEnabled?: boolean;
  canReceiveTelegramNotifications?: boolean;
}

// ===== TELEGRAM-SPECIFIC INTERFACES =====
export interface TelegramAuthResponse {
  accessToken: string;
  tokenType: string;
  userId: string;
  userIdentifier: string;
  email?: string;
  fullName: string;
  displayName: string;
  userType: string;
  roles: string[];
  businessId?: string;
  businessName?: string;
  socialProvider: string;
  telegramUserId: number;
  telegramUsername?: string;
  telegramDisplayName: string;
  telegramLinkedAt: string;
  isNewUser: boolean;
  hasPasswordSet: boolean;
  welcomeMessage: string;
  message?: string;
}

export interface TelegramLinkRequest {
  telegramUserId: number;
  telegramUsername?: string;
  telegramFirstName?: string;
  telegramLastName?: string;
  telegramPhotoUrl?: string;
  authDate?: string;
  hash?: string;
  chatId?: string;
  languageCode?: string;
  isPremium?: boolean;
}

export interface TelegramLoginRequest {
  telegramUserId: number;
  telegramUsername?: string;
  telegramFirstName?: string;
  telegramLastName?: string;
  telegramPhotoUrl?: string;
  authDate?: string;
  hash?: string;
  chatId?: string;
  languageCode?: string;
  isPremium?: boolean;
  email?: string;
  phoneNumber?: string;
  userIdentifier?: string;
}
