import { DesktopShellFrame, SearchCommandPalette } from "@sdkwork/ui-pc-react";
import { useMemo, type ReactNode } from "react";
import type { SdkworkCommandGroup } from "@sdkwork/command-pc-react";
import type { SdkworkShellBlueprint, SdkworkShellCommandEntry } from "./shell";
import { useSdkworkShell } from "./SdkworkShellProvider";

function resolvePaletteGroups(groups: readonly SdkworkCommandGroup[]) {
  return groups.map((group) => ({
    heading: group.heading,
    id: group.heading,
    items: group.items.map((item) => ({
      description: item.description,
      id: item.id,
      keywords: item.keywords ? [...item.keywords] : undefined,
      label: item.title,
      shortcut: item.shortcut,
    })),
  }));
}

function createAmbientBackground(primarySoft: string) {
  return {
    background: `radial-gradient(circle at top, ${primarySoft} 0%, transparent 68%)`,
  };
}

function createBrandAura(brandPrimary: string) {
  return {
    boxShadow: `0 12px 32px color-mix(in srgb, ${brandPrimary} 22%, transparent)`,
  };
}

function SdkworkShellIdentity({
  brand,
  brandMark,
  subtitle,
  title,
}: Pick<SdkworkShellLayoutProps, "brand" | "brandMark" | "subtitle" | "title">) {
  const { theme } = useSdkworkShell();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-[var(--sdk-color-border-default)] bg-[color-mix(in_srgb,var(--sdk-color-brand-primary)_22%,var(--sdk-color-surface-panel)_78%)] text-[11px] font-black uppercase tracking-[0.18em] text-[var(--sdk-color-text-inverse)]"
        style={createBrandAura(theme.brand.primary)}
      >
        {brandMark}
      </div>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 rounded-full border border-[var(--sdk-color-border-default)] bg-[color-mix(in_srgb,var(--sdk-color-surface-elevated)_42%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sdk-color-text-secondary)]">
            {brand}
          </span>
          <h1 className="truncate text-sm font-semibold leading-none text-[var(--sdk-color-text-primary)]">
            {title}
          </h1>
        </div>
        <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sdk-color-text-muted)]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export interface SdkworkShellLayoutProps {
  actions?: ReactNode;
  blueprint?: SdkworkShellBlueprint;
  brand?: ReactNode;
  brandMark?: ReactNode;
  commandEntries?: readonly SdkworkShellCommandEntry[];
  commandGroups?: readonly SdkworkCommandGroup[];
  content: ReactNode;
  isCommandPaletteOpen?: boolean;
  navigation?: ReactNode;
  navigationVisible?: boolean;
  onCommandPaletteOpenChange?: (open: boolean) => void;
  onCommandSelect?: (command: SdkworkShellCommandEntry) => void;
  sidebar?: ReactNode;
  subtitle?: ReactNode;
  title?: ReactNode;
}

export function SdkworkShellLayout({
  actions,
  blueprint,
  brand,
  brandMark,
  commandEntries,
  commandGroups,
  content,
  isCommandPaletteOpen,
  navigation,
  navigationVisible,
  onCommandPaletteOpenChange,
  onCommandSelect,
  sidebar,
  subtitle,
  title,
}: SdkworkShellLayoutProps) {
  const shell = useSdkworkShell();
  const { theme } = shell;
  const resolvedBrand = brand ?? blueprint?.identity.brand ?? "SDKWORK";
  const resolvedBrandMark = brandMark ?? blueprint?.identity.monogram ?? "AI";
  const resolvedCommandEntries = commandEntries ?? blueprint?.commandEntries ?? [];
  const resolvedCommandGroups = commandGroups ?? blueprint?.commandGroups ?? [];
  const resolvedNavigationVisible = navigationVisible ?? shell.isNavigationOpen;
  const resolvedPaletteOpen = isCommandPaletteOpen ?? shell.isCommandPaletteOpen;
  const handleCommandPaletteOpenChange = onCommandPaletteOpenChange ?? shell.setCommandPaletteOpen;
  const resolvedSubtitle = subtitle ?? blueprint?.identity.subtitle ?? "Composable AI workspace";
  const resolvedTitle = title ?? blueprint?.identity.title ?? "SDKWORK Shell";
  const commandEntryMap = useMemo(
    () =>
      new Map(
        resolvedCommandEntries.map((command) => [
          command.id,
          command,
        ]),
      ),
    [resolvedCommandEntries],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--sdk-color-surface-canvas)] text-[var(--sdk-color-text-primary)]">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-0 top-0 h-48"
          style={createAmbientBackground(theme.brand.primarySoft)}
        />
        <div
          className="absolute inset-y-0 left-0 w-80 opacity-80"
          style={{
            background:
              "radial-gradient(circle at left, color-mix(in srgb, var(--sdk-color-surface-elevated) 55%, transparent) 0%, transparent 72%)",
          }}
        />
      </div>

      <DesktopShellFrame
        actions={actions}
        content={content}
        leading={
          <SdkworkShellIdentity
            brand={resolvedBrand}
            brandMark={resolvedBrandMark}
            subtitle={resolvedSubtitle}
            title={resolvedTitle}
          />
        }
        navigation={navigation}
        sidebar={resolvedNavigationVisible ? sidebar : null}
        slotProps={{
          content: {
            className: "bg-transparent",
          },
        }}
        theme={theme}
      />

      {resolvedCommandGroups.length > 0 ? (
        <SearchCommandPalette
          groups={resolvePaletteGroups(resolvedCommandGroups)}
          onItemSelect={(item) => {
            const command = commandEntryMap.get(item.id);
            if (command) {
              onCommandSelect?.(command);
            }
          }}
          onOpenChange={handleCommandPaletteOpenChange}
          open={resolvedPaletteOpen}
          placeholder="Search commands, routes, and tools"
          title="SDKWORK command palette"
        />
      ) : null}
    </div>
  );
}
