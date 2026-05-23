import { useEffect } from "react";
import {
  HardDriveDownload,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Button,
  LoadingBlock,
  StatusNotice,
} from "@sdkwork/ui-pc-react";
import type { SdkworkInstallTargetKind } from "../install";
import type { SdkworkInstallController } from "../install-controller";
import {
  useSdkworkInstallController,
  useSdkworkInstallControllerState,
} from "../install-controller";
import type { SdkworkInstallService } from "../install-service";
import { SdkworkInstallReadinessCards } from "../components/InstallReadinessCards";
import { SdkworkInstallStepFlow } from "../components/InstallStepFlow";
import { SdkworkInstallVariantChooser } from "../components/InstallVariantChooser";

export interface SdkworkInstallPageProps {
  controller?: SdkworkInstallController;
  onNavigate?: (route: string) => void;
  service?: Partial<SdkworkInstallService>;
}

function labelTargetKind(value: SdkworkInstallTargetKind): string {
  if (value === "app") {
    return "App";
  }

  if (value === "runtime") {
    return "Runtime";
  }

  return "Tooling";
}

export function SdkworkInstallPage({
  controller: controllerProp,
  onNavigate,
  service,
}: SdkworkInstallPageProps) {
  const controller = useSdkworkInstallController(controllerProp, service);
  const state = useSdkworkInstallControllerState(controller);
  const targetKinds = Array.from(new Set(state.catalog.variants.map((variant) => variant.targetKind))) as SdkworkInstallTargetKind[];

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="h-full overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[96rem] space-y-5">
        <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_30%),linear-gradient(135deg,#09090b,#111827_44%,#27272a)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/68">
                <Sparkles className="h-3.5 w-3.5" />
                Install Workspace
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight">Install Center</h1>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Resolve install targets, verify dependency readiness, and route guided install variants across apps, runtimes, and tooling.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {state.selectedVariant ? (
                <Button onClick={() => onNavigate?.(state.selectedVariant!.route)} type="button">
                  Open selected route
                </Button>
              ) : null}
              <Button onClick={() => void controller.refresh()} type="button" variant="outline">
                Refresh install state
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.45rem] bg-white/8 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-white/65">Recommended variant</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    {state.selectedVariant?.title ?? "No variant selected"}
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] bg-cyan-400/15 text-cyan-200">
                  <Route className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-[1.45rem] bg-white/8 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-white/65">Install progress</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    {state.catalog.progress.progressPercent}%
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] bg-emerald-400/15 text-emerald-200">
                  <HardDriveDownload className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-[1.45rem] bg-white/8 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-white/65">Readiness status</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight capitalize">
                    {state.catalog.readiness.status}
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] bg-amber-400/15 text-amber-200">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {state.isLoading && !state.isBootstrapped ? <LoadingBlock label="Loading install center..." /> : null}

        {state.lastError ? (
          <StatusNotice title="Install center error" tone="danger">
            {state.lastError}
          </StatusNotice>
        ) : null}

        <section className="space-y-5 rounded-[1.5rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-5 shadow-[var(--sdk-shadow-sm)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sdk-color-text-muted)]">
                Install Targets
              </div>
              <h2 className="mt-2 text-xl font-semibold text-[var(--sdk-color-text-primary)]">
                Variant chooser
              </h2>
            </div>

            <div className="inline-flex flex-wrap gap-2">
              <Button
                onClick={() => controller.setTargetKind("all")}
                type="button"
                variant={state.activeTargetKind === "all" ? "secondary" : "ghost"}
              >
                All
              </Button>
              {targetKinds.map((targetKind) => (
                <Button
                  key={targetKind}
                  onClick={() => controller.setTargetKind(targetKind)}
                  type="button"
                  variant={state.activeTargetKind === targetKind ? "secondary" : "ghost"}
                >
                  {labelTargetKind(targetKind)}
                </Button>
              ))}
            </div>
          </div>

          <SdkworkInstallReadinessCards
            progress={state.catalog.progress}
            readiness={state.catalog.readiness}
            recommendedInstallPath={state.catalog.recommendedInstallPath}
          />

          <SdkworkInstallVariantChooser
            onNavigate={onNavigate}
            onSelectVariant={(variantId) => controller.selectVariant(variantId)}
            selectedVariantId={state.selectedVariantId}
            variants={state.visibleVariants}
          />

          <SdkworkInstallStepFlow
            onOpenStep={(stepId) =>
              onNavigate?.(
                state.catalog.routeIntents.steps.route.includes("?")
                  ? `${state.catalog.routeIntents.steps.route}&stepId=${stepId}`
                  : `${state.catalog.routeIntents.steps.route}?stepId=${stepId}`,
              )
            }
            steps={state.catalog.steps}
          />
        </section>
      </div>
    </div>
  );
}
