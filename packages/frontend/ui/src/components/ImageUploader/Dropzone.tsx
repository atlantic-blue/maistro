import React from "react";
import { Box, Text } from "@radix-ui/themes";

export function DropZone({ onFiles }: { onFiles: (fl: FileList | null) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current!;
    const prevent = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const onEnter = (e: DragEvent) => { prevent(e); setActive(true); };
    const onOver = (e: DragEvent) => { prevent(e); setActive(true); };
    const onLeave = (e: DragEvent) => { prevent(e); setActive(false); };
    const onDrop = (e: DragEvent) => {
      prevent(e); setActive(false);
      const dt = e.dataTransfer;
      onFiles(dt?.files ?? null);
    };
    el.addEventListener("dragenter", onEnter);
    el.addEventListener("dragover", onOver);
    el.addEventListener("dragleave", onLeave);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragenter", onEnter);
      el.removeEventListener("dragover", onOver);
      el.removeEventListener("dragleave", onLeave);
      el.removeEventListener("drop", onDrop);
    };
  }, [onFiles]);

  return (
    <Box
      ref={ref}
      style={{
        border: `2px dashed #FF3366`,
        background: active ? "rgba(255,51,102,0.06)" : "transparent",
        borderRadius: 16,
        padding: 24,
        textAlign: "center",
        margin: "10px",
      }}
    >
      <Text size="2" color="gray">
        Arrastra tus imágenes aquí o usa <Text weight="bold" color="crimson">Seleccionar archivos</Text>
      </Text>
    </Box>
  );
}