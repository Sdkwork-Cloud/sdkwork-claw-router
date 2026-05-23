import type {
  SdkworkInstallProgressSummary,
  SdkworkInstallReadinessSummary,
} from "../install";

export interface SdkworkInstallReadinessCardsProps {
  progress: SdkworkInstallProgressSummary;
  readiness: SdkworkInstallReadinessSummary;
  recommendedInstallPath: string;
}

function toReadinessTone(status: SdkworkInstallReadinessSummary["status"]): string {
  if (status === "blocked") {
    return "text-rose-400";
  }

  if (status === "warning") {
    return "text-amber-400";
  }

  return "text-emerald-400";
}

export function SdkworkInstallReadinessCards({
  progress,
  readiness,
  recommendedInstallPath,
}: SdkworkInstallReadinessCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <article className="rounded-[1.35rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4 shadow-[var(--sdk-shadow-sm)]">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sdk-color-text-muted)]">
          Readiness
        </div>
        <div className={`mt-3 text-2xl font-semibold capitalize ${toReadinessTone(readiness.status)}`}>
          {readiness.status}
        </div>
        <div className="mt-3 text-sm text-[var(--sdk-color-text-secondary)]">
          Ready {readiness.readyDependencies} / {readiness.totalDependencies}
        </div>
      </article>

      <article className="rounded-[1.35rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4 shadow-[var(--sdk-shadow-sm)]">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sdk-color-text-muted)]">
          Step Progress
        </div>
        <div className="mt-3 text-2xl font-semibold text-[var(--sdk-color-text-primary)]">
          {progress.progressPercent}%
        </div>
        <div className="mt-3 text-sm text-[var(--sdk-color-text-secondary)]">
          Completed {progress.completedSteps} / {progress.totalSteps} steps
        </div>
      </article>

      <article className="rounded-[1.35rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4 shadow-[var(--sdk-shadow-sm)]">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sdk-color-text-muted)]">
          Recommended Path
        </div>
        <div className="mt-3 text-sm font-semibold text-[var(--sdk-color-text-primary)]">
          {recommendedInstallPath}
        </div>
        <div className="mt-3 text-sm text-[var(--sdk-color-text-secondary)]">
          Keep install output consistent across updates and rollback workflows.
        </div>
      </article>
    </div>
  );
}
