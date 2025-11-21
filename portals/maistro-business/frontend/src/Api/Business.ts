import env from '@/env';
import { BusinessProfile } from '@/Routes/Businesses/types';
import { MaistroImage } from '@/types';

export const getBusinessProfileById = async (businessId: string): Promise<BusinessProfile> => {
  const url = `${env.api.businesses.businessById(businessId)}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
};

export const BusinessMe = async (token: string): Promise<BusinessProfile[]> => {
  const url = env.api.businesses.getBusinesses;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    // TODO alert to main app
    if (!response.ok) {
      return []
    }

    return response.json()
  });
};

export interface Service {
  name: string;
  duration: string;
  price: number;
}

export interface UpdateBusinessFormData {
  businessName: string;
  website: string;
  businessType: string[];
  accountType: 'independent' | 'team' | string;
  teamSize: string;
  address: string;
  phone: string;
  description: string;
  services: Service[];
  features: string[];
  hearAbout: string;
  addressDetails: {
    city: string;
    country: string;
    postcode: string;
    firstLine: string;
  };
  email: string;
  images: {
    main: MaistroImage;
    gallery: MaistroImage[];
  };
}

export const postBusinessUpdate = async (
  token: string,
  businessId: string,
  data: UpdateBusinessFormData
) => {
  const url = env.api.businesses.postBusinessById(businessId);

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...data,
    }),
  }).then((response) => response.json());
};
