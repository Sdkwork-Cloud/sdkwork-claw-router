import { EmptyState } from "@sdkwork/ui-pc-react";
import type { SdkworkEditorDocument } from "../editor";

export interface SdkworkEditorDocumentListProps {
  documents: readonly SdkworkEditorDocument[];
  onSelectDocument?: (documentId: string) => void;
  selectedDocumentId?: string | null;
}

export function SdkworkEditorDocumentList({
  documents,
  onSelectDocument,
  selectedDocumentId,
}: SdkworkEditorDocumentListProps) {
  if (documents.length === 0) {
    return (
      <EmptyState
        description="No editor documents match the current filters."
        title="No documents"
      />
    );
  }

  return (
    <div className="grid gap-3">
      {documents.map((document) => {
        const isSelected = document.id === selectedDocumentId;

        return (
          <button
            aria-label={`Open ${document.title}`}
            className={`w-full rounded-[1.25rem] border px-4 py-3 text-left transition-all ${
              isSelected
                ? "border-cyan-400 bg-cyan-500/10 shadow-[var(--sdk-shadow-sm)]"
                : "border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] hover:-translate-y-0.5"
            }`}
            key={document.id}
            onClick={() => onSelectDocument?.(document.id)}
            type="button"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold text-[var(--sdk-color-text-primary)]">
                {document.title}
              </h3>
              <span className="rounded-full bg-[var(--sdk-color-surface-panel-muted)] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-[var(--sdk-color-text-muted)]">
                {document.mode}
              </span>
            </div>
            <p className="mt-2 text-xs leading-6 text-[var(--sdk-color-text-secondary)]">
              {document.summary}
            </p>
          </button>
        );
      })}
    </div>
  );
}
