import { EmptyState } from "@sdkwork/ui-pc-react";
import type { SdkworkNoteEntry } from "../notes";

export interface SdkworkNotesCardListProps {
  notes: readonly SdkworkNoteEntry[];
  onSelect?: (noteId: string) => void;
  selectedNoteId?: string | null;
}

export function SdkworkNotesCardList({
  notes,
  onSelect,
  selectedNoteId,
}: SdkworkNotesCardListProps) {
  if (notes.length === 0) {
    return (
      <EmptyState
        description="No notes match your current filters."
        title="No notes"
      />
    );
  }

  return (
    <div className="grid gap-3">
      {notes.map((note) => {
        const isSelected = note.id === selectedNoteId;
        return (
          <button
            aria-label={`Open note ${note.title}`}
            className={`w-full rounded-[1.25rem] border p-4 text-left transition-all ${
              isSelected
                ? "border-cyan-400 bg-cyan-500/10"
                : "border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] hover:-translate-y-0.5"
            }`}
            key={note.id}
            onClick={() => onSelect?.(note.id)}
            type="button"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-[var(--sdk-color-text-primary)]">
                {note.title}
              </h3>
              {note.starred ? (
                <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-amber-500">
                  Starred
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-7 text-[var(--sdk-color-text-secondary)]">
              {note.preview}
            </p>
          </button>
        );
      })}
    </div>
  );
}
