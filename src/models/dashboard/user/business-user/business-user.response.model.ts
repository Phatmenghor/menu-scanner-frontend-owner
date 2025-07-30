import { BusinessModel } from "../../master-data/business/business.response.model";
import { PaymentModel } from "../../payment/payment/payment.response.model";
import { SubscriptionModel } from "../../subscription/subscription.response.model";
import { SubDomainModel } from "../plateform-user/sub-domain/sub-domain.response.model";
import { UserModel } from "../plateform-user/user.response";

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
