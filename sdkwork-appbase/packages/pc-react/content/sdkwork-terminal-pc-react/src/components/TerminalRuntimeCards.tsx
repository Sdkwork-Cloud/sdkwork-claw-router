import type { SdkworkTerminalWorkspaceSummary } from "../terminal";

export interface SdkworkTerminalRuntimeCardsProps {
  summary: SdkworkTerminalWorkspaceSummary;
}

export function SdkworkTerminalRuntimeCards({
  summary,
}: SdkworkTerminalRuntimeCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-[1.3rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4">
        <div className="text-sm font-medium text-[var(--sdk-color-text-secondary)]">Running sessions</div>
        <div className="mt-2 text-2xl font-semibold text-[var(--sdk-color-text-primary)]">{summary.runningSessions}</div>
      </div>

      <div className="rounded-[1.3rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4">
        <div className="text-sm font-medium text-[var(--sdk-color-text-secondary)]">Runtime offline</div>
        <div className="mt-2 text-2xl font-semibold text-[var(--sdk-color-text-primary)]">{summary.offlineRuntimes}</div>
      </div>

      <div className="rounded-[1.3rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4">
        <div className="text-sm font-medium text-[var(--sdk-color-text-secondary)]">Error sessions</div>
        <div className="mt-2 text-2xl font-semibold text-[var(--sdk-color-text-primary)]">{summary.errorSessions}</div>
      </div>

      <div className="rounded-[1.3rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4">
        <div className="text-sm font-medium text-[var(--sdk-color-text-secondary)]">Commands logged</div>
        <div className="mt-2 text-2xl font-semibold text-[var(--sdk-color-text-primary)]">{summary.historyEntries}</div>
      </div>
    </div>
  );
}
