import {
  PageHeader,
  WorkspaceScaffold,
  WorkspaceTabs,
} from "@sdkwork/ui-pc-react";
import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useOptionalSdkworkWorkspace } from "./SdkworkWorkspaceProvider";
import type {
  SdkworkWorkspaceBlueprint,
  SdkworkWorkspaceNavigationItem,
  SdkworkWorkspaceNavigationSection,
  SdkworkWorkspaceTab,
} from "./workspace";

function createStatusTone(status: SdkworkWorkspaceNavigationItem["status"]) {
  if (status === "attention") {
    return "border-amber-500/25 bg-amber-500/10 text-amber-300";
  }

  if (status === "ready") {
    return "border-emerald-500/25 bg-emerald-500/10 text-emerald-300";
  }

  return "border-white/8 bg-white/[0.04] text-zinc-400";
}

function renderNavigationSections(
  sections: readonly SdkworkWorkspaceNavigationSection[],
  activeItemId: string | undefined,
  onSelect: (item: SdkworkWorkspaceNavigationItem) => void,
) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <section
          data-sdk-role="workspace-nav-section"
          key={section.id}
        >
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--sdk-color-text-muted)]">
            {section.title}
          </div>
          <div className="space-y-2">
            {section.items.map((item) => {
              const active = item.id === activeItemId;

              return (
                <button
                  className={[
                    "flex w-full items-start justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition",
                    active
                      ? "border-[var(--sdk-color-brand-primary)] bg-[var(--sdk-color-brand-primary-soft)] text-[var(--sdk-color-text-primary)] shadow-[var(--sdk-shadow-soft)]"
                      : "border-[var(--sdk-color-border-subtle)] bg-[var(--sdk-color-surface-panel-muted)] text-[var(--sdk-color-text-secondary)] hover:border-[var(--sdk-color-border-default)] hover:bg-[var(--sdk-color-surface-elevated)]",
                  ].join(" ")}
                  data-active={active ? "true" : "false"}
                  key={item.id}
                  onClick={() => onSelect(item)}
                  type="button"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{item.label}</span>
                    {item.description ? (
                      <span className="mt-1 block text-xs text-[var(--sdk-color-text-muted)]">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {item.badge ? (
                      <span className="text-xs text-[var(--sdk-color-text-muted)]">{item.badge}</span>
                    ) : null}
                    {item.status ? (
                      <span
                        className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${createStatusTone(item.status)}`}
                      >
                        {item.status}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function createWorkspaceTabItems(tabs: readonly SdkworkWorkspaceTab[]) {
  return tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    meta: tab.badge,
    modified: tab.modified,
  }));
}

export interface SdkworkWorkspaceSurfaceProps {
  actions?: ReactNode;
  blueprint?: SdkworkWorkspaceBlueprint;
  bottom?: ReactNode;
  bottomTitle?: ReactNode;
  description?: ReactNode;
  detail?: ReactNode;
  detailTitle?: ReactNode;
  filters?: ReactNode;
  main: ReactNode;
  navigationActiveItemId?: string;
  navigationSections?: readonly SdkworkWorkspaceNavigationSection[];
  onNavigationItemSelect?: (item: SdkworkWorkspaceNavigationItem) => void;
  onTabChange?: (tab: SdkworkWorkspaceTab) => void;
  selectionBar?: ReactNode;
  statusBar?: ReactNode;
  tabs?: readonly SdkworkWorkspaceTab[];
  title?: ReactNode;
}

export function SdkworkWorkspaceSurface({
  actions,
  blueprint,
  bottom,
  bottomTitle = "Console",
  description,
  detail,
  detailTitle = "Inspector",
  filters,
  main,
  navigationActiveItemId,
  navigationSections,
  onNavigationItemSelect,
  onTabChange,
  selectionBar,
  statusBar,
  tabs,
  title,
}: SdkworkWorkspaceSurfaceProps) {
  const workspace = useOptionalSdkworkWorkspace();
  const resolvedSections = navigationSections ?? blueprint?.navigationSections ?? [];
  const resolvedTabs = tabs ?? blueprint?.tabs ?? [];
  const [localNavigationItemId, setLocalNavigationItemId] = useState<string | undefined>(
    blueprint?.defaultActiveNavigationItemId ?? resolvedSections[0]?.items[0]?.id,
  );
  const [localActiveTabId, setLocalActiveTabId] = useState<string | undefined>(
    blueprint?.defaultActiveTabId ?? resolvedTabs[0]?.id,
  );
  const resolvedTitle = title ?? blueprint?.title ?? "Workspace";
  const resolvedDescription = description ?? blueprint?.description;
  const resolvedActiveNavigationItemId =
    navigationActiveItemId ??
    workspace?.activeNavigationItemId ??
    localNavigationItemId ??
    blueprint?.defaultActiveNavigationItemId;
  const resolvedActiveTabId =
    workspace?.activeTabId ?? localActiveTabId ?? blueprint?.defaultActiveTabId ?? resolvedTabs[0]?.id;
  const showInspector = Boolean(detail) && (workspace?.isInspectorOpen ?? true);
  const showBottomPanel = Boolean(bottom) && (workspace?.isBottomPanelOpen ?? true);
  const tabLookup = useMemo(
    () =>
      new Map(
        resolvedTabs.map((tab) => [
          tab.id,
          tab,
        ]),
      ),
    [resolvedTabs],
  );

  return (
    <WorkspaceScaffold
      header={
        <PageHeader
          actions={actions}
          description={resolvedDescription}
          title={resolvedTitle}
        />
      }
      inspector={
        showInspector
          ? {
              children: detail,
              title: detailTitle,
            }
          : undefined
      }
      bottomPanel={
        showBottomPanel
          ? {
              children: bottom,
              title: bottomTitle,
            }
          : undefined
      }
      main={{
        children: main,
        description: resolvedDescription,
        title: resolvedTitle,
      }}
      sidebar={
        resolvedSections.length > 0
          ? {
              children: renderNavigationSections(
                resolvedSections,
                resolvedActiveNavigationItemId,
                (item) => {
                  onNavigationItemSelect?.(item);
                  if (navigationActiveItemId === undefined) {
                    workspace?.setActiveNavigationItemId(item.id);
                    if (!workspace) {
                      setLocalNavigationItemId(item.id);
                    }
                  }
                },
              ),
              description: "Composable workspace navigation",
              title: "Workspace",
            }
          : undefined
      }
      statusBar={statusBar}
      toolbar={
        resolvedTabs.length > 0 || filters || selectionBar ? (
          <div className="space-y-3">
            {resolvedTabs.length > 0 ? (
              <WorkspaceTabs
                actions={filters}
                items={createWorkspaceTabItems(resolvedTabs)}
                onValueChange={(tabId) => {
                  const tab = tabLookup.get(tabId);
                  if (!tab) {
                    return;
                  }

                  onTabChange?.(tab);
                  workspace?.setActiveTabId(tabId);
                  if (!workspace) {
                    setLocalActiveTabId(tabId);
                  }
                }}
                value={resolvedActiveTabId ?? null}
              />
            ) : filters ? (
              <div>{filters}</div>
            ) : null}
            {selectionBar ? <div>{selectionBar}</div> : null}
          </div>
        ) : undefined
      }
    />
  );
}
