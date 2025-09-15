import React from "react";
import { OwnerType, UploadItem } from "./types";
import { createErrorItem, getItem, updateItem, uuid } from "./utils";
import { getPresignedUrl, resizeImage } from "./api";
import { Avatar, Box, Button, Card, Flex, Theme, Text, Callout, Progress, Separator } from "@radix-ui/themes";
import { DropZone } from "./Dropzone";
import { ItemRow } from "./Row";


type Props = {
  urls: {
    getPresignedUrl: string,
    resize: string
  }
  ownerType: OwnerType;    // "user" | "business"
  ownerId: string;         // current owner id
  maxFileMB?: number;      // default 5
  token: string
};

export function MaistroImageUploader({
  urls,
  ownerType,
  ownerId,
  maxFileMB = 5,
  token,
}: Props) {
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const MAX_BYTES = maxFileMB * 1024 * 1024;

  const addFiles = (files: FileList | null) => {
    if (!files) return;

    const next: UploadItem[] = [];
    for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
        next.push(createErrorItem(file, "Only image files are allowed."));
        continue;
        }

        if (file.size > MAX_BYTES) {
        next.push(createErrorItem(file, `File is too large. Max ${maxFileMB} MB.`));
        continue;
        }

        next.push({
            id: uuid(),
            file: file,
            previewUrl: URL.createObjectURL(file),
            state: "QUEUED",
            progress: 0,
        });
    }

    setItems((prev) => [...next, ...prev]);
  }

  const handleUpload = async (id: string) => {
    const item = getItem(items, id);
    if (!item) {
        console.log("No Item found", id)
        return 
    };

    if ([
      "DONE",
      "UPLOADING",
      "PROCESSING",
      "ERROR",
      "CANCELED"
    ].includes(item.state)) {
      console.log(`Aborting Item ${item.id} | State: ${item.state}`)
      return
    }

    setItems((prev) => {
        return updateItem(
            prev,
            id,
            { state: "SIGNING", progress: 0, message: "" })
    });

    try {
        // 1) Ask backend for presigned POST
        const response = await getPresignedUrl({
            url: urls.getPresignedUrl,
            item,
            OwnerId: ownerId,
            OwnerType: ownerType,
            token,
        })

        const s3Key = response.PresignedUrl.fields.Key;

        setItems((current) => updateItem(current, id, {
            imageId: response.ImageId,
            urls: response.Urls
        }));

        // 2) POST file to S3 with progress
        const form = new FormData();
        Object.entries(response.PresignedUrl.fields).forEach(([k, v]) => form.append(k, v));
        form.append("file", item.file);

        const xhr = new XMLHttpRequest();
        const startedAt = Date.now();
        setItems((current) => updateItem(current, id, { state: "UPLOADING", xhr, progress: 0 }));

        xhr.upload.onprogress = (evt) => {
            if (!evt.lengthComputable) return;

            const percentage = Math.max(0, Math.min(100, Math.round((evt.loaded / evt.total) * 100)));
            const elapsedSec = (Date.now() - startedAt) / 1000;
            const speed = evt.loaded / Math.max(1, elapsedSec); // bytes/s
            const remaining = evt.total - evt.loaded;
            const eta = remaining > 0 && speed > 0 ? Math.round(remaining / speed) : 0;

            setItems((current) => updateItem(current, id, { progress: percentage, speedBps: speed, etaSec: eta }));
        }

        xhr.onerror = () => {
            setItems((current) =>
                updateItem(current, id, { state: "ERROR", message: "Network error while uploading", xhr: undefined })
            );
        };

        xhr.onload = async () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                // S3 usually returns 204 for successful POST
                setItems((item) => updateItem(item, id, { state: "DONE", progress: 100, xhr: undefined, s3Key }));

                // 3) Manually trigger resize
                const reponse = await resizeImage({
                    url: urls.resize,
                    key: `${ownerType === "user" ? "users" : "businesses"}/${ownerId}/${response.ImageId}/original.bin`,
                    token,
                }).catch((e) =>
                    setItems((cur) => updateItem(cur, id, { state: "ERROR", message: e.message }))
                );
            }
        }

        xhr.open("POST", response.PresignedUrl.url);
        xhr.send(form);
    } catch (error: any) {
        setItems((cur) => updateItem(cur, id, { state: "ERROR", message: error.message || "Upload failed" }));
    }
  }

  const startAll = async () => {
    setError(null);

    for (const item of items) {
        if (item.state !== "QUEUED" && item.state !== "ERROR") {
            continue
        };

        await handleUpload(item.id);
    }
  }

  const cancelItem = (id: string) => {
    setItems((current) => {
      const item = getItem(current, id)
      if (item?.xhr && (item.state === "SIGNING" || item.state === "UPLOADING")) {
        try { item.xhr.abort(); } catch {}
      }
      return updateItem(current, id, { state: "CANCELED", message: "Canceled", xhr: undefined, progress: 0 });
    });
  };

  const clearDone = () => {
    setItems([]);
  }

  const totalPct = React.useMemo(() => {
    if (items.length === 0) {
      return 0;
    }

    const active = items.filter((item) => ["UPLOADING", "PROCESSING", "SIGNING"].includes(item.state));
    if (active.length === 0) {
      return 0;
    }

    const sum = active.reduce((acc, it) => acc + (it.state === "PROCESSING" ? 100 : it.progress), 0);
    return Math.round(sum / active.length);
  }, [items]);

  return (
    <Theme appearance="light" accentColor="crimson" grayColor="sand" radius="large" scaling="100%">
      <Card
        style={{
          background: "#FFF8F6", // Maistro off-white
          border: "1px solid #eee",
          boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
        }}
      >
        <Flex direction="column" gap="4">
          <Flex align="center" justify="between" direction="column" gap="3">
            <Flex align="center"  direction="column" gap="3">
                <Text size="5" weight="bold">Sube tus imágenes</Text>
                <Text size="2" color="gray">Hasta {maxFileMB} MB por archivo · Formatos: cualquier imagen</Text>
            </Flex>
            <Flex gap="4" className="mb-5" align="center">
              <Button variant="solid" onClick={() => inputRef.current?.click()} style={{ background: "#FF3366" }}>
                Seleccionar archivos
              </Button>
              <Button variant="soft" onClick={startAll}>Subir</Button>
              <Button variant="ghost" onClick={clearDone}>Limpiar</Button>
            </Flex>
          </Flex>
        </Flex>

        <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => addFiles(e.target.files)}
          />

        <Flex align="center" justify="center">
        <DropZone onFiles={addFiles} />
        </Flex>

        {error && (
            <Callout.Root color="red">
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

        <Box>
            <Text size="2" weight="bold">Progreso total</Text>
            <Progress value={totalPct} radius="full" mt="2" />
        </Box>

        <Flex className="py-6" direction="column">
            {items.map((item, index) => (
              <ItemRow key={`${item.id}-${index}`} item={item} onCancel={() => cancelItem(item.id)} />
            ))}
            {items.length === 0 && (
              <Text className="py-3" color="gray">No hay archivos aún. Usa “Seleccionar archivos” o arrastra aquí.</Text>
            )}
          </Flex>
      </Card>
    </Theme>
  )
}