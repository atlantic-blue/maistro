export interface IBusinessProfile {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  openUntil: string;
  isOpen: boolean;
  phone?: string;
  website?: string;
  description: string;
  images: {
    main: string;
    gallery: string[];
  };
  services: Service[];
  reviews: Review[];
  nearbyVenues: NearbyVenue[];
  openingHours: OpeningHours[];
  features: string[];
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
  rating: string;
  location: string;
  image: string;
  category: string;
}

export interface OpeningHours {
  day: string;
  hours: string;
}
