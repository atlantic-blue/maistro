export type Locale = 'es' | 'en';

export interface Service {
  name: string;
  duration: string;
  price: number;
}

export interface BusinessProfile {
  BusinessId: string;
  Slug: string;
  UserId: string;

  Industry?: string;
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
  AddressDetails: {
    City: string;
    Country: string;
    Postcode: string;
    FirstLine: string;
  };
  Email: string;
  Images: {
    Main: string;
    Gallery: string[];
  };
  Phone: string;
  Description: string;
  Services: Service[];
  Features: string[];
  HearAbout: string;
}
