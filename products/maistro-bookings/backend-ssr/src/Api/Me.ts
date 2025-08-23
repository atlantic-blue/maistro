import { MaistroUser, UserProfile } from "@/Routes/Dahsboard/types";

const Me = async (url: string, token: string): Promise<MaistroUser> => {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
};

const MeProfile = async (url: string, token: string): Promise<UserProfile> => {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
};

export { Me, MeProfile };
