import { EmptyState } from "@sdkwork/ui-pc-react";
import type { SdkworkEditorDocument } from "../editor";

export interface SdkworkEditorFocusPanelProps {
  document: SdkworkEditorDocument | null;
  onOpenPath?: (path: string) => void;
}

export function SdkworkEditorFocusPanel({
  document,
  onOpenPath,
}: SdkworkEditorFocusPanelProps) {
  if (!document) {
    return (
      <EmptyState
        description="Select a document to inspect mode, summary, and editing context."
        title="No focused document"
      />
    );
  }

  return (
    <article className="rounded-[1.5rem] border border-[var(--sdk-color-border-default)] bg-[linear-gradient(160deg,rgba(8,47,73,0.06),transparent_38%),var(--sdk-color-surface-panel)] p-5 shadow-[var(--sdk-shadow-sm)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-cyan-500/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cyan-500">
          {document.mode}
        </span>
        <span className="rounded-full bg-[var(--sdk-color-surface-panel-muted)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--sdk-color-text-muted)]">
          {document.status}
        </span>
      </div>

      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--sdk-color-text-primary)]">
        {document.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[var(--sdk-color-text-secondary)]">
        {document.summary}
      </p>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-[1rem] bg-[var(--sdk-color-surface-panel-muted)] px-3.5 py-2.5">
          <div className="text-xs uppercase tracking-[0.12em] text-[var(--sdk-color-text-muted)]">Updated</div>
          <div className="mt-1 font-medium text-[var(--sdk-color-text-primary)]">{document.updatedAt}</div>
        </div>
        <div className="rounded-[1rem] bg-[var(--sdk-color-surface-panel-muted)] px-3.5 py-2.5">
          <div className="text-xs uppercase tracking-[0.12em] text-[var(--sdk-color-text-muted)]">Word Count</div>
          <div className="mt-1 font-medium text-[var(--sdk-color-text-primary)]">{document.wordCount}</div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {document.tags.map((tag) => (
          <span
            className="rounded-full border border-[var(--sdk-color-border-default)] px-2.5 py-1 text-xs text-[var(--sdk-color-text-secondary)]"
            key={`${document.id}-${tag}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        aria-label={`Open ${document.path}`}
        className="mt-6 rounded-[0.95rem] bg-[linear-gradient(135deg,#0f172a,#1e293b_44%,#334155)] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        onClick={() => onOpenPath?.(document.path)}
        type="button"
      >
        Open source path
      </button>
    </article>
  );
}
