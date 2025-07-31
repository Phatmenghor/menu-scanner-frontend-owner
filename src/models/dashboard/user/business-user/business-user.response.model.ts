export interface MyBusinessModel {
  businessId: string;
  name: string;
  logoUrl: string;
  description: string;
  phone: string;
  address: string;
  website: string;
  businessType: string;
  cuisineType: string;
  operatingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  telegramContact: string;
  usdToKhrRate: number;
  taxRate: number;
  serviceChargeRate: number;
  acceptsOnlinePayment: boolean;
  acceptsCashPayment: boolean;
  acceptsBankTransfer: boolean;
  acceptsMobilePayment: boolean;
  hasActiveSubscription: boolean;
  currentPlan: string;
  daysRemaining: number;
  subscriptionEndDate: string;
  currency: string;
  timezone: string;
  updatedAt: string;
}

export interface MyBusinessUserModel {
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
}
