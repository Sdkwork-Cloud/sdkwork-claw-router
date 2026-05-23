import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@sdkwork/ui-pc-react";
import type { SdkworkMarketItem } from "../market";

export interface SdkworkMarketDetailRailProps {
  item: SdkworkMarketItem | null;
  onNavigate?: (route: string) => void;
}

function resolvePrimaryAction(item: SdkworkMarketItem | null): string {
  if (!item) {
    return "Select an item";
  }

  return item.installed ? "Open package" : "Install package";
}

export function SdkworkMarketDetailRail({
  item,
  onNavigate,
}: SdkworkMarketDetailRailProps) {
  if (!item) {
    return (
      <aside className="rounded-[1.5rem] border border-dashed border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-6 text-sm text-[var(--sdk-color-text-secondary)]">
        Select a marketplace package to inspect its install posture, route target, and package signals.
      </aside>
    );
  }

  return (
    <aside className="rounded-[1.5rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-6 shadow-[var(--sdk-shadow-sm)]">
      <div className="inline-flex items-center gap-2 rounded-full bg-zinc-500/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--sdk-color-text-secondary)]">
        <Sparkles className="h-3.5 w-3.5" />
        Spotlight
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-[var(--sdk-color-text-primary)]">
        {item.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-[var(--sdk-color-text-secondary)]">
        {item.description}
      </p>

      <div className="mt-6 space-y-3 rounded-[1.2rem] bg-[var(--sdk-color-surface-panel-muted)] p-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[var(--sdk-color-text-muted)]">Author</span>
          <span className="font-medium text-[var(--sdk-color-text-primary)]">{item.author}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[var(--sdk-color-text-muted)]">Category</span>
          <span className="font-medium text-[var(--sdk-color-text-primary)]">{item.categoryId}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[var(--sdk-color-text-muted)]">Source</span>
          <span className="font-medium text-[var(--sdk-color-text-primary)]">{item.sourceKind}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[var(--sdk-color-text-muted)]">Installed</span>
          <span className="font-medium text-[var(--sdk-color-text-primary)]">{item.installed ? "Yes" : "No"}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            className="rounded-full bg-zinc-500/10 px-3 py-1 text-xs font-medium text-[var(--sdk-color-text-secondary)]"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={() => onNavigate?.(item.installRoute)} type="button">
          {resolvePrimaryAction(item)}
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
