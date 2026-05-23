import { EmptyState } from "@sdkwork/ui-pc-react";
import type {
  SdkworkBrowserSiteGroup,
  SdkworkBrowserTab,
} from "../browser";

export interface SdkworkBrowserSiteGroupsProps {
  activeGroupId: string;
  groups: readonly SdkworkBrowserSiteGroup[];
  onSelectGroup?: (groupId: string) => void;
  tabs: readonly SdkworkBrowserTab[];
}

const TRUST_STYLE_MAP: Record<SdkworkBrowserSiteGroup["trustLevel"], string> = {
  blocked: "border-rose-500/45 bg-rose-500/10 text-rose-500",
  review: "border-amber-500/45 bg-amber-500/10 text-amber-500",
  trusted: "border-emerald-500/45 bg-emerald-500/10 text-emerald-500",
};

function countTabsByGroup(
  tabs: readonly SdkworkBrowserTab[],
): Record<string, number> {
  return tabs.reduce<Record<string, number>>((accumulator, tab) => {
    accumulator[tab.groupId] = (accumulator[tab.groupId] ?? 0) + 1;
    return accumulator;
  }, {});
}

export function SdkworkBrowserSiteGroups({
  activeGroupId,
  groups,
  onSelectGroup,
  tabs,
}: SdkworkBrowserSiteGroupsProps) {
  if (groups.length === 0) {
    return (
      <EmptyState
        description="No site groups are currently configured."
        title="No site groups"
      />
    );
  }

  const tabCounts = countTabsByGroup(tabs);

  return (
    <div className="grid gap-3">
      <button
        className={`rounded-[1.2rem] border px-4 py-3 text-left transition-colors ${
          activeGroupId === "all"
            ? "border-sky-500/55 bg-sky-500/10 text-sky-500"
            : "border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] text-[var(--sdk-color-text-primary)]"
        }`}
        onClick={() => onSelectGroup?.("all")}
        type="button"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold">All groups</span>
          <span className="text-xs">{tabs.length} tabs</span>
        </div>
      </button>

      {groups.map((group) => {
        const active = activeGroupId === group.id;
        return (
          <button
            className={`rounded-[1.2rem] border px-4 py-3 text-left transition-colors ${
              active
                ? "border-sky-500/55 bg-sky-500/10 text-sky-500"
                : "border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)]"
            }`}
            key={group.id}
            onClick={() => onSelectGroup?.(group.id)}
            type="button"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-[var(--sdk-color-text-primary)]">{group.title}</div>
                <div className="mt-1 text-xs text-[var(--sdk-color-text-muted)]">{group.description}</div>
              </div>
              <span className="text-xs font-medium text-[var(--sdk-color-text-secondary)]">
                {tabCounts[group.id] ?? 0}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${TRUST_STYLE_MAP[group.trustLevel]}`}>
                {group.trustLevel}
              </span>
              {group.domains.slice(0, 2).map((domain) => (
                <span
                  className="rounded-full bg-[var(--sdk-color-surface-panel-muted)] px-2.5 py-1 text-[0.68rem] text-[var(--sdk-color-text-muted)]"
                  key={domain}
                >
                  {domain}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
