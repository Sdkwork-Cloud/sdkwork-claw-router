import { EmptyState } from "@sdkwork/ui-pc-react";
import type { SdkworkBrowserTab } from "../browser";

export interface SdkworkBrowserTabStripProps {
  onOpenTab?: (route: string) => void;
  onSelectTab?: (tabId: string) => void;
  selectedTabId?: string | null;
  tabs: readonly SdkworkBrowserTab[];
}

const POSTURE_STYLE_MAP: Record<SdkworkBrowserTab["posture"], string> = {
  offline: "bg-rose-500/10 text-rose-500",
  review: "bg-amber-500/10 text-amber-500",
  secure: "bg-emerald-500/10 text-emerald-500",
};

function toReadableLabel(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function SdkworkBrowserTabStrip({
  onOpenTab,
  onSelectTab,
  selectedTabId,
  tabs,
}: SdkworkBrowserTabStripProps) {
  if (tabs.length === 0) {
    return (
      <EmptyState
        description="No browser tabs match current filters."
        title="No tabs"
      />
    );
  }

  return (
    <div className="space-y-3">
      {tabs.map((tab) => {
        const selected = selectedTabId === tab.id;
        return (
          <article
            className={`rounded-[1.35rem] border px-4 py-4 transition-colors ${
              selected
                ? "border-sky-500/55 bg-sky-500/10"
                : "border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)]"
            }`}
            key={tab.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-[var(--sdk-color-text-primary)]">{tab.title}</h3>
                  {tab.pinned ? (
                    <span className="rounded-full bg-[var(--sdk-color-surface-panel-muted)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--sdk-color-text-muted)]">
                      Pinned
                    </span>
                  ) : null}
                  <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${POSTURE_STYLE_MAP[tab.posture]}`}>
                    {tab.posture}
                  </span>
                </div>
                <p className="mt-2 truncate text-xs text-[var(--sdk-color-text-secondary)]">{tab.url}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[0.72rem] text-[var(--sdk-color-text-muted)]">
                  <span>Safe mode: {toReadableLabel(tab.safeMode)}</span>
                  <span>Permissions: {toReadableLabel(tab.permissionReadiness)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  className="rounded-[0.9rem] bg-[linear-gradient(135deg,#111827,#18181b_58%,#27272a)] px-3 py-2 text-xs font-semibold text-white"
                  onClick={() => onOpenTab?.(tab.route)}
                  type="button"
                >
                  Open {tab.title}
                </button>
                <button
                  aria-label={`Select ${tab.title}`}
                  className="rounded-[0.9rem] border border-[var(--sdk-color-border-default)] px-3 py-2 text-xs font-semibold text-[var(--sdk-color-text-primary)]"
                  onClick={() => onSelectTab?.(tab.id)}
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
