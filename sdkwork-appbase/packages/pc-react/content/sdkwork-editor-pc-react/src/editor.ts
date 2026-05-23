export type SdkworkEditorDocumentMode = "code" | "markdown" | "rich-text";
export type SdkworkEditorDocumentStatus = "draft" | "published" | "review";
export type SdkworkEditorSortBy = "alphabetical" | "recent" | "priority";

export interface SdkworkEditorDocument {
  id: string;
  mode: SdkworkEditorDocumentMode;
  path: string;
  status: SdkworkEditorDocumentStatus;
  summary: string;
  tags: string[];
  title: string;
  updatedAt: string;
  wordCount: number;
}

export interface SdkworkEditorDigest {
  activeDrafts: number;
  modeSummary: Record<SdkworkEditorDocumentMode, number>;
  reviewedDocuments: number;
  totalDocuments: number;
}

export interface SdkworkEditorWorkspaceData {
  digest: SdkworkEditorDigest;
  documents: SdkworkEditorDocument[];
  isAuthenticated: boolean;
}

export interface SdkworkEditorCapabilityManifest {
  description: string;
  host?: string;
  id: string;
  packageNames: string[];
  theme?: string;
  title: string;
}

export interface SdkworkEditorWorkspaceManifest extends SdkworkEditorCapabilityManifest {
  capability: "editor";
  routePath: string;
}

export interface CreateEditorWorkspaceManifestOptions
  extends Partial<
    Pick<SdkworkEditorCapabilityManifest, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkEditorRouteIntent {
  documentId?: string;
  focusWindow: boolean;
  mode?: SdkworkEditorDocumentMode;
  route: string;
  source: "editor-workspace";
  type: "editor-route-intent";
}

export interface CreateEditorRouteIntentOptions {
  basePath?: string;
  documentId?: string;
  focusWindow?: boolean;
  mode?: SdkworkEditorDocumentMode;
}

export interface CreateEmptySdkworkEditorWorkspaceOptions {
  documents?: readonly SdkworkEditorDocument[];
  isAuthenticated?: boolean;
}

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/editor").trim();
  if (!normalized || normalized === "/") {
    return "/editor";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function createDocument(
  id: string,
  input: Omit<SdkworkEditorDocument, "id">,
): SdkworkEditorDocument {
  return {
    id,
    ...input,
  };
}

export function createDefaultSdkworkEditorDocuments(): SdkworkEditorDocument[] {
  return [
    createDocument("guide-release-flow", {
      mode: "markdown",
      path: "/docs/release-flow.md",
      status: "review",
      summary: "Team-facing release checklist and approval sequence.",
      tags: ["release", "workflow"],
      title: "Release Flow Guide",
      updatedAt: "2026-04-02T10:30:00.000Z",
      wordCount: 1210,
    }),
    createDocument("plugin-sandbox-policy", {
      mode: "rich-text",
      path: "/policies/plugin-sandbox-policy",
      status: "published",
      summary: "Policy document that defines plugin runtime and signing boundaries.",
      tags: ["policy", "security"],
      title: "Plugin Sandbox Policy",
      updatedAt: "2026-03-28T08:45:00.000Z",
      wordCount: 860,
    }),
    createDocument("agent-ops-script", {
      mode: "code",
      path: "/scripts/agent-ops.ts",
      status: "draft",
      summary: "Automation script for deterministic post-build checks and summaries.",
      tags: ["ops", "automation"],
      title: "Agent Ops Script",
      updatedAt: "2026-04-03T02:20:00.000Z",
      wordCount: 420,
    }),
    createDocument("prompt-style-guide", {
      mode: "markdown",
      path: "/docs/prompt-style-guide.md",
      status: "draft",
      summary: "Prompting style guide with tone, review, and verification heuristics.",
      tags: ["prompt", "guide"],
      title: "Prompt Style Guide",
      updatedAt: "2026-03-30T13:10:00.000Z",
      wordCount: 1530,
    }),
  ];
}

export function sortSdkworkEditorDocuments(
  documents: readonly SdkworkEditorDocument[],
  sortBy: SdkworkEditorSortBy = "recent",
): SdkworkEditorDocument[] {
  return [...documents].sort((left, right) => {
    if (sortBy === "alphabetical") {
      return left.title.localeCompare(right.title);
    }

    if (sortBy === "priority") {
      return Number(right.status === "draft") - Number(left.status === "draft")
        || Number(right.status === "review") - Number(left.status === "review")
        || toTimestamp(right.updatedAt) - toTimestamp(left.updatedAt);
    }

    return toTimestamp(right.updatedAt) - toTimestamp(left.updatedAt)
      || left.title.localeCompare(right.title);
  });
}

export function summarizeSdkworkEditorWorkspace(
  documents: readonly SdkworkEditorDocument[],
): SdkworkEditorDigest {
  const modeSummary = documents.reduce<Record<SdkworkEditorDocumentMode, number>>(
    (summary, document) => {
      summary[document.mode] += 1;
      return summary;
    },
    {
      code: 0,
      markdown: 0,
      "rich-text": 0,
    },
  );

  return {
    activeDrafts: documents.filter((document) => document.status === "draft").length,
    modeSummary,
    reviewedDocuments: documents.filter((document) => document.status === "review").length,
    totalDocuments: documents.length,
  };
}

export function createEmptySdkworkEditorWorkspace(
  options: CreateEmptySdkworkEditorWorkspaceOptions = {},
): SdkworkEditorWorkspaceData {
  const documents = sortSdkworkEditorDocuments(
    options.documents?.length ? options.documents : createDefaultSdkworkEditorDocuments(),
    "recent",
  );

  return {
    digest: summarizeSdkworkEditorWorkspace(documents),
    documents,
    isAuthenticated: Boolean(options.isAuthenticated),
  };
}

export function createEditorWorkspaceManifest({
  description = "Editor capability with deterministic document catalogs, mode-aware filtering, and reusable route intents.",
  host,
  id = "sdkwork-editor",
  packageNames = [
    "@sdkwork/editor-pc-react",
    "@sdkwork/notes-pc-react",
  ],
  routePath = "/editor",
  theme,
  title = "Editor Center",
}: CreateEditorWorkspaceManifestOptions = {}): SdkworkEditorWorkspaceManifest {
  return {
    capability: "editor",
    description,
    ...(host ? { host } : {}),
    id,
    packageNames: [...packageNames],
    routePath: normalizeBasePath(routePath),
    ...(theme ? { theme } : {}),
    title,
  };
}

export function createEditorRouteIntent(
  options: CreateEditorRouteIntentOptions = {},
): SdkworkEditorRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const params = new URLSearchParams();

  if (options.mode) {
    params.set("mode", options.mode);
  }
  if (options.documentId) {
    params.set("documentId", options.documentId);
  }

  return {
    ...(options.documentId ? { documentId: options.documentId } : {}),
    focusWindow: options.focusWindow !== false,
    ...(options.mode ? { mode: options.mode } : {}),
    route: params.toString() ? `${basePath}?${params.toString()}` : basePath,
    source: "editor-workspace",
    type: "editor-route-intent",
  };
}

export const editorPackageMeta = {
  architecture: "pc-react",
  domain: "content",
  package: "@sdkwork/editor-pc-react",
  status: "ready",
} as const;

export type EditorPackageMeta = typeof editorPackageMeta;
