import React from "react";
import { Box, Button, Card, Flex, Progress, Text } from "@radix-ui/themes";
import { ItemState, UploadItem } from "./types";
import { formatBytes } from "./utils";

function labelForState(s: ItemState) {
  switch (s) {
    case "QUEUED": return "En cola";
    case "SIGNING": return "Solicitando URL…";
    case "UPLOADING": return "Subiendo…";
    case "PROCESSING": return "Procesando…";
    case "DONE": return "Listo";
    case "ERROR": return "Error";
    case "CANCELED": return "Cancelado";
    default: return s;
  }
}

export function ItemRow({ item, onCancel }: { item: UploadItem; onCancel: () => void }) {
  const stateColor: Record<ItemState, "gray" | "crimson" | "green" | "amber" | "red"> = {
    QUEUED: "gray",
    SIGNING: "amber",
    UPLOADING: "crimson",
    PROCESSING: "amber",
    DONE: "green",
    ERROR: "red",
    CANCELED: "gray",
  };

  const humanSpeed = item.speedBps ? formatBytes(item.speedBps) + "/s" : "";
  const humanEta = item.etaSec ? `${item.etaSec}s` : "";

  return (
    <Card className="my-3">
      <Flex align="center" gap="3">
        <img
          src={item.previewUrl}
          alt={item.file.name}
          style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 12, border: "1px solid #eee" }}
        />
        <Box style={{ flex: 1 }}>
          <Flex justify="between" align="center">
            <Text weight="bold">{item.file.name}</Text>
            <Text color="gray">{formatBytes(item.file.size)}</Text>
          </Flex>
          <Progress value={item.progress} color={stateColor[item.state]} mt="2" />
          <Flex justify="between" mt="1">
            <Text size="1" color="gray">
              {labelForState(item.state)} {item.message ? `· ${item.message}` : ""}
            </Text>
            <Text size="1" color="gray">
              {item.state === "UPLOADING" && (humanSpeed || humanEta) ? `${humanSpeed} · ${humanEta}` : ""}
            </Text>
          </Flex>
        </Box>
        <Flex direction="column" gap="2">
          {(item.state === "UPLOADING" || item.state === "SIGNING") && (
            <Button color="red" variant="soft" onClick={onCancel}>Cancelar</Button>
          )}
          {item.state === "DONE" && item.urls?.Optimised && (
            <a href={item.urls.Optimised} target="_blank" rel="noreferrer">
              <Button variant="soft">Ver</Button>
            </a>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}