import { EmptyState } from "@sdkwork/ui-pc-react";
import type { SdkworkCanvasBoard } from "../canvas";

export interface SdkworkCanvasBoardListProps {
  activeBoardId?: string | null;
  boards: readonly SdkworkCanvasBoard[];
  onSelectBoard?: (boardId: string) => void;
}

export function SdkworkCanvasBoardList({
  activeBoardId,
  boards,
  onSelectBoard,
}: SdkworkCanvasBoardListProps) {
  if (boards.length === 0) {
    return (
      <EmptyState
        description="No canvas boards are currently available."
        title="No boards"
      />
    );
  }

  return (
    <div className="grid gap-3">
      {boards.map((board) => {
        const isActive = board.id === activeBoardId;
        return (
          <button
            aria-label={`Open board ${board.title}`}
            className={`w-full rounded-[1.25rem] border px-4 py-3 text-left transition-all ${
              isActive
                ? "border-emerald-400 bg-emerald-500/10"
                : "border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] hover:-translate-y-0.5"
            }`}
            key={board.id}
            onClick={() => onSelectBoard?.(board.id)}
            type="button"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold text-[var(--sdk-color-text-primary)]">{board.title}</h3>
              <span className="text-xs text-[var(--sdk-color-text-muted)]">{board.updatedAt}</span>
            </div>
            <div className="mt-2 text-xs text-[var(--sdk-color-text-secondary)]">
              {board.nodes.length} nodes, {board.edges.length} edges
            </div>
          </button>
        );
      })}
    </div>
  );
}
