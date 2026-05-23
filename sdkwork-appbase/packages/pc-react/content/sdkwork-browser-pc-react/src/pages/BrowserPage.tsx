import { useEffect } from "react";
import {
  Button,
  LoadingBlock,
  StatusNotice,
} from "@sdkwork/ui-pc-react";
import {
  createSdkworkBrowserBackdropStyle,
  createSdkworkBrowserGlassStyle,
  createSdkworkBrowserHeroStyle,
  createSdkworkBrowserHeroTextStyle,
} from "../browser-appearance";
import type { SdkworkBrowserController } from "../browser-controller";
import {
  useSdkworkBrowserController,
  useSdkworkBrowserControllerState,
} from "../browser-controller";
import type { SdkworkBrowserSafeMode } from "../browser";
import { SdkworkBrowserSiteGroups } from "../components/BrowserSiteGroups";
import { SdkworkBrowserTabStrip } from "../components/BrowserTabStrip";
import type { SdkworkBrowserService } from "../browser-service";

export interface SdkworkBrowserPageProps {
  controller?: SdkworkBrowserController;
  onNavigate?: (route: string) => void;
  service?: Partial<SdkworkBrowserService>;
}

function resolveActionLabel(selectedTabTitle: string | undefined): string {
  return selectedTabTitle ? `Open ${selectedTabTitle}` : "Select a tab";
}

const SAFE_MODE_ORDER: SdkworkBrowserSafeMode[] = ["strict", "balanced", "open"];

