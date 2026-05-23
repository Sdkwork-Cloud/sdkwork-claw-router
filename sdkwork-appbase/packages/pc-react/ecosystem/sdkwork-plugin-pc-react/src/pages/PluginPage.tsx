import { useEffect } from "react";
import {
  Plug,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import {
  Button,
  LoadingBlock,
  StatusNotice,
} from "@sdkwork/ui-pc-react";
import type { SdkworkPlugin } from "../plugin";
import type { SdkworkPluginController } from "../plugin-controller";
import {
  useSdkworkPluginController,
  useSdkworkPluginControllerState,
} from "../plugin-controller";
import { SdkworkPluginRegistryList } from "../components/PluginRegistryList";
import { SdkworkPluginStatusCards } from "../components/PluginStatusCards";
import type { SdkworkPluginService } from "../plugin-service";

export interface SdkworkPluginPageProps {
  controller?: SdkworkPluginController;
  onNavigate?: (route: string) => void;
  service?: Partial<SdkworkPluginService>;
}

function resolveActionLabel(plugin: SdkworkPlugin | null): string {
  if (!plugin) {
    return "Select a plugin";
  }

  if (plugin.installState === "update-available") {
    return `Update ${plugin.name}`;
  }

  if (plugin.installState === "installed") {
    return `Open ${plugin.name}`;
  }

  if (plugin.installState === "disabled") {
    return `Enable ${plugin.name}`;
  }

  return `Install ${plugin.name}`;
}

export function SdkworkPluginPage({
  controller: controllerProp,
  onNavigate,
  service,
}: SdkworkPluginPageProps) {
  const controller = useSdkworkPluginController(controllerProp, service);
  const state = useSdkworkPluginControllerState(controller);

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="h-full overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[96rem] space-y-5">
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.9fr)]">
          <div className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.16),transparent_28%),linear-gradient(135deg,#111827,#18181b_45%,#27272a)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/72">
                  <Sparkles className="h-3.5 w-3.5" />
                  Extension Lifecycle
                </div>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight">Plugin Center</h1>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  Track plugin health, compatibility, and permission readiness before install, update, enable, or private deployment.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => void controller.refresh()} type="button" variant="outline">
                  Refresh plugins
                </Button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.4rem] bg-white/8 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/65">Total plugins</div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight">
                      {state.catalog.summary.pluginCount}
                    </div>
                  </div>
                  <Plug className="h-5 w-5 text-white/80" />
                </div>
              </div>

              <div className="rounded-[1.4rem] bg-white/8 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/65">Blocked plugins</div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight">
                      {state.catalog.summary.blockedPlugins}
                    </div>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-white/80" />
                </div>
              </div>

              <div className="rounded-[1.4rem] bg-white/8 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/65">Ready plugins</div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight">
                      {state.catalog.summary.readyPlugins}
                    </div>
                  </div>
                  <Wrench className="h-5 w-5 text-white/80" />
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[1.65rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-5 shadow-[var(--sdk-shadow-sm)]">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--sdk-color-text-muted)]">
              Selected plugin
            </div>
            <div className="mt-2 text-xl font-semibold text-[var(--sdk-color-text-primary)]">
              {state.selectedPlugin?.name ?? "No plugin selected"}
            </div>
            <div className="mt-2 text-sm leading-7 text-[var(--sdk-color-text-secondary)]">
              {state.selectedPlugin?.description ?? "Select a plugin to inspect compatibility and permission readiness."}
            </div>

            {state.selectedPlugin ? (
              <div className="mt-5 space-y-3 rounded-[1.25rem] bg-[var(--sdk-color-surface-panel-muted)] p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--sdk-color-text-muted)]">State</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">{state.selectedPlugin.installState}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--sdk-color-text-muted)]">Source</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">{state.selectedPlugin.sourceKind}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--sdk-color-text-muted)]">Risk</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">{state.selectedPlugin.riskLevel}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--sdk-color-text-muted)]">Compatibility</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">{state.selectedPlugin.compatibility}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--sdk-color-text-muted)]">Permissions ready</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">
                    {state.selectedPlugin.permissionReadiness}
                  </span>
                </div>
              </div>
            ) : null}

            {state.selectedPlugin ? (
              <div className="mt-5">
                <Button onClick={() => onNavigate?.(state.selectedPlugin!.installRoute)} type="button">
                  {resolveActionLabel(state.selectedPlugin)}
                </Button>
              </div>
            ) : null}
          </aside>
        </section>

        {state.isLoading && !state.isBootstrapped ? <LoadingBlock label="Loading plugin center..." /> : null}

        {state.lastError ? (
          <StatusNotice title="Plugin center error" tone="danger">
            {state.lastError}
          </StatusNotice>
        ) : null}

        <SdkworkPluginStatusCards summary={state.catalog.summary} />

        <section className="rounded-[1.65rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-5 shadow-[var(--sdk-shadow-sm)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {state.catalog.filters.sourceOptions.map((option) => (
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                    state.activeSourceKind === option.id
                      ? "bg-rose-500 text-white"
                      : "bg-[var(--sdk-color-surface-panel-muted)] text-[var(--sdk-color-text-secondary)]"
                  }`}
                  key={option.id}
                  onClick={() => controller.setSourceKind(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>

            <label className="inline-flex items-center gap-2 rounded-[0.95rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel-muted)] px-3 py-2 text-sm">
              <span className="text-[var(--sdk-color-text-muted)]">Search</span>
              <input
                className="w-52 bg-transparent text-[var(--sdk-color-text-primary)] outline-none placeholder:text-[var(--sdk-color-text-muted)]"
                onChange={(event) => controller.setSearchQuery(event.target.value)}
                placeholder="name, description, permission"
                type="text"
                value={state.searchQuery}
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {state.catalog.filters.installStateOptions.map((option) => (
              <button
                className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  state.activeInstallState === option.id
                    ? "border-sky-500 bg-sky-500/10 text-sky-500"
                    : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                }`}
                key={option.id}
                onClick={() => controller.setInstallState(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {state.catalog.filters.riskOptions.map((option) => (
              <button
                className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  state.activeRiskLevel === option.id
                    ? "border-amber-500 bg-amber-500/10 text-amber-500"
                    : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                }`}
                key={option.id}
                onClick={() => controller.setRiskLevel(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {state.catalog.filters.sortOptions.map((option) => (
              <button
                className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  state.sortBy === option.id
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                    : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                }`}
                key={option.id}
                onClick={() => controller.setSortBy(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <SdkworkPluginRegistryList
          onNavigate={onNavigate}
          onSelectPlugin={(pluginId) => controller.selectPlugin(pluginId)}
          plugins={state.visiblePlugins}
          selectedPluginId={state.selectedPluginId}
        />
      </div>
    </div>
  );
}
