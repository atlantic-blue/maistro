import { IBusinessProfile } from '@/types/BusinessProfile';

export const BusinessProfile = async (url: string): Promise<IBusinessProfile> => {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
};
