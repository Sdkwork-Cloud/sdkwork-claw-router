import type { LocalApiCapability } from "../types/localApiProxyTypes.ts";

export type LocalApiProxyRouteGroupId =
  | "text-and-chat"
  | "compat-and-model"
  | "embedding-and-moderation"
  | "image-and-audio"
  | "files-and-batches"
  | "vector-and-search"
  | "custom";

export interface LocalApiProxyRouteGroup {
  id: LocalApiProxyRouteGroupId;
  capabilityFamilies: LocalApiCapability[];
  operationIds: string[];
}

export const LOCAL_API_PROXY_ROUTE_GROUPS = [
  {
    id: "text-and-chat",
    capabilityFamilies: ["chat", "response"],
  },
  {
    id: "compat-and-model",
    capabilityFamilies: ["model-catalog"],
  },
  {
    id: "embedding-and-moderation",
    capabilityFamilies: ["embedding", "moderation"],
  },
  {
    id: "image-and-audio",
    capabilityFamilies: [
      "image-generation",
      "image-edit",
      "audio-speech",
      "audio-transcription",
      "audio-translation",
    ],
  },
  {
    id: "files-and-batches",
    capabilityFamilies: ["file-transfer", "batch"],
  },
  {
    id: "vector-and-search",
    capabilityFamilies: ["vector-store", "search", "rerank"],
  },
  {
    id: "custom",
    capabilityFamilies: ["custom"],
  },
] as const satisfies readonly Omit<LocalApiProxyRouteGroup, "operationIds">[];
