import { useEffect } from "react";
import {
  Button,
  LoadingBlock,
  StatusNotice,
} from "@sdkwork/ui-pc-react";
import {
  createSdkworkTerminalBackdropStyle,
  createSdkworkTerminalGlassStyle,
  createSdkworkTerminalHeroStyle,
  createSdkworkTerminalHeroTextStyle,
} from "../terminal-appearance";
import type { SdkworkTerminalController } from "../terminal-controller";
import {
  useSdkworkTerminalController,
  useSdkworkTerminalControllerState,
} from "../terminal-controller";
import type { SdkworkTerminalService } from "../terminal-service";
import {
  type SdkworkTerminalRuntimeHealth,
  type SdkworkTerminalSessionState,
} from "../terminal";
import { SdkworkTerminalRuntimeCards } from "../components/TerminalRuntimeCards";
import { SdkworkTerminalSessionList } from "../components/TerminalSessionList";

export interface SdkworkTerminalPageProps {
  controller?: SdkworkTerminalController;
  onNavigate?: (route: string) => void;
  service?: Partial<SdkworkTerminalService>;
}

function resolveActionLabel(sessionTitle: string | undefined): string {
  return sessionTitle ? `Open ${sessionTitle}` : "Select a session";
}

const SESSION_ORDER: SdkworkTerminalSessionState[] = ["running", "idle", "stopped", "error"];
const HEALTH_ORDER: SdkworkTerminalRuntimeHealth[] = ["healthy", "degraded", "offline"];

