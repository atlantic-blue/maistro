import React, { useState } from 'react';
import { Badge, Text, Button, Card, Flex, Tooltip, Avatar } from '@radix-ui/themes';
import {
  Image,
  Trash2,
  ExternalLink,
  Copy,
  Heart,
  Download,
  Share2,
  MoreHorizontal,
  Eye,
  Calendar,
} from 'lucide-react';

// Types based on your existing structure
interface MaistroImage {
  ImageId: string;
  Urls?: {
    Low?: string;
    Medium?: string;
    High?: string;
    Optimized?: string;
  };
  Status: 'READY' | 'PROCESSING' | 'ERROR';
  CreatedAt?: string;
  Title?: string;
  Description?: string;
  Tags?: string[];
  Views?: number;
  Downloads?: number;
}

interface User {
  name: string;
  avatar?: string;
}

// Sample data for demonstration
const sampleImages: MaistroImage[] = [
  {
    ImageId: '1',
    Status: 'READY',
    CreatedAt: '2024-01-15',
    Title: 'Product Hero Image',
    Description: 'Main banner for website',
    Tags: ['banner', 'hero', 'product'],
    Views: 124,
    Downloads: 23,
    Urls: {
      Optimized:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    },
  },
  {
    ImageId: '2',
    Status: 'READY',
    CreatedAt: '2024-01-14',
    Title: 'Team Photo',
    Views: 89,
    Downloads: 12,
    Urls: {
      Optimized:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop',
    },
  },
  {
    ImageId: '3',
    Status: 'PROCESSING',
    CreatedAt: '2024-01-13',
    Title: 'Office Space',
    Views: 67,
    Downloads: 8,
    Urls: {
      Optimized:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop',
    },
  },
  {
    ImageId: '4',
    Status: 'READY',
    CreatedAt: '2024-01-12',
    Title: 'Marketing Materials',
    Views: 156,
    Downloads: 34,
    Urls: {
      Optimized:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
    },
  },
  {
    ImageId: '5',
    Status: 'READY',
    CreatedAt: '2024-01-11',
    Title: 'Logo Variations',
    Views: 203,
    Downloads: 45,
    Urls: {
      Optimized: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop',
    },
  },
  {
    ImageId: '6',
    Status: 'READY',
    CreatedAt: '2024-01-10',
    Title: 'Social Media Assets',
    Views: 91,
    Downloads: 16,
    Urls: {
      Optimized:
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop',
    },
  },
];

function AestheticPlaceholder({
  label = 'Maistro',
  full = false,
}: {
  label?: string;
  full?: boolean;
}) {
  return (
    <div className={`relative ${full ? 'w-full h-full' : 'w-full h-full'} overflow-hidden`}>
      {/* Soft Maistro gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFE3EA] via-[#FFF8F6] to-[#E8F2FF]" />
      {/* Subtle dot grid pattern */}
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,51,102,0.08)_1px,transparent_1px)] [background-size:16px_16px]" />
      {/* Gentle shimmer */}
      <div className="absolute inset-0 animate-pulse bg-white/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-xl bg-white/70 backdrop-blur px-4 py-2 shadow-sm">
          <Image size={18} className="text-[#FF3366]" />
          <Text color="gray" size="2">
            {label}
          </Text>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
}

function pickThumbUrl(image: MaistroImage) {
  const url = image.Urls?.Low || image.Urls?.Medium || image.Urls?.Optimized || image.Urls?.High;
  return url ? url : '';
}

function altFor(image: MaistroImage) {
  return image.Title || `Imagen ${image.ImageId}`;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    console.log('Failed to copy to clipboard');
  }
}

