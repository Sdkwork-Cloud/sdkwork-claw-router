import { EmptyState } from "@sdkwork/ui-pc-react";
import type { SdkworkNoteEntry } from "../notes";

export interface SdkworkNotesPreviewPanelProps {
  note: SdkworkNoteEntry | null;
}

export function SdkworkNotesPreviewPanel({
  note,
}: SdkworkNotesPreviewPanelProps) {
  if (!note) {
    return (
      <EmptyState
        description="Select a note to inspect the preview, tags, and visibility."
        title="No focused note"
      />
    );
  }

  return (
    <article className="rounded-[1.5rem] border border-[var(--sdk-color-border-default)] bg-[linear-gradient(160deg,rgba(30,64,175,0.07),transparent_38%),var(--sdk-color-surface-panel)] p-5 shadow-[var(--sdk-shadow-sm)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-indigo-500">
          {note.visibility}
        </span>
        {note.starred ? (
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-500">
            Starred
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--sdk-color-text-primary)]">
        {note.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[var(--sdk-color-text-secondary)]">
        {note.preview}
      </p>
      <div className="mt-4 rounded-[1rem] bg-[var(--sdk-color-surface-panel-muted)] px-3.5 py-2.5 text-sm text-[var(--sdk-color-text-secondary)]">
        Last updated: {note.updatedAt}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {note.tags.map((tag) => (
          <span
            className="rounded-full border border-[var(--sdk-color-border-default)] px-2.5 py-1 text-xs text-[var(--sdk-color-text-secondary)]"
            key={`${note.id}-${tag}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
