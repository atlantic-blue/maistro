import { MaistroUser } from '../Routes/Dahsboard/types';
import { BusinessProfile } from '../types/BusinessProfile';

const Me = async (url: string, token: string): Promise<MaistroUser> => {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
};

const MeProfile = async (url: string, token: string): Promise<BusinessProfile> => {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
};

export { Me, MeProfile };
