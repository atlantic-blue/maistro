import { Badge, Text, Button, Card, Flex, Box } from '@radix-ui/themes';
import { Image as ImageIcon, Ellipsis, Loader } from 'lucide-react';
import { MaistroImage } from './types';
import { Placeholder } from './Placeholder';
import { altFor, formatDate, pickLargeUrl } from './utils';

export function FeedView({
  images,
  onOpen,
  loading,
}: {
  images: MaistroImage[];
  onOpen: (i: number) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  return (
    <div className="flex gap-4 rt-r-fw-wrap" style={{ justifyContent: 'space-evenly' }}>
      {images.map((image, i) => (
        <Card
          key={image.ImageId}
          className="!border !border-neutral-200 !shadow-md mb-3"
          style={{ width: '350px' }}
          onClick={() => onOpen(i)}
        >
          <Flex direction="column">
            <Flex align="center" justify="between" className="mb-3">
              <Flex align="center" gap="3">
                <Box>
                  <Text className="rt-r-pr-1" weight="bold">
                    @{image.ImageId.slice(0, 6)}
                  </Text>
                  <Text size="1" color="gray">
                    {formatDate(image.CreatedAt)}
                  </Text>
                </Box>
              </Flex>
              <Badge color={image.Status === 'READY' ? 'green' : 'amber'}>{image.Status}</Badge>
              <Button variant="outline" onClick={() => onOpen(i)}>
                <Ellipsis />
              </Button>
            </Flex>
            <div className="bg-neutral-100">
              {pickLargeUrl(image) ? (
                <img
                  src={pickLargeUrl(image)!}
                  alt={altFor(image)}
                  className="w-full object-contain max-h-[80vh] bg-black/5"
                  loading="lazy"
                />
              ) : (
                <Placeholder label="Maistro" />
              )}
            </div>
          </Flex>
        </Card>
      ))}
      {images.length === 0 && (
        <Card className="mb-3">
          <Flex align="center" justify="center" className="p-10" direction="column" gap="3">
            {loading ? <Loader /> : <ImageIcon />}
            <Text color="gray">{loading ? 'Cargando...' : 'No hay publicaciones aún.'}</Text>
          </Flex>
        </Card>
      )}
    </div>
  );
}
