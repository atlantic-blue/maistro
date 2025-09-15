import { UploadItem, UploadUrlResponse } from './types';

export const getPresignedUrl = async (input: {
  url: string;
  item: UploadItem;
  OwnerId: string;
  OwnerType: string;
  token: string;
}) => {
  try {
    const response = await fetch(input.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${input.token}`,
      },
      body: JSON.stringify({
        OwnerId: input.OwnerId,
        OwnerType: input.OwnerType,
        ContentType: input.item.file.type,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get upload URL (${response.status})`);
    }

    const data = (await response.json()) as UploadUrlResponse;
    return data;
  } catch (error) {
    throw new Error(`Failed to get upload URL (${JSON.stringify(error)})`);
  }
};

export const resizeImage = async (input: { url: string; key: string; token: string }) => {
  try {
    const response = await fetch(input.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${input.token}`,
      },
      body: JSON.stringify({ key: input.key }),
    });

    if (!response.ok) {
      throw new Error(`Failed to resize Image (${response.status})`);
    }

    const data = (await response.json()) as Omit<UploadUrlResponse, 'PresignedUrl'>;
    return data;
  } catch (error) {
    throw new Error(`Failed to resize Image (${JSON.stringify(error)})`);
  }
};
