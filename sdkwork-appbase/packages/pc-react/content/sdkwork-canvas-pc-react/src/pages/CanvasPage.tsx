import { useEffect } from "react";
import {
  Button,
  LoadingBlock,
  StatusNotice,
} from "@sdkwork/ui-pc-react";
import type { SdkworkCanvasController } from "../canvas-controller";
import {
  useSdkworkCanvasController,
  useSdkworkCanvasControllerState,
} from "../canvas-controller";
import type { SdkworkCanvasService } from "../canvas-service";
import { SdkworkCanvasBoardList } from "../components/CanvasBoardList";
import { SdkworkCanvasBoardStats } from "../components/CanvasBoardStats";
import { SdkworkCanvasNodeInspector } from "../components/CanvasNodeInspector";

export interface SdkworkCanvasPageProps {
  controller?: SdkworkCanvasController;
  service?: Partial<SdkworkCanvasService>;
}

export function SdkworkCanvasPage({
  controller: controllerProp,
  service,
}: SdkworkCanvasPageProps) {
  const controller = useSdkworkCanvasController(controllerProp, service);
  const state = useSdkworkCanvasControllerState(controller);

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="h-full overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[96rem] space-y-5">
        <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_32%),linear-gradient(140deg,#022c22,#064e3b_45%,#0f172a)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight">Canvas Workspace</h1>
              <p className="mt-3 text-sm leading-7 text-white/75">
                Inspect deterministic board graphs, node topology, and flow health for reusable visual authoring experiences.
              </p>
            </div>
            <Button onClick={() => void controller.refresh()} type="button" variant="outline">
              Refresh boards
            </Button>
          </div>
        </section>

        {state.isLoading && !state.isBootstrapped ? <LoadingBlock label="Loading canvas workspace..." /> : null}
        {state.lastError ? (
          <StatusNotice title="Canvas workspace error" tone="danger">
            {state.lastError}
          </StatusNotice>
        ) : null}

        <SdkworkCanvasBoardStats digest={state.workspace.digest} />

        <section className="grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)]">
          <SdkworkCanvasBoardList
            activeBoardId={state.activeBoardId}
            boards={state.workspace.boards}
            onSelectBoard={(boardId) => controller.selectBoard(boardId)}
          />
          <div className="space-y-4">
            <div className="rounded-[1.25rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--sdk-color-text-muted)]">Nodes</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {state.activeBoard?.nodes.map((node) => (
                  <button
                    className={`rounded-full px-3 py-1.5 text-xs ${
                      state.selectedNodeId === node.id
                        ? "bg-emerald-500/20 text-emerald-600"
                        : "bg-[var(--sdk-color-surface-panel-muted)] text-[var(--sdk-color-text-secondary)]"
                    }`}
                    key={node.id}
                    onClick={() => controller.selectNode(node.id)}
                    type="button"
                  >
                    {node.title}
                  </button>
                ))}
              </div>
            </div>
            <SdkworkCanvasNodeInspector node={state.selectedNode} />
          </div>
        </section>
      </div>
    </div>
  );
}
