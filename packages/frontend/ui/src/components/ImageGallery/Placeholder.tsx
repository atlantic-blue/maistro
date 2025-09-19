import { Text } from '@radix-ui/themes';
import { Image as ImageIcon } from 'lucide-react';

export function Placeholder({
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
