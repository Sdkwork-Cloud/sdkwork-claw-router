import type { SdkworkAsset } from "../assets";

export interface SdkworkAssetsGridProps {
  assets: readonly SdkworkAsset[];
}

export function SdkworkAssetsGrid({ assets }: SdkworkAssetsGridProps) {
  if (assets.length === 0) {
    return (
      <div className="rounded-[1.2rem] border border-dashed border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel-muted)] px-4 py-8 text-center text-sm text-[var(--sdk-color-text-secondary)]">
        No assets match the current filters.
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {assets.map((asset) => (
        <article
          className="rounded-[1.2rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4"
          key={asset.id}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-[var(--sdk-color-text-primary)]">{asset.title}</h3>
            <span className="rounded-full bg-[var(--sdk-color-surface-panel-muted)] px-2 py-0.5 text-xs font-semibold uppercase text-[var(--sdk-color-text-secondary)]">
              {asset.format}
            </span>
          </div>
          <p className="mt-2 text-sm text-[var(--sdk-color-text-secondary)]">
            {asset.sizeLabel} | {asset.readiness}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {asset.tags.map((tag) => (
              <span
                className="rounded-full bg-[var(--sdk-color-surface-panel-muted)] px-2 py-0.5 text-xs text-[var(--sdk-color-text-secondary)]"
                key={`${asset.id}-${tag}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
