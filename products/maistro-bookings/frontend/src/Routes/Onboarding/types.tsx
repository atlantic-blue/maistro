export interface Service {
  name: string;
  duration: string;
  price: number;
}

export interface OnboardingFormData {
  businessName: string;
  website: string;
  businessType: string[];
  accountType: 'independent' | 'team' | '';
  teamSize: string;
  address: string;
  phone: string;
  description: string;
  services: Service[];
  features: string[];
  hearAbout: string;
}