export function SdkworkTerminalPage({
  controller: controllerProp,
  onNavigate,
  service,
}: SdkworkTerminalPageProps) {
  const controller = useSdkworkTerminalController(controllerProp, service);
  const state = useSdkworkTerminalControllerState(controller);
  const primaryHeroTextStyle = createSdkworkTerminalHeroTextStyle();
  const mutedHeroTextStyle = createSdkworkTerminalHeroTextStyle("muted");
  const subtleHeroTextStyle = createSdkworkTerminalHeroTextStyle("subtle");

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="relative h-full overflow-y-auto">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={createSdkworkTerminalBackdropStyle()}
      />

      <div className="relative px-4 py-4 sm:px-5 sm:py-5">
        <div className="mx-auto max-w-[96rem] space-y-5">
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(21rem,0.95fr)]">
          <div
            className="overflow-hidden rounded-[2rem] border border-[color-mix(in_srgb,var(--sdk-color-border-default)_72%,transparent)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]"
            style={createSdkworkTerminalHeroStyle()}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-semibold tracking-tight" style={primaryHeroTextStyle}>Terminal Workspace</h1>
                <p className="mt-3 text-sm leading-7" style={mutedHeroTextStyle}>
                  Coordinate reusable terminal sessions with profile posture, command history, and runtime health readiness.
                </p>
              </div>
              <Button onClick={() => void controller.refresh()} type="button" variant="secondary">
                Refresh sessions
              </Button>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <div
                className="rounded-[1.3rem] border p-4"
                style={createSdkworkTerminalGlassStyle("brand", {
                  backgroundWeight: 10,
                  borderWeight: 22,
                  surfaceWeight: 78,
                })}
              >
                <div className="text-xs uppercase tracking-[0.16em]" style={subtleHeroTextStyle}>Sessions</div>
                <div className="mt-2 text-3xl font-semibold" style={primaryHeroTextStyle}>{state.workspace.summary.sessionCount}</div>
              </div>
              <div
                className="rounded-[1.3rem] border p-4"
                style={createSdkworkTerminalGlassStyle("accent", {
                  backgroundWeight: 10,
                  borderWeight: 22,
                  surfaceWeight: 78,
                })}
              >
                <div className="text-xs uppercase tracking-[0.16em]" style={subtleHeroTextStyle}>Profiles</div>
                <div className="mt-2 text-3xl font-semibold" style={primaryHeroTextStyle}>{state.workspace.summary.profileCount}</div>
              </div>
              <div
                className="rounded-[1.3rem] border p-4"
                style={createSdkworkTerminalGlassStyle("success", {
                  backgroundWeight: 10,
                  borderWeight: 22,
                  surfaceWeight: 78,
                })}
              >
                <div className="text-xs uppercase tracking-[0.16em]" style={subtleHeroTextStyle}>Ready sessions</div>
                <div className="mt-2 text-3xl font-semibold" style={primaryHeroTextStyle}>{state.workspace.summary.readySessions}</div>
              </div>
            </div>
          </div>

          <aside className="rounded-[1.6rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-5 shadow-[var(--sdk-shadow-sm)]">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--sdk-color-text-muted)]">
              Selected session
            </div>
            <div className="mt-2 text-xl font-semibold text-[var(--sdk-color-text-primary)]">
              {state.selectedSession?.title ?? "No session selected"}
            </div>
            <div className="mt-2 text-sm leading-7 text-[var(--sdk-color-text-secondary)]">
              {state.selectedSession?.workingDirectory ?? "Select a terminal session to inspect runtime posture and history."}
            </div>

            {state.selectedSession ? (
              <div className="mt-5 space-y-2 rounded-[1.2rem] bg-[var(--sdk-color-surface-panel-muted)] p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--sdk-color-text-muted)]">State</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">{state.selectedSession.state}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--sdk-color-text-muted)]">Health</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">{state.selectedSession.runtimeHealth}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--sdk-color-text-muted)]">Permissions</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">{state.selectedSession.permissionReadiness}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--sdk-color-text-muted)]">History</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">
                    {state.selectedSession.history.length} commands
                  </span>
                </div>
              </div>
            ) : null}

            {state.selectedSession ? (
              <div className="mt-5">
                <Button onClick={() => onNavigate?.(state.selectedSession!.route)} type="button">
                  {resolveActionLabel(state.selectedSession?.title)}
                </Button>
              </div>
            ) : null}
          </aside>
        </section>

        {state.isLoading && !state.isBootstrapped ? <LoadingBlock label="Loading terminal workspace..." /> : null}
        {state.lastError ? (
          <StatusNotice title="Terminal workspace error" tone="danger">
            {state.lastError}
          </StatusNotice>
        ) : null}

        <SdkworkTerminalRuntimeCards summary={state.workspace.summary} />

        <section className="rounded-[1.6rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-5 shadow-[var(--sdk-shadow-sm)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="inline-flex items-center gap-2 rounded-[0.95rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel-muted)] px-3 py-2 text-sm">
              <span className="text-[var(--sdk-color-text-muted)]">Search</span>
              <input
                className="w-56 bg-transparent text-[var(--sdk-color-text-primary)] outline-none placeholder:text-[var(--sdk-color-text-muted)]"
                onChange={(event) => controller.setSearchQuery(event.target.value)}
                placeholder="session, cwd, command"
                type="text"
                value={state.searchQuery}
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  state.activeProfileId === "all"
                    ? "border-sky-500 bg-sky-500/10 text-sky-500"
                    : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                }`}
                onClick={() => controller.setProfileId("all")}
                type="button"
              >
                All profiles
              </button>
              {state.workspace.filters.profileOptions
                .filter((option) => option.id !== "all")
                .map((option) => (
                  <button
                    className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      state.activeProfileId === option.id
                        ? "border-sky-500 bg-sky-500/10 text-sky-500"
                        : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                    }`}
                    key={option.id}
                    onClick={() => controller.setProfileId(option.id)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                state.activeState === "all"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                  : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
              }`}
              onClick={() => controller.setStateFilter("all")}
              type="button"
            >
              All states
            </button>
            {SESSION_ORDER.map((stateItem) => (
              <button
                className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  state.activeState === stateItem
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                    : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                }`}
                key={stateItem}
                onClick={() => controller.setStateFilter(stateItem)}
                type="button"
              >
                {stateItem}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                state.activeHealth === "all"
                  ? "border-amber-500 bg-amber-500/10 text-amber-500"
                  : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
              }`}
              onClick={() => controller.setHealthFilter("all")}
              type="button"
            >
              All health
            </button>
            {HEALTH_ORDER.map((health) => (
              <button
                className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  state.activeHealth === health
                    ? "border-amber-500 bg-amber-500/10 text-amber-500"
                    : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                }`}
                key={health}
                onClick={() => controller.setHealthFilter(health)}
                type="button"
              >
                {health}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {state.workspace.filters.sortOptions.map((option) => (
              <button
                className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  state.sortBy === option.id
                    ? "border-violet-500 bg-violet-500/10 text-violet-500"
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

        <SdkworkTerminalSessionList
          onOpenSession={onNavigate}
          onSelectSession={(sessionId) => controller.selectSession(sessionId)}
          profiles={state.workspace.profiles}
          selectedSessionId={state.selectedSessionId}
          sessions={state.visibleSessions}
        />
      </div>
      </div>
    </div>
  );
}
