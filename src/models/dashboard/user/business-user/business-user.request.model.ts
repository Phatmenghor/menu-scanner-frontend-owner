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
