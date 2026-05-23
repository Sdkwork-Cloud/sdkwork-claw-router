import { useEffect } from "react";
import {
  LoadingBlock,
  StatusNotice,
} from "@sdkwork/ui-pc-react";
import { SdkworkDriveEntryGrid } from "../components/DriveEntryGrid";
import { SdkworkDriveSummaryCards } from "../components/DriveSummaryCards";
import { useSdkworkDriveController, useSdkworkDriveControllerState } from "../drive-controller";
import type { SdkworkDriveService } from "../drive-service";
import type { SdkworkDriveSyncPosture } from "../drive";

export interface SdkworkDrivePageProps {
  controller?: ReturnType<typeof import("../drive-controller").createSdkworkDriveController>;
  service?: Partial<SdkworkDriveService>;
}

export function SdkworkDrivePage({ controller: controllerProp, service }: SdkworkDrivePageProps) {
  const controller = useSdkworkDriveController(controllerProp, service);
  const state = useSdkworkDriveControllerState(controller);

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="h-full overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[96rem] space-y-5">
        <section className="rounded-[2rem] bg-[linear-gradient(135deg,#09090b,#18181b_45%,#27272a)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]">
          <h1 className="text-4xl font-semibold tracking-tight">Drive Control Room</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72">
            Monitor shared spaces, sync posture, and storage-heavy workspaces from a reusable drive surface.
          </p>
        </section>

        {state.isLoading && !state.isBootstrapped ? <LoadingBlock label="Loading drive control room..." /> : null}
        {state.lastError ? <StatusNotice title="Drive workspace error" tone="danger">{state.lastError}</StatusNotice> : null}

        <SdkworkDriveSummaryCards digest={state.workspace.digest} />

        <section className="rounded-[1.5rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <input
              className="w-full rounded-[0.95rem] border border-[var(--sdk-color-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--sdk-color-text-primary)] outline-none"
              onChange={(event) => controller.setSearchQuery(event.target.value)}
              placeholder="Search drive"
              type="search"
              value={state.searchQuery}
            />
            <div className="flex flex-wrap gap-2">
              <button className={`rounded-full px-3 py-1.5 text-xs font-semibold ${state.activeLocation === "all" ? "bg-cyan-500 text-white" : "bg-[var(--sdk-color-surface-panel-muted)] text-[var(--sdk-color-text-secondary)]"}`} onClick={() => controller.setLocation("all")} type="button">All locations</button>
              {state.workspace.locations.map((location) => (
                <button className={`rounded-full px-3 py-1.5 text-xs font-semibold ${state.activeLocation === location.id ? "bg-cyan-500 text-white" : "bg-[var(--sdk-color-surface-panel-muted)] text-[var(--sdk-color-text-secondary)]"}`} key={location.id} onClick={() => controller.setLocation(location.id)} type="button">
                  {location.title}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(["all", "healthy", "attention", "blocked"] as const).map((syncPosture) => (
              <button className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold ${state.activeSyncPosture === syncPosture ? "border-sky-500 bg-sky-500/10 text-sky-500" : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"}`} key={syncPosture} onClick={() => controller.setSyncPosture(syncPosture as SdkworkDriveSyncPosture | "all")} type="button">
                {syncPosture}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <SdkworkDriveEntryGrid entries={state.visibleEntries} />
          </div>
        </section>
      </div>
    </div>
  );
}
