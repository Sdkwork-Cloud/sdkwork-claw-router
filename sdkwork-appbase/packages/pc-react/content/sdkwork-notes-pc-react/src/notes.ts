export type SdkworkNoteVisibility = "private" | "shared" | "workspace";
export type SdkworkNoteSortBy = "alphabetical" | "recent" | "starred";

export interface SdkworkNoteNotebook {
  id: string;
  title: string;
}

export interface SdkworkNoteEntry {
  id: string;
  notebookId: string;
  preview: string;
  starred: boolean;
  tags: string[];
  title: string;
  updatedAt: string;
  visibility: SdkworkNoteVisibility;
}

export interface SdkworkNotesDigest {
  notebookCount: number;
  sharedNotes: number;
  starredNotes: number;
  totalNotes: number;
}

export interface SdkworkNotesWorkspaceData {
  digest: SdkworkNotesDigest;
  isAuthenticated: boolean;
  notebooks: SdkworkNoteNotebook[];
  notes: SdkworkNoteEntry[];
}

export interface SdkworkNotesCapabilityManifest {
  description: string;
  host?: string;
  id: string;
  packageNames: string[];
  theme?: string;
  title: string;
}

export interface SdkworkNotesWorkspaceManifest extends SdkworkNotesCapabilityManifest {
  capability: "notes";
  routePath: string;
}

export interface CreateNotesWorkspaceManifestOptions
  extends Partial<
    Pick<SdkworkNotesCapabilityManifest, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkNotesRouteIntent {
  focusWindow: boolean;
  notebookId?: string;
  route: string;
  source: "notes-workspace";
  type: "notes-route-intent";
}

export interface CreateNotesRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  notebookId?: string;
}

export interface CreateEmptySdkworkNotesWorkspaceOptions {
  isAuthenticated?: boolean;
  notebooks?: readonly SdkworkNoteNotebook[];
  notes?: readonly SdkworkNoteEntry[];
}

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/notes").trim();
  if (!normalized || normalized === "/") {
    return "/notes";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function createDefaultSdkworkNotebooks(): SdkworkNoteNotebook[] {
  return [
    { id: "workspace-playbooks", title: "Workspace Playbooks" },
    { id: "prompt-research", title: "Prompt Research" },
    { id: "handoff-notes", title: "Handoff Notes" },
  ];
}

export function createDefaultSdkworkNotes(): SdkworkNoteEntry[] {
  return [
    {
      id: "note-release-review",
      notebookId: "workspace-playbooks",
      preview: "Keep regression checklist deterministic and run package-local type checks first.",
      starred: true,
      tags: ["release", "review"],
      title: "Release Review Protocol",
      updatedAt: "2026-04-03T01:00:00.000Z",
      visibility: "workspace",
    },
    {
      id: "note-prompt-tone",
      notebookId: "prompt-research",
      preview: "Premium desktop tone: concise narrative + high signal metrics at top.",
      starred: false,
      tags: ["prompt", "tone"],
      title: "Prompt Tone Findings",
      updatedAt: "2026-04-02T08:00:00.000Z",
      visibility: "shared",
    },
    {
      id: "note-agent-handoff",
      notebookId: "handoff-notes",
      preview: "Capture changed paths, verification commands, and outstanding risks in final response.",
      starred: true,
      tags: ["handoff"],
      title: "Agent Handoff Template",
      updatedAt: "2026-03-30T08:00:00.000Z",
      visibility: "private",
    },
  ];
}

export function sortSdkworkNotes(
  notes: readonly SdkworkNoteEntry[],
  sortBy: SdkworkNoteSortBy = "recent",
): SdkworkNoteEntry[] {
  return [...notes].sort((left, right) => {
    if (sortBy === "alphabetical") {
      return left.title.localeCompare(right.title);
    }

    if (sortBy === "starred") {
      return Number(right.starred) - Number(left.starred)
        || toTimestamp(right.updatedAt) - toTimestamp(left.updatedAt);
    }

    return toTimestamp(right.updatedAt) - toTimestamp(left.updatedAt);
  });
}

export function summarizeSdkworkNotesWorkspace(
  notes: readonly SdkworkNoteEntry[],
  notebooks: readonly SdkworkNoteNotebook[],
): SdkworkNotesDigest {
  return {
    notebookCount: notebooks.length,
    sharedNotes: notes.filter((note) => note.visibility === "shared" || note.visibility === "workspace").length,
    starredNotes: notes.filter((note) => note.starred).length,
    totalNotes: notes.length,
  };
}

export function createEmptySdkworkNotesWorkspace(
  options: CreateEmptySdkworkNotesWorkspaceOptions = {},
): SdkworkNotesWorkspaceData {
  const notebooks = options.notebooks?.length ? [...options.notebooks] : createDefaultSdkworkNotebooks();
  const notes = sortSdkworkNotes(options.notes?.length ? options.notes : createDefaultSdkworkNotes(), "recent");

  return {
    digest: summarizeSdkworkNotesWorkspace(notes, notebooks),
    isAuthenticated: Boolean(options.isAuthenticated),
    notebooks,
    notes,
  };
}

export function createNotesWorkspaceManifest({
  description = "Notes capability for reusable notebook rails, deterministic note summaries, and route intent helpers.",
  host,
  id = "sdkwork-notes",
  packageNames = [
    "@sdkwork/notes-pc-react",
    "@sdkwork/editor-pc-react",
  ],
  routePath = "/notes",
  theme,
  title = "Notes Workspace",
}: CreateNotesWorkspaceManifestOptions = {}): SdkworkNotesWorkspaceManifest {
  return {
    capability: "notes",
    description,
    ...(host ? { host } : {}),
    id,
    packageNames: [...packageNames],
    routePath: normalizeBasePath(routePath),
    ...(theme ? { theme } : {}),
    title,
  };
}

export function createNotesRouteIntent(
  options: CreateNotesRouteIntentOptions = {},
): SdkworkNotesRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const params = new URLSearchParams();
  if (options.notebookId) {
    params.set("notebookId", options.notebookId);
  }

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.notebookId ? { notebookId: options.notebookId } : {}),
    route: params.toString() ? `${basePath}?${params.toString()}` : basePath,
    source: "notes-workspace",
    type: "notes-route-intent",
  };
}

export const notesPackageMeta = {
  architecture: "pc-react",
  domain: "content",
  package: "@sdkwork/notes-pc-react",
  status: "ready",
} as const;

export type NotesPackageMeta = typeof notesPackageMeta;
