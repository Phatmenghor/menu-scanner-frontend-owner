export interface MyBusinessModel {
  businessId: string;
  name: string;
  imageUrl: string;
  description: string;
  phone: string;
  address: string;
  businessType: string;
  facebookUrl: string;
  instagramUrl: string;
  telegramUrl: string;
  usdToKhrRate: number;
  taxRate: number;
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
