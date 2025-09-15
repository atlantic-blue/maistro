import { Badge, Text, Button, Card, Flex, Tooltip } from '@radix-ui/themes';
import { Image as ImageIcon, Trash2, ExternalLink, Copy } from 'lucide-react';
import { MaistroImage } from './types';

function AestheticPlaceholder({
  label = 'Maistro',
  full = false,
}: {
  label?: string;
  full?: boolean;
}) {
  return (
    <div
      className={`relative ${full ? 'w-full h-full' : 'w-full h-64 sm:h-80 md:h-[60vh]'} overflow-hidden rounded-2xl`}
    >
      {/* Soft Maistro gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFE3EA] via-[#FFF8F6] to-[#E8F2FF]" />
      {/* Subtle dot grid pattern */}
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,51,102,0.08)_1px,transparent_1px)] [background-size:16px_16px]" />
      {/* Gentle shimmer */}
      <div className="absolute inset-0 animate-pulse bg-white/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-xl bg-white/70 backdrop-blur px-4 py-2 shadow-sm">
          <ImageIcon size={18} className="text-[#FF3366]" />
          <Text color="gray" size="2">
            {label}
          </Text>
        </div>
      </div>
    </div>
  );
}

function pickThumbUrl(image: MaistroImage) {
  const url = image.Urls?.Low || image.Urls?.Medium || image.Urls?.Optimized || image.Urls?.High;
  return url ? `https://${url}` : '';
}

function altFor(image: MaistroImage) {
  return `Imagen ${image.ImageId}`;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {}
}

export function GridView({
  images,
  onOpen,
  onDelete,
  busyIds,
}: {
  images: MaistroImage[];
  onOpen: (i: number) => void;
  onDelete: (id: string) => void;
  busyIds: Record<string, boolean>;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {images.map((image, i) => (
        <div
          key={image.ImageId}
          className="group relative overflow-hidden rounded-2xl bg-white border border-neutral-200 shadow-sm"
        >
          <div className="aspect-square w-full overflow-hidden bg-neutral-100">
            {pickThumbUrl(image) ? (
              <img
                src={pickThumbUrl(image)}
                alt={altFor(image)}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <AestheticPlaceholder />
            )}
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 hidden items-end justify-between gap-2 p-2 group-hover:flex bg-gradient-to-t from-black/50 via-black/0 to-transparent">
            <Flex gap="2">
              <Badge color={image.Status === 'READY' ? 'green' : 'amber'}>{image.Status}</Badge>
            </Flex>
            <Flex gap="2">
              {image.Urls?.Optimized && (
                <Tooltip content="Abrir">
                  <Button
                    size="1"
                    variant="solid"
                    onClick={() => window.open(image.Urls!.Optimized!, '_blank')}
                  >
                    <ExternalLink size={14} />
                  </Button>
                </Tooltip>
              )}
              {image.Urls?.Optimized && (
                <Tooltip content="Copiar link">
                  <Button
                    size="1"
                    variant="soft"
                    onClick={() => copyToClipboard(image.Urls!.Optimized!)}
                  >
                    <Copy size={14} />
                  </Button>
                </Tooltip>
              )}
              <Tooltip content="Ver">
                <Button size="1" variant="soft" onClick={() => onOpen(i)}>
                  <ImageIcon size={14} />
                </Button>
              </Tooltip>
              <Tooltip content="Eliminar">
                <Button
                  size="1"
                  color="red"
                  variant="soft"
                  onClick={() => onDelete(image.ImageId)}
                  disabled={!!busyIds[image.ImageId]}
                >
                  <Trash2 size={14} />
                </Button>
              </Tooltip>
            </Flex>
          </div>
        </div>
      ))}
      {images.length === 0 && (
        <Card className="col-span-full">
          <Flex align="center" justify="center" className="p-10" direction="column" gap="3">
            <ImageIcon />
            <Text color="gray">No hay imágenes todavía. Sube tus activos y aparecerán aquí.</Text>
          </Flex>
        </Card>
      )}
    </div>
  );
}
