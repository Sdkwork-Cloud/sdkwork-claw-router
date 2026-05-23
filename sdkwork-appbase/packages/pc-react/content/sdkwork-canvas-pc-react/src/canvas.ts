export type SdkworkCanvasNodeKind = "asset" | "logic" | "prompt" | "result";
export type SdkworkCanvasNodeStatus = "active" | "blocked" | "idle";

export interface SdkworkCanvasNode {
  id: string;
  kind: SdkworkCanvasNodeKind;
  status: SdkworkCanvasNodeStatus;
  title: string;
  x: number;
  y: number;
}

export interface SdkworkCanvasEdge {
  fromNodeId: string;
  id: string;
  toNodeId: string;
}

export interface SdkworkCanvasBoard {
  edges: SdkworkCanvasEdge[];
  id: string;
  nodes: SdkworkCanvasNode[];
  title: string;
  updatedAt: string;
}

export interface SdkworkCanvasDigest {
  activeBoards: number;
  totalBoards: number;
  totalEdges: number;
  totalNodes: number;
}

export interface SdkworkCanvasWorkspaceData {
  boards: SdkworkCanvasBoard[];
  digest: SdkworkCanvasDigest;
  isAuthenticated: boolean;
}

export interface SdkworkCanvasCapabilityManifest {
  description: string;
  host?: string;
  id: string;
  packageNames: string[];
  theme?: string;
  title: string;
}

export interface SdkworkCanvasWorkspaceManifest extends SdkworkCanvasCapabilityManifest {
  capability: "canvas";
  routePath: string;
}

export interface CreateCanvasWorkspaceManifestOptions
  extends Partial<
    Pick<SdkworkCanvasCapabilityManifest, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkCanvasRouteIntent {
  boardId?: string;
  focusWindow: boolean;
  route: string;
  source: "canvas-workspace";
  type: "canvas-route-intent";
}

export interface CreateCanvasRouteIntentOptions {
  basePath?: string;
  boardId?: string;
  focusWindow?: boolean;
}

export interface CreateEmptySdkworkCanvasWorkspaceOptions {
  boards?: readonly SdkworkCanvasBoard[];
  isAuthenticated?: boolean;
}

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/canvas").trim();
  if (!normalized || normalized === "/") {
    return "/canvas";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function createDefaultSdkworkCanvasBoards(): SdkworkCanvasBoard[] {
  return [
    {
      edges: [
        { fromNodeId: "node-input", id: "edge-1", toNodeId: "node-prompt" },
        { fromNodeId: "node-prompt", id: "edge-2", toNodeId: "node-result" },
      ],
      id: "board-generation-flow",
      nodes: [
        { id: "node-input", kind: "asset", status: "active", title: "Input Assets", x: 80, y: 120 },
        { id: "node-prompt", kind: "prompt", status: "active", title: "Prompt Composer", x: 320, y: 160 },
        { id: "node-result", kind: "result", status: "idle", title: "Result Bundle", x: 560, y: 200 },
      ],
      title: "Generation Flow",
      updatedAt: "2026-04-03T02:00:00.000Z",
    },
    {
      edges: [
        { fromNodeId: "node-capture", id: "edge-3", toNodeId: "node-logic" },
      ],
      id: "board-notes-pipeline",
      nodes: [
        { id: "node-capture", kind: "asset", status: "active", title: "Capture", x: 120, y: 100 },
        { id: "node-logic", kind: "logic", status: "blocked", title: "Normalize", x: 360, y: 180 },
      ],
      title: "Notes Pipeline",
      updatedAt: "2026-04-01T02:00:00.000Z",
    },
  ];
}

export function sortSdkworkCanvasBoards(
  boards: readonly SdkworkCanvasBoard[],
): SdkworkCanvasBoard[] {
  return [...boards].sort(
    (left, right) =>
      toTimestamp(right.updatedAt) - toTimestamp(left.updatedAt)
      || left.title.localeCompare(right.title),
  );
}

export function summarizeSdkworkCanvasWorkspace(
  boards: readonly SdkworkCanvasBoard[],
): SdkworkCanvasDigest {
  const totalNodes = boards.reduce((total, board) => total + board.nodes.length, 0);
  const totalEdges = boards.reduce((total, board) => total + board.edges.length, 0);

  return {
    activeBoards: boards.filter((board) => board.nodes.some((node) => node.status === "active")).length,
    totalBoards: boards.length,
    totalEdges,
    totalNodes,
  };
}

export function createEmptySdkworkCanvasWorkspace(
  options: CreateEmptySdkworkCanvasWorkspaceOptions = {},
): SdkworkCanvasWorkspaceData {
  const boards = sortSdkworkCanvasBoards(
    options.boards?.length ? options.boards : createDefaultSdkworkCanvasBoards(),
  );

  return {
    boards,
    digest: summarizeSdkworkCanvasWorkspace(boards),
    isAuthenticated: Boolean(options.isAuthenticated),
  };
}

export function createCanvasWorkspaceManifest({
  description = "Canvas capability with deterministic boards, node inspection, and board routing intents.",
  host,
  id = "sdkwork-canvas",
  packageNames = [
    "@sdkwork/canvas-pc-react",
    "@sdkwork/generation-pc-react",
  ],
  routePath = "/canvas",
  theme,
  title = "Canvas Workspace",
}: CreateCanvasWorkspaceManifestOptions = {}): SdkworkCanvasWorkspaceManifest {
  return {
    capability: "canvas",
    description,
    ...(host ? { host } : {}),
    id,
    packageNames: [...packageNames],
    routePath: normalizeBasePath(routePath),
    ...(theme ? { theme } : {}),
    title,
  };
}

export function createCanvasRouteIntent(
  options: CreateCanvasRouteIntentOptions = {},
): SdkworkCanvasRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const params = new URLSearchParams();
  if (options.boardId) {
    params.set("boardId", options.boardId);
  }

  return {
    ...(options.boardId ? { boardId: options.boardId } : {}),
    focusWindow: options.focusWindow !== false,
    route: params.toString() ? `${basePath}?${params.toString()}` : basePath,
    source: "canvas-workspace",
    type: "canvas-route-intent",
  };
}

export const canvasPackageMeta = {
  architecture: "pc-react",
  domain: "content",
  package: "@sdkwork/canvas-pc-react",
  status: "ready",
} as const;

export type CanvasPackageMeta = typeof canvasPackageMeta;
