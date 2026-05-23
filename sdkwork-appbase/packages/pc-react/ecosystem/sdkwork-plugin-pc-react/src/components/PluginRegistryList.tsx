import { EmptyState } from "@sdkwork/ui-pc-react";
import type { SdkworkPlugin } from "../plugin";

export interface SdkworkPluginRegistryListProps {
  onNavigate?: (route: string) => void;
  onSelectPlugin?: (pluginId: string) => void;
  plugins: readonly SdkworkPlugin[];
  selectedPluginId?: string | null;
}

const SOURCE_LABELS: Record<SdkworkPlugin["sourceKind"], string> = {
  bundled: "Bundled",
  local: "Local",
  market: "Market",
  private: "Private",
};

function toReadableLabel(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function resolveActionLabel(plugin: SdkworkPlugin): string {
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

export function SdkworkPluginRegistryList({
  onNavigate,
  onSelectPlugin,
  plugins,
  selectedPluginId,
}: SdkworkPluginRegistryListProps) {
  if (plugins.length === 0) {
    return (
      <EmptyState
        description="No plugins match the current source, risk, and install-state filters."
        title="No plugins"
      />
    );
  }

  return (
    <div className="space-y-3">
      {plugins.map((plugin) => {
        const isSelected = selectedPluginId === plugin.id;

        return (
          <article
            className={`rounded-[1.45rem] border px-4 py-4 transition-colors ${
              isSelected
                ? "border-rose-400 bg-rose-500/10"
                : "border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] hover:bg-[var(--sdk-color-surface-hover)]"
            }`}
            key={plugin.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-[var(--sdk-color-text-primary)]">{plugin.name}</h3>
                  <span className="rounded-full bg-[var(--sdk-color-surface-panel-muted)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--sdk-color-text-muted)]">
                    {SOURCE_LABELS[plugin.sourceKind]}
                  </span>
                  {plugin.installState === "update-available" ? (
                    <span className="rounded-full bg-sky-500/12 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-sky-500">
                      Update
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--sdk-color-text-secondary)]">{plugin.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--sdk-color-text-muted)]">
                  <span>v{plugin.version}</span>
                  <span>Health: {toReadableLabel(plugin.health)}</span>
                  <span>State: {toReadableLabel(plugin.installState)}</span>
                  <span>Compatibility: {toReadableLabel(plugin.compatibility)}</span>
                  <span>Permissions: {toReadableLabel(plugin.permissionReadiness)}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  className="rounded-[0.9rem] bg-[linear-gradient(135deg,#111827,#18181b_58%,#27272a)] px-3 py-2 text-xs font-semibold text-white"
                  onClick={() => onNavigate?.(plugin.installRoute)}
                  type="button"
                >
                  {resolveActionLabel(plugin)}
                </button>
                <button
                  aria-label={`Select ${plugin.name}`}
                  className="rounded-[0.9rem] border border-[var(--sdk-color-border-default)] px-3 py-2 text-xs font-semibold text-[var(--sdk-color-text-primary)]"
                  onClick={() => onSelectPlugin?.(plugin.id)}
                  type="button"
                >
                  Select
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
