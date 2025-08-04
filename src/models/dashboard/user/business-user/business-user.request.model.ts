export interface UpdateMyBusinessRequest {
  logoUrl: string;
  name: string;
  description: string;
  phone: string;
  address: string;
  businessType: string;
  facebookUrl: string;
  instagramUrl: string;
  telegramUrl: string;
  usdToKhrRate: number;
  taxRate: number;
}

export interface CreateBusinessUserRequest {
  userIdentifier: string;
  email?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  position?: string;
  address?: string;
  notes?: string;
  userType: string;
  accountStatus?: string;
  businessId?: string;
  roles: string[];
}

export interface CreateBusinessOwnerRequest {
  ownerUserIdentifier: string;
  ownerEmail?: string;
  ownerPassword: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone?: string;
  ownerAddress?: string;
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  businessDescription?: string;
  preferredSubdomain: string;
  subscriptionPlanId?: string;
  subscriptionStartDate?: string;
  autoRenew?: boolean;
  subscriptionNotes?: string;
  paymentImageUrl?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentReferenceNumber?: string;
  paymentNotes?: string;
  paymentInfoComplete?: boolean;
}
