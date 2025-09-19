import { MaistroImage } from './types';

export function pickLargeUrl(image: MaistroImage) {
  const url = image.Urls?.High || image.Urls?.Optimized || image.Urls?.Medium || image.Urls?.Low;
  return url ? `https://${url}` : '';
}

export function pickThumbUrl(image: MaistroImage) {
  const url = image.Urls?.Low || image.Urls?.Medium || image.Urls?.Optimized || image.Urls?.High;
  return url ? `https://${url}` : '';
}

export function altFor(image: MaistroImage) {
  return `Imagen ${image.ImageId}`;
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {}
}

export function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
}
