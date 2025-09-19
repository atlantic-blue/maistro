import * as React from 'react';
import { MaistroImage } from './types';
import { getImages } from './api';
import { FeedView } from './FeedView';
import { ViewerDialog } from './ViewerDialog';

interface ImageGalleryProps {
  urls: {
    getImages: string;
  };
  token: string;
  ownerId: string;
}

export const MaistroImageGallery = ({ urls, token, ownerId }: ImageGalleryProps) => {
  const [images, setItmages] = React.useState<MaistroImage[]>([]);
  const [next, setNext] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const [hardRefreshKey, setHardRefreshKey] = React.useState(0);

  const load = React.useCallback(
    async (reset = false) => {
      if (loading) return;
      setLoading(true);
      setError(null);

      try {
        const response = await getImages({
          url: urls.getImages,
          token,
          Limit: 20,
          OwnerId: ownerId,
          Next: next,
        });

        setNext(response.next);
        setItmages((currentImages) => {
          if (reset) {
            return response.images;
          }

          return [...currentImages, ...response.images];
        });
      } catch (error: any) {
        setError(error.message ?? 'Error cargando galería');
      } finally {
        setLoading(false);
      }
    },
    [token, next, loading]
  );

  // Infinite scroll
  React.useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && next && !loading) {
            load(false);
          }
        }
      },
      { rootMargin: '800px' }
    );

    intersectionObserver.observe(node);
    return () => {
      intersectionObserver.disconnect();
    };
  }, [next, loading, load]);

  React.useEffect(() => {
    load(true);
  }, [hardRefreshKey]);

  const onDelete = () => {};
  const onOpen = (idx: number) => setSelectedIndex(idx);
  const closeViewer = () => setSelectedIndex(null);

  return (
    <div className="min-h-screen bg-[#FFF8F6]">
      <FeedView
        images={images}
        onDelete={onDelete}
        onOpen={onOpen}
        loading={loading}
      />

      <ViewerDialog
        open={selectedIndex !== null}
        onOpenChange={(o) => (o ? null : closeViewer())}
        images={images}
        index={selectedIndex ?? 0}
        onIndexChange={setSelectedIndex}
        />

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-12" />
    </div>
  );
};
