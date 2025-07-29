export interface UpdateMyBusinessRequest {
  logoUrl?: string;
  name?: string;
  description?: string;
  phone?: string;
  address?: string;
  website?: string;
  businessType?: string;
  cuisineType?: string;
  operatingHours?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  telegramContact?: string;
  usdToKhrRate?: number;
  taxRate?: number;
  serviceChargeRate?: number;
  acceptsOnlinePayment?: boolean;
  acceptsCashPayment?: boolean;
  acceptsBankTransfer?: boolean;
  acceptsMobilePayment?: boolean;
}

export interface CreateBusinessUserRequest {
  ownerUserIdentifier: string;
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  businessDescription?: string;
  preferredSubdomain: string;
  ownerEmail?: string;
  ownerPassword: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone?: string;
  ownerAddress?: string;
}
