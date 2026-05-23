import { useEffect } from "react";
import {
  LoadingBlock,
  StatusNotice,
} from "@sdkwork/ui-pc-react";
import { SdkworkAssetsGrid } from "../components/AssetsGrid";
import { SdkworkAssetsSummaryCards } from "../components/AssetsSummaryCards";
import {
  createSdkworkAssetsController,
  useSdkworkAssetsController,
  useSdkworkAssetsControllerState,
} from "../assets-controller";
import type { SdkworkAssetsService } from "../assets-service";

export interface SdkworkAssetsPageProps {
  controller?: ReturnType<typeof createSdkworkAssetsController>;
  service?: Partial<SdkworkAssetsService>;
}

export function SdkworkAssetsPage({
  controller: controllerProp,
  service,
}: SdkworkAssetsPageProps) {
  const controller = useSdkworkAssetsController(controllerProp, service);
  const state = useSdkworkAssetsControllerState(controller);

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="h-full overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[96rem] space-y-5">
        <section className="rounded-[2rem] bg-[linear-gradient(135deg,#09090b,#18181b_45%,#27272a)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]">
          <h1 className="text-4xl font-semibold tracking-tight">Asset Catalog</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72">
            Curate reusable brand, campaign, and product assets with collection-aware filtering and license posture visibility.
          </p>
        </section>

        {state.isLoading && !state.isBootstrapped ? <LoadingBlock label="Loading asset catalog..." /> : null}

        {state.lastError ? (
          <StatusNotice title="Assets workspace error" tone="danger">
            {state.lastError}
          </StatusNotice>
        ) : null}

        <SdkworkAssetsSummaryCards digest={state.workspace.digest} />

        <section className="rounded-[1.5rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <input
              className="w-full rounded-[0.95rem] border border-[var(--sdk-color-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--sdk-color-text-primary)] outline-none"
              onChange={(event) => controller.setSearchQuery(event.target.value)}
              placeholder="Search assets"
              type="search"
              value={state.searchQuery}
            />
            <div className="flex flex-wrap gap-2">
              <button
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${state.activeCollection === "all" ? "bg-cyan-500 text-white" : "bg-[var(--sdk-color-surface-panel-muted)] text-[var(--sdk-color-text-secondary)]"}`}
                onClick={() => controller.setCollection("all")}
                type="button"
              >
                All collections
              </button>
              {state.workspace.collections.map((collection) => (
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${state.activeCollection === collection.id ? "bg-cyan-500 text-white" : "bg-[var(--sdk-color-surface-panel-muted)] text-[var(--sdk-color-text-secondary)]"}`}
                  key={collection.id}
                  onClick={() => controller.setCollection(collection.id)}
                  type="button"
                >
                  {collection.title}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(["all", "ready", "review", "needs-license"] as const).map((readiness) => (
              <button
                className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold ${state.activeReadiness === readiness ? "border-sky-500 bg-sky-500/10 text-sky-500" : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"}`}
                key={readiness}
                onClick={() => controller.setReadiness(readiness)}
                type="button"
              >
                {readiness}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <SdkworkAssetsGrid assets={state.visibleAssets} />
          </div>
        </section>
      </div>
    </div>
  );
}