export function SdkworkBrowserPage({
  controller: controllerProp,
  onNavigate,
  service,
}: SdkworkBrowserPageProps) {
  const controller = useSdkworkBrowserController(controllerProp, service);
  const state = useSdkworkBrowserControllerState(controller);
  const primaryHeroTextStyle = createSdkworkBrowserHeroTextStyle();
  const mutedHeroTextStyle = createSdkworkBrowserHeroTextStyle("muted");
  const subtleHeroTextStyle = createSdkworkBrowserHeroTextStyle("subtle");

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="relative h-full overflow-y-auto">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={createSdkworkBrowserBackdropStyle()}
      />

      <div className="relative px-4 py-4 sm:px-5 sm:py-5">
        <div className="mx-auto max-w-[96rem] space-y-5">
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(21rem,0.95fr)]">
          <div
            className="overflow-hidden rounded-[2rem] border border-[color-mix(in_srgb,var(--sdk-color-border-default)_72%,transparent)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]"
            style={createSdkworkBrowserHeroStyle()}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-semibold tracking-tight" style={primaryHeroTextStyle}>Browser Workspace</h1>
                <p className="mt-3 text-sm leading-7" style={mutedHeroTextStyle}>
                  Manage workspace tabs by site group, permission readiness, and safe-mode posture with deterministic routing intents.
                </p>
              </div>
              <Button onClick={() => void controller.refresh()} type="button" variant="secondary">
                Refresh tabs
              </Button>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <div
                className="rounded-[1.3rem] border p-4"
                style={createSdkworkBrowserGlassStyle("brand", {
                  backgroundWeight: 10,
                  borderWeight: 22,
                  surfaceWeight: 78,
                })}
              >
                <div className="text-xs uppercase tracking-[0.16em]" style={subtleHeroTextStyle}>Tabs</div>
                <div className="mt-2 text-3xl font-semibold" style={primaryHeroTextStyle}>{state.workspace.summary.tabCount}</div>
              </div>
              <div
                className="rounded-[1.3rem] border p-4"
                style={createSdkworkBrowserGlassStyle("accent", {
                  backgroundWeight: 10,
                  borderWeight: 22,
                  surfaceWeight: 78,
                })}
              >
                <div className="text-xs uppercase tracking-[0.16em]" style={subtleHeroTextStyle}>Strict mode</div>
                <div className="mt-2 text-3xl font-semibold" style={primaryHeroTextStyle}>{state.workspace.summary.strictModeTabs}</div>
              </div>
              <div
                className="rounded-[1.3rem] border p-4"
                style={createSdkworkBrowserGlassStyle("warning", {
                  backgroundWeight: 10,
                  borderWeight: 22,
                  surfaceWeight: 78,
                })}
              >
                <div className="text-xs uppercase tracking-[0.16em]" style={subtleHeroTextStyle}>Permission review</div>
                <div className="mt-2 text-3xl font-semibold" style={primaryHeroTextStyle}>{state.workspace.summary.reviewTabs}</div>
              </div>
            </div>
          </div>

          <aside className="rounded-[1.6rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-5 shadow-[var(--sdk-shadow-sm)]">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--sdk-color-text-muted)]">
              Selected tab
            </div>
            <div className="mt-2 text-xl font-semibold text-[var(--sdk-color-text-primary)]">
              {state.selectedTab?.title ?? "No tab selected"}
            </div>
            <p className="mt-2 text-sm leading-7 text-[var(--sdk-color-text-secondary)]">
              {state.selectedTab?.url ?? "Choose a tab to inspect posture and permission readiness."}
            </p>

            {state.selectedTab ? (
              <div className="mt-5 space-y-2 rounded-[1.2rem] bg-[var(--sdk-color-surface-panel-muted)] p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--sdk-color-text-muted)]">Posture</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">{state.selectedTab.posture}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--sdk-color-text-muted)]">Safe mode</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">{state.selectedTab.safeMode}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--sdk-color-text-muted)]">Permissions</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">
                    {state.selectedTab.permissionReadiness}
                  </span>
                </div>
              </div>
            ) : null}

            {state.selectedTab ? (
              <div className="mt-5">
                <Button onClick={() => onNavigate?.(state.selectedTab!.route)} type="button">
                  {resolveActionLabel(state.selectedTab?.title)}
                </Button>
              </div>
            ) : null}
          </aside>
        </section>

        {state.isLoading && !state.isBootstrapped ? <LoadingBlock label="Loading browser workspace..." /> : null}
        {state.lastError ? (
          <StatusNotice title="Browser workspace error" tone="danger">
            {state.lastError}
          </StatusNotice>
        ) : null}

        <section className="grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)]">
          <SdkworkBrowserSiteGroups
            activeGroupId={state.activeGroupId}
            groups={state.workspace.groups}
            onSelectGroup={(groupId) => controller.setGroupId(groupId)}
            tabs={state.workspace.tabs}
          />

          <div className="space-y-4">
            <section className="rounded-[1.6rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-5 shadow-[var(--sdk-shadow-sm)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <label className="inline-flex items-center gap-2 rounded-[0.95rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel-muted)] px-3 py-2 text-sm">
                  <span className="text-[var(--sdk-color-text-muted)]">Search</span>
                  <input
                    className="w-56 bg-transparent text-[var(--sdk-color-text-primary)] outline-none placeholder:text-[var(--sdk-color-text-muted)]"
                    onChange={(event) => controller.setSearchQuery(event.target.value)}
                    placeholder="title, url, permission"
                    type="text"
                    value={state.searchQuery}
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  {SAFE_MODE_ORDER.map((mode) => (
                    <button
                      className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        state.activeSafeMode === mode
                          ? "border-sky-500 bg-sky-500/10 text-sky-500"
                          : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                      }`}
                      key={mode}
                      onClick={() => controller.setSafeMode(mode)}
                      type="button"
                    >
                      {mode}
                    </button>
                  ))}
                  <button
                    className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      state.activeSafeMode === "all"
                        ? "border-sky-500 bg-sky-500/10 text-sky-500"
                        : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                    }`}
                    onClick={() => controller.setSafeMode("all")}
                    type="button"
                  >
                    all
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {state.workspace.filters.sortOptions.map((option) => (
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

            <SdkworkBrowserTabStrip
              onOpenTab={onNavigate}
              onSelectTab={(tabId) => controller.selectTab(tabId)}
              selectedTabId={state.selectedTabId}
              tabs={state.visibleTabs}
            />
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}
