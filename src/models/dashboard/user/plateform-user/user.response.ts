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
  roles: string[];
  position: string;
  address: string;
  notes: string;
  businessId: string;
  businessName: string;
  socialProvider: string;
  hasTelegramLinked: boolean;
  telegramUserId: string;
  telegramUsername: string;
  telegramDisplayName: string;
  telegramLinkedAt: string;
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
