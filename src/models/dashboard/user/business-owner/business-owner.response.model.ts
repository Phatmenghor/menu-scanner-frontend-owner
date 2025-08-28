import { BusinessModel } from "../../master-data/business/business-response-model";
import { PaymentModel } from "../../payment/payment/payment.response.model";
import { SubscriptionModel } from "../../master-data/subscription/subscription.response.model";
import { SubDomainModel } from "../plateform-user/sub-domain/sub-domain.response.model";
import { UserModel } from "../plateform-user/user.response";

export interface BusinessOwnerResponse {
  owner: UserModel;
  business: BusinessModel;
  subdomain: SubDomainModel;
  subscription: SubscriptionModel;
  payment: PaymentModel;
  summary: string;
  createdComponents: string[];
  hasPayment: boolean;
  createdAt: string;
  componentCount: number;
  fullSetup: boolean;
}