function ImageGridItem({
  image,
  onOpen,
  onDelete,
  isBusy,
  user,
}: {
  image: MaistroImage;
  onOpen: () => void;
  onDelete: () => void;
  isBusy: boolean;
  user: User;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div
        className="aspect-square w-full overflow-hidden bg-gray-100 cursor-pointer relative"
        onClick={onOpen}
      >
        {pickThumbUrl(image) ? (
          <img
            src={pickThumbUrl(image)}
            alt={altFor(image)}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <AestheticPlaceholder />
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            color={
              image.Status === 'READY' ? 'green' : image.Status === 'PROCESSING' ? 'orange' : 'red'
            }
            variant="solid"
            className="text-xs font-medium"
          >
            {image.Status === 'READY'
              ? 'Listo'
              : image.Status === 'PROCESSING'
                ? 'Procesando'
                : 'Error'}
          </Badge>
        </div>

        {/* Hover Overlay with Stats */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <Text size="2" className="text-white font-medium">
                {image.Views || 0}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Download size={16} />
              <Text size="2" className="text-white font-medium">
                {image.Downloads || 0}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Image Info */}
      <div className="p-4">
        {/* Header with user info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar
              src={user.avatar}
              fallback={user.name.charAt(0)}
              size="2"
              className="ring-2 ring-white shadow-sm"
            />
            <div>
              <Text size="2" weight="medium" className="text-gray-900">
                {user.name}
              </Text>
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar size={12} />
                <Text size="1">{formatDate(image.CreatedAt)}</Text>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="1"
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-gray-600"
          >
            <MoreHorizontal size={16} />
          </Button>
        </div>

        {/* Title */}
        {image.Title && (
          <Text size="3" weight="medium" className="text-gray-900 mb-2 line-clamp-2">
            {image.Title}
          </Text>
        )}

        {/* Description */}
        {image.Description && (
          <Text size="2" className="text-gray-600 mb-3 line-clamp-2">
            {image.Description}
          </Text>
        )}

        {/* Tags */}
        {image.Tags && image.Tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {image.Tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="soft" color="gray" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {image.Tags.length > 3 && (
              <Badge variant="soft" color="gray" className="text-xs">
                +{image.Tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="1"
              onClick={() => setIsLiked(!isLiked)}
              className={`${isLiked ? 'text-[#FF3366]' : 'text-gray-400 hover:text-[#FF3366]'} transition-colors`}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </Button>
            <Button
              variant="ghost"
              size="1"
              className="text-gray-400 hover:text-[#FF3366] transition-colors"
            >
              <Share2 size={16} />
            </Button>
            {image.Urls?.Optimized && (
              <Tooltip content="Copiar enlace">
                <Button
                  variant="ghost"
                  size="1"
                  onClick={() => copyToClipboard(image.Urls!.Optimized!)}
                  className="text-gray-400 hover:text-[#FF3366] transition-colors"
                >
                  <Copy size={16} />
                </Button>
              </Tooltip>
            )}
          </div>

          <div className="flex items-center gap-2">
            {image.Urls?.Optimized && (
              <Tooltip content="Abrir imagen">
                <Button
                  variant="soft"
                  size="1"
                  onClick={() => window.open(image.Urls!.Optimized!, '_blank')}
                  className="bg-[#FF3366]/10 text-[#FF3366] hover:bg-[#FF3366]/20"
                >
                  <ExternalLink size={14} />
                </Button>
              </Tooltip>
            )}
            <Tooltip content="Eliminar">
              <Button
                variant="soft"
                size="1"
                color="red"
                onClick={onDelete}
                disabled={isBusy}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InstagramGridView({
  images = sampleImages,
  onOpen,
  onDelete,
  busyIds = {},
  user = { name: 'Maistro User', avatar: undefined },
}: {
  images?: MaistroImage[];
  onOpen?: (i: number) => void;
  onDelete?: (id: string) => void;
  busyIds?: Record<string, boolean>;
  user?: User;
}) {
  const handleOpen = (index: number) => {
    if (onOpen) {
      onOpen(index);
    } else {
      console.log('Opening image at index:', index);
    }
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    } else {
      console.log('Deleting image:', id);
    }
  };

  if (images.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <Flex align="center" justify="center" className="p-12" direction="column" gap="4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF3366]/20 to-[#FF8A65]/20 flex items-center justify-center">
            <Image size={24} className="text-[#FF3366]" />
          </div>
          <Text size="4" weight="medium" className="text-gray-900">
            No hay imágenes todavía
          </Text>
          <Text size="3" className="text-gray-600 text-center">
            Sube tus primeras imágenes y aparecerán aquí en tu galería personal.
          </Text>
          <Button className="mt-2 bg-[#FF3366] hover:bg-[#FF3366]/90">
            <Image size={16} />
            Subir primera imagen
          </Button>
        </Flex>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-xl border border-gray-200">
        <div className="text-center">
          <Text size="4" weight="bold" className="text-[#FF3366] block">
            {images.length}
          </Text>
          <Text size="2" className="text-gray-600">
            Imágenes
          </Text>
        </div>
        <div className="text-center">
          <Text size="4" weight="bold" className="text-[#FF3366] block">
            {images.reduce((sum, img) => sum + (img.Views || 0), 0)}
          </Text>
          <Text size="2" className="text-gray-600">
            Visualizaciones
          </Text>
        </div>
        <div className="text-center">
          <Text size="4" weight="bold" className="text-[#FF3366] block">
            {images.reduce((sum, img) => sum + (img.Downloads || 0), 0)}
          </Text>
          <Text size="2" className="text-gray-600">
            Descargas
          </Text>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <ImageGridItem
            key={image.ImageId}
            image={image}
            onOpen={() => handleOpen(index)}
            onDelete={() => handleDelete(image.ImageId)}
            isBusy={!!busyIds[image.ImageId]}
            user={user}
          />
        ))}
      </div>
    </div>
  );
}

// Main component for demonstration
export default function MaistroImageGrid() {
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({});

  const handleDelete = (id: string) => {
    setBusyIds((prev) => ({ ...prev, [id]: true }));
    // Simulate API call
    setTimeout(() => {
      setBusyIds((prev) => ({ ...prev, [id]: false }));
      console.log('Image deleted:', id);
    }, 1000);
  };

  const handleOpen = (index: number) => {
    console.log('Opening image at index:', index);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Text size="8" weight="bold" className="text-gray-900 block mb-2">
            Mis Imágenes
          </Text>
          <Text size="4" className="text-gray-600">
            Gestiona tu galería de imágenes de Maistro
          </Text>
        </div>

        {/* Grid */}
        <InstagramGridView
          images={sampleImages}
          onOpen={handleOpen}
          onDelete={handleDelete}
          busyIds={busyIds}
          user={{ name: 'María González', avatar: undefined }}
        />
      </div>
    </div>
  );
}
