import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { MaistroImage } from "./types";
import { altFor, copyToClipboard, formatDate, pickLargeUrl } from "./utils";
import { Placeholder } from "./Placeholder";
import {
  ExternalLink,
  Copy,
  Download,
  CircleX,
  ArrowBigLeft,
  ArrowBigRight,
} from 'lucide-react';

export function ViewerDialog({
  open,
  onOpenChange,
  images,
  index,
  onIndexChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  images: MaistroImage[];
  index: number;
  onIndexChange: (i: number) => void;
}) {
  const total = images.length;
  const hasPrev = index > 0;
  const hasNext = index < total - 1;
  const current = images[index];

  const onPrev = () => hasPrev && onIndexChange(index - 1);
  const onNext = () => hasNext && onIndexChange(index + 1);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="350px" maxWidth="40%">
        {current ? (
          <Flex direction="column" gap="3">
            <Flex gap="3" justify="between">
            <Flex align="center" justify="between">
              <Text size="1" color="gray">
                {formatDate(current.CreatedAt)}
              </Text>
            </Flex>
			<Dialog.Close>
				<Button variant="soft" color="gray">
					<CircleX />
				</Button>
			</Dialog.Close>
		</Flex>
            {pickLargeUrl(current) ? (
              <div className="bg-black/80 rounded-xl overflow-hidden">
                <img
                  src={pickLargeUrl(current)!}
                  alt={altFor(current)}
                  className="w-full h-auto object-contain"
                />
              </div>
            ) : (
              <Placeholder label="Maistro" />
            )}
            <Flex align="center" justify="between" wrap="wrap" className="">
              <Flex gap="3">
                {current.Urls?.Optimized && (
                  <Button
                    size="1"
                    variant="soft"
                    onClick={() => window.open(`https://${current.Urls.Optimized}`!, '_blank')}
                  >
                    <ExternalLink size={16} />
                    &nbsp;Abrir
                  </Button>
                )}
                {current.Urls?.Optimized && (
                  <a href={`https://${current.Urls.Optimized}`} download>
                    <Button size="1" variant="soft">
                      <Download size={16} />
                      &nbsp;Descargar
                    </Button>
                  </a>
                )}
                {current.Urls?.Optimized && (
                  <Button
                    size="1"
                    variant="soft" onClick={() => copyToClipboard(`https://${current.Urls!.Optimized}`!)}>
                    <Copy size={16} />
                    &nbsp;Copiar link
                  </Button>
                )}
              </Flex>
            </Flex>

            <Flex gap="2" justify="between">
                <Button size="1" variant="soft" disabled={!hasPrev} onClick={onPrev}>
                  <ArrowBigLeft />
                </Button>
                <Button size="1" variant="soft" disabled={!hasNext} onClick={onNext}>
                  <ArrowBigRight />
                </Button>
            </Flex>
          </Flex>
        ) : (
          <Text>No hay imagen seleccionada</Text>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
