import * as React from 'react';
import {
Theme,
Card,
Flex,
Box,
Button,
Text,
Callout,
Separator,
Avatar,
Dialog,
SegmentedControl,
Tooltip,
Badge,
} from '@radix-ui/themes';
import {
Image as ImageIcon,
Trash2,
ExternalLink,
Copy,
Download,
LayoutGrid,
List,
RefreshCw,
} from 'lucide-react';
import { MaistroImage } from './types';
import { getImages } from './api';
import { GridView } from './GridView';


interface ImageGalleryProps {
    urls: {
        getImages: string,
    }
    token: string
    ownerId: string
}

export const MaistroImageGallery = ({
    urls,
    token,
    ownerId,
}: ImageGalleryProps) => {
    const [mode, setMode] = React.useState<'grid' | 'feed'>('grid');
    const [images, setItmages] = React.useState<MaistroImage[]>([]);
    const [next, setNext] = React.useState<string | undefined>(undefined);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
    const sentinelRef = React.useRef<HTMLDivElement | null>(null);
    const [hardRefreshKey, setHardRefreshKey] = React.useState(0);
    const [busyIds, setBusyIds] = React.useState<Record<string, boolean>>({}); // for delete spinners

    const load = React.useCallback(async (reset = false) => {
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
            })

            setNext(response.next)
            setItmages(currentImages => {
                if(reset) {
                    return response.images
                }

                return [
                    ...currentImages,
                    ...response.images,
                ]
            })
        } catch (error: any) {
            setError(error.message ?? 'Error cargando galería');
        } finally {
            setLoading(false);
        }
    }, [token, next, loading])

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
            }, { rootMargin: '800px' }
        );

        intersectionObserver.observe(node);
        return () => {
            intersectionObserver.disconnect();
        }
    }, [next, loading, load])


    React.useEffect(() => { load(true); }, [hardRefreshKey]);

    const refresh = () => setHardRefreshKey((k) => k + 1);

    const onOpen = () => {}
    const onDelete = ()=> {}

    return (
        <div className="min-h-screen bg-[#FFF8F6]">
            <div className="mx-auto max-w-6xl px-4 py-6">
                {/* Header */}
                <Card className="!border !border-neutral-200 !shadow-md">
                    <Flex align="center" justify="between" className="p-4">
                    <Flex align="center" gap="3">
                    <Avatar fallback="M" size="3" />
                    <Box>
                    <Text size="5" weight="bold">Tu galería</Text>
                    <Text size="2" color="gray">Social style · Maistro</Text>
                    </Box>
                    </Flex>
                    <Flex align="center" gap="3">
                    <SegmentedControl.Root value={mode} onValueChange={(v) => setMode(v as any)}>
                    <SegmentedControl.Item value="grid"><LayoutGrid size={16} />&nbsp;Grid</SegmentedControl.Item>
                    <SegmentedControl.Item value="feed"><List size={16} />&nbsp;Feed</SegmentedControl.Item>
                    </SegmentedControl.Root>
                    <Button onClick={refresh} variant="soft"><RefreshCw size={16} />&nbsp;Actualizar</Button>
                    </Flex>
                    </Flex>
                
                {error && (
                <Box className="px-4 pb-4">
                <Callout.Root color="red"><Callout.Text>{error}</Callout.Text></Callout.Root>
                </Box>
                )}
                </Card>

                <Separator my="4" />

                <GridView images={images} onOpen={onOpen} onDelete={onDelete} busyIds={busyIds} />

                {/* {mode === 'grid' ? (
                    
                    ) : (
                    <FeedView items={images} onOpen={openAt} onDelete={onDelete} busyIds={busyIds} />
                    )
                } */}

                {/* Sentinel for infinite scroll */}
                <div ref={sentinelRef} className="h-12" />

            </div>
        </div>
    )
}