/* eslint-disable */
export enum SubscriptionTier {
  FREE = 'FREE',
  GROWTH = 'GROWTH',
  PREMIUM = 'PREMIUM',
  MAISTRO = 'MAISTRO',
}

export interface MaistroUser {
  UserId: string;
  CognitoUserId: string;
  Email: string;
  FirstName?: string;
  LastName?: string;
  Avatar?: string;
  CreatedAt: string;
  UpdatedAt: string;
  LastLoginAt: string;
  Status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  SubscriptionTier: SubscriptionTier;
  EmailVerified: boolean;
  PhoneNumber?: string;
  PhoneVerified?: boolean;
  PreferredLanguage?: string;
  Timezone?: string;
  ProductAccess: {
    websites: boolean;
    funnels: boolean;
    customers: boolean;
    socials: boolean;
    chats: boolean;
    academy: boolean;
    bookings: boolean;
  };
}

