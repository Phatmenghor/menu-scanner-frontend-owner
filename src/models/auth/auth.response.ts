export interface UserAuthResponse {
  accessToken?: string;
  tokenType?: string;
  userId?: string;
  userIdentifier?: string;
  email?: string;
  fullName?: string;
  profileImageUrl?: string;
  userType?: string;
  roles?: string[];
  businessId?: string;
  businessName?: string;
  welcomeMessage?: string;
}
