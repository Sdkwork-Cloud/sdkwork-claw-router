import { EmptyState } from "@sdkwork/ui-pc-react";
import type { SdkworkCanvasNode } from "../canvas";

export interface SdkworkCanvasNodeInspectorProps {
  node: SdkworkCanvasNode | null;
}

export function SdkworkCanvasNodeInspector({
  node,
}: SdkworkCanvasNodeInspectorProps) {
  if (!node) {
    return (
      <EmptyState
        description="Select a board node to inspect details and status."
        title="No selected node"
      />
    );
  }

  return (
    <article className="rounded-[1.5rem] border border-[var(--sdk-color-border-default)] bg-[linear-gradient(160deg,rgba(16,185,129,0.08),transparent_35%),var(--sdk-color-surface-panel)] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-500">
          {node.kind}
        </span>
        <span className="rounded-full bg-[var(--sdk-color-surface-panel-muted)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--sdk-color-text-muted)]">
          {node.status}
        </span>
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--sdk-color-text-primary)]">{node.title}</h3>
      <p className="mt-3 text-sm text-[var(--sdk-color-text-secondary)]">
        Position: ({node.x}, {node.y})
      </p>
    </article>
  );
}
