export enum SubscriptionTier {
    FREE= 'FREE',
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

export interface Service {
  name: string;
  duration: string;
  price: number;
}

export interface UserProfile {
  UserId: MaistroUser["UserId"];
  CompanyName?: string;
  Industry?: string;
  CompanySize?: string;
  Country?: string;
  OnboardingCompleted: boolean;
  OnboardingStep: number;
  MarketingOptIn: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  BusinessName: string;
  Website: string;
  BusinessType: string[];
  AccountType: 'independent' | 'team' | string;
  TeamSize: string;
  Address: string;
  Phone: string;
  Description: string;
  Services: Service[];
  Features: string[];
  HearAbout: string;
}