import { EmptyState } from "@sdkwork/ui-pc-react";
import type { SdkworkMarketItem } from "../market";

export interface SdkworkMarketListingCardsProps {
  items: readonly SdkworkMarketItem[];
  onNavigate?: (route: string) => void;
  onSelectItem?: (itemId: string) => void;
  selectedItemId?: string | null;
}

function resolveActionLabel(item: SdkworkMarketItem): string {
  return item.installed ? `Open ${item.title}` : `Install ${item.title}`;
}

export function SdkworkMarketListingCards({
  items,
  onNavigate,
  onSelectItem,
  selectedItemId,
}: SdkworkMarketListingCardsProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        description="No market packages match the active filters."
        title="No market packages"
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {items.map((item) => {
        const isSelected = selectedItemId === item.id;

        return (
          <article
            className={`rounded-[1.45rem] border p-5 shadow-[var(--sdk-shadow-sm)] transition-colors ${
              isSelected
                ? "border-rose-400 bg-rose-500/10"
                : "border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)]"
            }`}
            key={item.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--sdk-color-text-muted)]">
                  {item.kind} | {item.categoryId}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-[var(--sdk-color-text-primary)]">{item.title}</h3>
              </div>
              {item.featured ? (
                <span className="rounded-full bg-sky-500/12 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sky-500">
                  Featured
                </span>
              ) : null}
            </div>

            <p className="mt-3 text-sm leading-7 text-[var(--sdk-color-text-secondary)]">{item.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  className="rounded-full bg-[var(--sdk-color-surface-panel-muted)] px-2.5 py-1 text-xs text-[var(--sdk-color-text-secondary)]"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-sm text-[var(--sdk-color-text-muted)]">
              <span>Rating {item.rating.toFixed(1)}</span>
              <span>{item.downloads.toLocaleString()} downloads</span>
              <span>{item.sourceKind}</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                className="rounded-[0.95rem] bg-[linear-gradient(135deg,#111827,#18181b_58%,#27272a)] px-4 py-2 text-xs font-semibold text-white"
                onClick={() => onNavigate?.(item.installRoute)}
                type="button"
              >
                {resolveActionLabel(item)}
              </button>
              <button
                aria-label={`Select ${item.title}`}
                className="rounded-[0.95rem] border border-[var(--sdk-color-border-default)] px-4 py-2 text-xs font-semibold text-[var(--sdk-color-text-primary)]"
                onClick={() => onSelectItem?.(item.id)}
                type="button"
              >
                Select {item.title}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
