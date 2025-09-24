import { Card, Flex, MaistroImageUploader, Tabs, Text } from '@maistro/ui';
import ImageSelectorGrid from './ImageSelectorGrid';
import { useContext, useEffect, useState } from 'react';
import { MaistroImage } from '@/types';
import { useParams } from 'react-router';
import { BusinessProfile } from '../Businesses/types';
import { AuthContext } from '@maistro/auth';
import { getImages } from '@/Api/Images';
import env from '@/env';
import { Loader } from 'lucide-react';
import { normalizeMaistroImages } from './utils';

type ImageViewUploaderProps = {
  business: BusinessProfile;
  onChange: (images: MaistroImage[]) => void;
};

const ImageViewUploader: React.FC<ImageViewUploaderProps> = (props: ImageViewUploaderProps) => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);
  const [images, setImages] = useState<MaistroImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<MaistroImage[]>(
    normalizeMaistroImages(
      [
        props.business?.Images?.Main || '',
        ...(Array.isArray(props.business?.Images?.Gallery) ? props.business?.Images?.Gallery : []),
      ].filter(Boolean)
    ) as MaistroImage[]
  );
  const [isImagesLoading, setImagesLoading] = useState(false);

  const onRefresh = () => {
    if (!props.business || !user) return;
    setImagesLoading(true);
    getImages({
      Limit: 30,
      OwnerId: props.business.BusinessId,
      token: user.getTokenAccess(),
      url: env.api.images.getImages,
    })
      .then((res) => setImages(normalizeMaistroImages(res.images) as any))
      .finally(() => setImagesLoading(false));
  };

  useEffect(() => {
    onRefresh();
  }, [props.business.BusinessId]);

  if (!props.business || isLoading || !user) {
    return (
      <Card className="mb-3">
        <Flex align="center" justify="center" className="p-10" direction="column" gap="3">
          <Loader />
          <Text>Cargando...</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Tabs.Root defaultValue="selected">
      <div className="mb-4 flex gap-2 rounded-xl border border-neutral-200 bg-white p-1">
        <Tabs.List className="flex w-full gap-1">
          <Tabs.Trigger
            value="selected"
            className="flex-1 rounded-lg px-3 py-2 text-sm data-[state=active]:bg-neutral-100"
          >
            Seleccionar
          </Tabs.Trigger>
          <Tabs.Trigger
            value="upload"
            className="flex-1 rounded-lg px-3 py-2 text-sm data-[state=active]:bg-neutral-100"
          >
            Subir
          </Tabs.Trigger>
        </Tabs.List>
      </div>

      <Tabs.Content value="selected">
        <ImageSelectorGrid
          images={images}
          selectedImages={selectedImages}
          onRefresh={onRefresh}
          onChange={(images) => {
            setSelectedImages(images);
            props.onChange(images);
          }}
        />
      </Tabs.Content>
      <Tabs.Content value="upload">
        <MaistroImageUploader
          urls={{
            getPresignedUrl: env.api.images.getPresignedUrl,
            resize: env.api.images.resizeImages,
          }}
          token={user.getTokenAccess()}
          ownerId={props.business.BusinessId}
          ownerType="business"
          maxFileMB={5}
          onComplete={onRefresh}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default ImageViewUploader;
