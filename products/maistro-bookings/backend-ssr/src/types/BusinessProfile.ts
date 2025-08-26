export interface Service {
  name: string;
  duration: string;
  price: number;
}

export interface BusinessProfile {
  BusinessId: string;
  Slug: string;
  UserId: string;
 
  OnboardingCompleted: boolean;
  Industry?: string;
  Country?: string;
  OnboardingStep: number;
  MarketingOptIn: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  BusinessName: string;
  Website?: string;
  BusinessType: string[];
  AccountType: 'independent' | 'team' | string;
  TeamSize: string;
  Address: string;
  Phone?: string;
  Description: string;
  Services: Service[];
  Features: string[];
  HearAbout: string;
}

export interface BusinessProfileExtended extends BusinessProfile {
  Rating?: number;
  ReviewCount?: number;
  OpenUntil?: string;
  IsOpen?: boolean;
  Images?: {
    Main?: string;
    Gallery?: string[];
  };
  Reviews?: Review[];
  NearbyVenues?: NearbyVenue[];
  OpeningHours?: OpeningHours[];
}

export interface Service {
  id: string;
  title: string;
  duration: string;
  price: number;
  category?: string;
}

export interface Review {
  id: string;
  customerName: string;
  date: string;
  rating: number;
  comment: string;
}

export interface NearbyVenue {
  id: string;
  name: string;
  rating: number;
  location: string;
  image: string;
  category: string;
}

export interface OpeningHours {
  day: string;
  hours: string;
}
