export interface Service {
  name: string;
  duration: string;
  price: number;
}

export interface MaistroImage {
  OwnerType: "user" | "business";
  OwnerId: string;
  ImageId: string;
  /**
   * 'image/jpeg'
   * 'image/png'
   */
  ContentType: string;
  Status: "UPLOADING" | "READY";

  Urls: {
    Optimized: string;
    Low: string;
    Medium: string;
    High: string;
    Original: string;
  };

  SizesInBytes: {
    Optimised: number;
    Low: number;
    Medium: number;
    High: number;
    TotalBytes: number;
  };

  CreatedAt: string;
  ProcessedAt: string;
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
  AccountType: "independent" | "team" | string;
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
    Main: MaistroImage;
    Gallery: MaistroImage[];
  };
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
