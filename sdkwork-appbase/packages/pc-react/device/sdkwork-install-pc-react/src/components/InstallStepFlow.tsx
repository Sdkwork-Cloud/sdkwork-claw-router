import type {
  SdkworkInstallStep,
  SdkworkInstallStepId,
  SdkworkInstallStepStatus,
} from "../install";

export interface SdkworkInstallStepFlowProps {
  onOpenStep?: (stepId: SdkworkInstallStepId) => void;
  steps: readonly SdkworkInstallStep[];
}

function statusTone(status: SdkworkInstallStepStatus): string {
  if (status === "completed") {
    return "text-emerald-400";
  }

  if (status === "running" || status === "ready") {
    return "text-sky-400";
  }

  if (status === "warning") {
    return "text-amber-400";
  }

  if (status === "blocked") {
    return "text-rose-400";
  }

  return "text-[var(--sdk-color-text-muted)]";
}

export function SdkworkInstallStepFlow({
  onOpenStep,
  steps,
}: SdkworkInstallStepFlowProps) {
  return (
    <div className="space-y-3 rounded-[1.5rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-5 shadow-[var(--sdk-shadow-sm)]">
      {steps.map((step) => (
        <article
          className="rounded-[1.15rem] border border-[var(--sdk-color-border-subtle)] bg-[var(--sdk-color-surface-panel-muted)] p-4"
          key={step.id}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${statusTone(step.status)}`}>
                {step.status}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-[var(--sdk-color-text-primary)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--sdk-color-text-secondary)]">
                {step.description}
              </p>
            </div>
            <button
              className="rounded-[0.9rem] border border-[var(--sdk-color-border-default)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--sdk-color-text-primary)] transition-colors hover:bg-[var(--sdk-color-surface-panel)]"
              onClick={() => onOpenStep?.(step.id)}
              type="button"
            >
              Open
            </button>
          </div>

          <div className="mt-4 h-2 rounded-full bg-[var(--sdk-color-surface-panel)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8,#22d3ee,#67e8f9)] transition-all"
              style={{
                width: `${step.progressPercent}%`,
              }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
