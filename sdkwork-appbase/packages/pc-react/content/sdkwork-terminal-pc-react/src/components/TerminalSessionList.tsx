import { EmptyState } from "@sdkwork/ui-pc-react";
import type {
  SdkworkTerminalProfile,
  SdkworkTerminalSession,
} from "../terminal";

export interface SdkworkTerminalSessionListProps {
  onOpenSession?: (route: string) => void;
  onSelectSession?: (sessionId: string) => void;
  profiles: readonly SdkworkTerminalProfile[];
  selectedSessionId?: string | null;
  sessions: readonly SdkworkTerminalSession[];
}

const HEALTH_STYLE_MAP: Record<SdkworkTerminalSession["runtimeHealth"], string> = {
  degraded: "bg-amber-500/10 text-amber-500",
  healthy: "bg-emerald-500/10 text-emerald-500",
  offline: "bg-rose-500/10 text-rose-500",
};

function toReadableLabel(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function SdkworkTerminalSessionList({
  onOpenSession,
  onSelectSession,
  profiles,
  selectedSessionId,
  sessions,
}: SdkworkTerminalSessionListProps) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        description="No terminal sessions match current filters."
        title="No sessions"
      />
    );
  }

  const profileLabelMap = new Map(profiles.map((profile) => [profile.id, profile.name]));

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const selected = selectedSessionId === session.id;
        return (
          <article
            className={`rounded-[1.35rem] border px-4 py-4 transition-colors ${
              selected
                ? "border-sky-500/55 bg-sky-500/10"
                : "border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)]"
            }`}
            key={session.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-[var(--sdk-color-text-primary)]">{session.title}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${HEALTH_STYLE_MAP[session.runtimeHealth]}`}>
                    {session.runtimeHealth}
                  </span>
                </div>
                <div className="mt-2 text-xs text-[var(--sdk-color-text-secondary)]">{session.workingDirectory}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-[0.72rem] text-[var(--sdk-color-text-muted)]">
                  <span>State: {toReadableLabel(session.state)}</span>
                  <span>Profile: {profileLabelMap.get(session.profileId) ?? session.profileId}</span>
                  <span>Permissions: {toReadableLabel(session.permissionReadiness)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  className="rounded-[0.9rem] bg-[linear-gradient(135deg,#111827,#18181b_58%,#27272a)] px-3 py-2 text-xs font-semibold text-white"
                  onClick={() => onOpenSession?.(session.route)}
                  type="button"
                >
                  Open {session.title}
                </button>
                <button
                  aria-label={`Select ${session.title}`}
                  className="rounded-[0.9rem] border border-[var(--sdk-color-border-default)] px-3 py-2 text-xs font-semibold text-[var(--sdk-color-text-primary)]"
                  onClick={() => onSelectSession?.(session.id)}
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
