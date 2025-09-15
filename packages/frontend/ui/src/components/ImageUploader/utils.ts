import { UploadItem } from './types';

export const uuid = () => {
  return Math.random().toString(36).slice(2);
};

export const createErrorItem = (file: File, message: string): UploadItem => {
  return {
    state: 'ERROR',
    id: uuid(),
    file,
    previewUrl: URL.createObjectURL(file),
    progress: 0,
    message,
  };
};

export const getItem = (items: UploadItem[], id: string) => {
  return items.find((item) => item.id === id);
};

export const updateItem = (list: UploadItem[], id: string, patch: Partial<UploadItem>) => {
  return list.map((item) => (item.id === id ? { ...item, ...patch } : item));
};

export const formatBytes = (n: number) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
};
