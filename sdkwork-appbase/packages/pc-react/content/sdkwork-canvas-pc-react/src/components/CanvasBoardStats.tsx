import type { SdkworkCanvasDigest } from "../canvas";

export interface SdkworkCanvasBoardStatsProps {
  digest: SdkworkCanvasDigest;
}

export function SdkworkCanvasBoardStats({
  digest,
}: SdkworkCanvasBoardStatsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-[1rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-3.5">
        <div className="text-xs uppercase tracking-[0.12em] text-[var(--sdk-color-text-muted)]">Boards</div>
        <div className="mt-1 text-xl font-semibold text-[var(--sdk-color-text-primary)]">{digest.totalBoards}</div>
      </article>
      <article className="rounded-[1rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-3.5">
        <div className="text-xs uppercase tracking-[0.12em] text-[var(--sdk-color-text-muted)]">Active</div>
        <div className="mt-1 text-xl font-semibold text-[var(--sdk-color-text-primary)]">{digest.activeBoards}</div>
      </article>
      <article className="rounded-[1rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-3.5">
        <div className="text-xs uppercase tracking-[0.12em] text-[var(--sdk-color-text-muted)]">Nodes</div>
        <div className="mt-1 text-xl font-semibold text-[var(--sdk-color-text-primary)]">{digest.totalNodes}</div>
      </article>
      <article className="rounded-[1rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-3.5">
        <div className="text-xs uppercase tracking-[0.12em] text-[var(--sdk-color-text-muted)]">Edges</div>
        <div className="mt-1 text-xl font-semibold text-[var(--sdk-color-text-primary)]">{digest.totalEdges}</div>
      </article>
    </div>
  );
}
