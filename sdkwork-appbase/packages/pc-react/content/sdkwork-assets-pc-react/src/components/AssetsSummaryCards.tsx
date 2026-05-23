import type { SdkworkAssetsDigest } from "../assets";

export interface SdkworkAssetsSummaryCardsProps {
  digest: SdkworkAssetsDigest;
}

export function SdkworkAssetsSummaryCards({ digest }: SdkworkAssetsSummaryCardsProps) {
  const cards = [
    { id: "total", label: "Total assets", value: digest.totalAssets },
    { id: "ready", label: "Ready assets", value: digest.readyAssets },
    { id: "attention", label: "Attention required", value: digest.attentionRequired },
    { id: "collections", label: "Collections", value: digest.collectionCount },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          className="rounded-[1.25rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4"
          key={card.id}
        >
          <div className="text-sm text-[var(--sdk-color-text-secondary)]">{card.label}</div>
          <div className="mt-2 text-2xl font-semibold text-[var(--sdk-color-text-primary)]">{card.value}</div>
        </article>
      ))}
    </div>
  );
}
