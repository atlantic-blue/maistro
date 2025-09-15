export type OwnerType = 'user' | 'business';

type PresignedPost = {
  url: string;
  fields: Record<string, string>;
};

export type ItemState =
  | 'QUEUED'
  | 'SIGNING'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'DONE'
  | 'ERROR'
  | 'CANCELED';

export type UploadUrlResponse = {
  ImageId: string;
  Urls: {
    Optimised: string;
    Low: string;
    Medium: string;
    High: string;
    Original: string;
  };
  PresignedUrl: PresignedPost;
};

export interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  state: ItemState;
  progress: number; // 0..100
  speedBps?: number;
  etaSec?: number;
  message?: string;
  xhr?: XMLHttpRequest;
  imageId?: string;
  s3Key?: string; // from presigned fields.key
  urls?: UploadUrlResponse['Urls'];
}
