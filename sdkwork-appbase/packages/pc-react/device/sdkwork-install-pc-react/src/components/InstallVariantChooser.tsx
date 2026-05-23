import { EmptyState } from "@sdkwork/ui-pc-react";
import type { SdkworkInstallVariant } from "../install";

export interface SdkworkInstallVariantChooserProps {
  onNavigate?: (route: string) => void;
  onSelectVariant?: (variantId: string) => void;
  selectedVariantId?: string | null;
  variants: readonly SdkworkInstallVariant[];
}

export function SdkworkInstallVariantChooser({
  onNavigate,
  onSelectVariant,
  selectedVariantId,
  variants,
}: SdkworkInstallVariantChooserProps) {
  if (variants.length === 0) {
    return (
      <EmptyState
        description="No install variants are currently available for this workspace."
        title="No install variants"
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {variants.map((variant) => {
        const isSelected = variant.id === selectedVariantId;

        return (
          <article
            className={`rounded-[1.5rem] border p-5 shadow-[var(--sdk-shadow-sm)] transition-all ${
              isSelected
                ? "border-cyan-400 bg-[linear-gradient(180deg,rgba(34,211,238,0.12),rgba(9,9,11,0.02))] shadow-[var(--sdk-shadow-lg)]"
                : "border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)]"
            }`}
            key={variant.id}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--sdk-color-surface-panel-muted)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--sdk-color-text-muted)]">
                {variant.targetKind}
              </span>
              <span className="rounded-full bg-[var(--sdk-color-surface-panel-muted)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--sdk-color-text-muted)]">
                {variant.runtimePlatform}
              </span>
              {variant.recommended ? (
                <span className="rounded-full bg-cyan-500/14 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cyan-500">
                  Recommended
                </span>
              ) : null}
            </div>

            <h3 className="mt-4 text-xl font-semibold text-[var(--sdk-color-text-primary)]">
              {variant.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--sdk-color-text-secondary)]">
              {variant.description}
            </p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[var(--sdk-color-text-muted)]">Install path</span>
                <span className="font-medium text-[var(--sdk-color-text-primary)]">
                  {variant.installPath}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[var(--sdk-color-text-muted)]">Estimated time</span>
                <span className="font-medium text-[var(--sdk-color-text-primary)]">
                  {variant.estimatedMinutes} min
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[var(--sdk-color-text-muted)]">Dependencies</span>
                <span className="font-medium text-[var(--sdk-color-text-primary)]">
                  {variant.dependencies.length}
                </span>
              </div>
            </div>

            {variant.tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {variant.tags.map((tag) => (
                  <span
                    className="rounded-full border border-[var(--sdk-color-border-default)] px-2.5 py-1 text-xs text-[var(--sdk-color-text-secondary)]"
                    key={`${variant.id}-${tag}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                aria-label={`Open install route for ${variant.title}`}
                className="flex-1 rounded-[0.95rem] bg-[linear-gradient(135deg,#111827,#0f172a_45%,#3f3f46)] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                onClick={() => onNavigate?.(variant.route)}
                type="button"
              >
                Open route
              </button>
              <button
                aria-label={`Select ${variant.title}`}
                className="rounded-[0.95rem] border border-[var(--sdk-color-border-default)] px-4 py-2.5 text-sm font-semibold text-[var(--sdk-color-text-primary)] transition-colors hover:bg-[var(--sdk-color-surface-panel-muted)]"
                onClick={() => onSelectVariant?.(variant.id)}
                type="button"
              >
                {isSelected ? "Selected" : "Select"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
