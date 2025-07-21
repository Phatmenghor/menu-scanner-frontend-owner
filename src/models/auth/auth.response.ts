export interface UserAuthResponse {
  accessToken?: string;
  tokenType?: string;
  userId: string;
  email?: string;
  fullName?: string;
  userType?: string;
  roles?: string[];
  businessId?: string;
  businessName?: string;
  welcomeMessage?: string;
}
