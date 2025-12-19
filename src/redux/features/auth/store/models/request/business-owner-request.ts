/**
 * User business owner Request Types
 */

import { BaseGetAllRequest } from "@/utils/common/get-all-request";
import {
  CancelSubscriptionData,
  ChangePlanData,
  RenewSubscriptionData,
} from "../schema/business-owner.schema";

/**
 * Fetch All User business owner Request
 */
export interface AllBusinessOwnerRequest extends BaseGetAllRequest {
  businessStatuses?: string[];
  ownerAccountStatuses?: string[];
  subscriptionStatuses?: string[];
  autoRenew?: boolean;
  expiringSoonDays?: number;
  paymentStatuses?: string[];
}

export interface UpdateBusinessOwnerChangePlanParams {
  ownerId: string;
  businessOwnerData: ChangePlanData;
}

export interface UpdateBusinessOwnerRenewParams {
  ownerId: string;
  businessOwnerData: RenewSubscriptionData;
}

export interface UpdateBusinessOwnerCancelParams {
  ownerId: string;
  businessOwnerData: CancelSubscriptionData;
}
