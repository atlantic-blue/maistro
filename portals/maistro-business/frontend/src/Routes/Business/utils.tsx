import { MaistroImage } from '@/types';

type MaybeMaistroImage = string | null | undefined | MaistroImage;

const isMaistroImage = (v: MaybeMaistroImage): v is MaistroImage => {
  return typeof v === 'object' && v !== null && 'Urls' in v;
};

export const normalizeMaistroImages = (v: MaybeMaistroImage[]): (MaistroImage | null)[] => {
  return v.map(normalizeMaistroImage);
};

export const normalizeMaistroImage = (v: MaybeMaistroImage): MaistroImage | null => {
  if (!v) return null;
  if (isMaistroImage(v)) return v;
  // Assume legacy string — return as all variants
  return {
    Urls: {
      Original: v,
      Low: v,
      Medium: v,
      High: v,
      Optimized: v,
    },
    ContentType: '',
    CreatedAt: '',
    ImageId: '',
    OwnerId: '',
    OwnerType: 'business',
    ProcessedAt: '',
    SizesInBytes: {
      High: 0,
      Low: 0,
      Medium: 0,
      Optimised: 0,
      TotalBytes: 0,
    },
    Status: 'READY',
  };
};
