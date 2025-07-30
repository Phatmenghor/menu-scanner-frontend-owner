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
  paymentImageUrl?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentReferenceNumber?: string;
  paymentNotes?: string;
  paymentInfoComplete?: boolean;
}
