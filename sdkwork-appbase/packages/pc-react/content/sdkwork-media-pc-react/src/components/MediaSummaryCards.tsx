import type { SdkworkMediaDigest } from "../media";
import { createSdkworkMediaPanelStyle } from "../media-appearance";
import { useSdkworkMediaIntl } from "../media-intl";

export function SdkworkMediaSummaryCards({ digest }: { digest: SdkworkMediaDigest }) {
  const {
    copy,
    formatInteger,
  } = useSdkworkMediaIntl();

  const cards = [
    {
      id: "items",
      label: copy.summary.totalItems,
      tone: "brand" as const,
      value: digest.totalItems,
    },
    {
      id: "queues",
      label: copy.summary.queues,
      tone: "neutral" as const,
      value: digest.queueCount,
    },
    {
      id: "ready",
      label: copy.summary.publishReady,
      tone: "success" as const,
      value: digest.publishReady,
    },
    {
      id: "attention",
      label: copy.summary.reviewAttention,
      tone: "warning" as const,
      value: digest.reviewAttention,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          className="rounded-[1.25rem] border p-4 shadow-[var(--sdk-shadow-soft)]"
          key={card.id}
          style={createSdkworkMediaPanelStyle(card.tone, {
            backgroundWeight: 8,
            borderWeight: 24,
          })}
        >
          <div className="text-sm text-[var(--sdk-color-text-secondary)]">{card.label}</div>
          <div className="mt-2 text-2xl font-semibold text-[var(--sdk-color-text-primary)]">{formatInteger(card.value)}</div>
        </article>
      ))}
    </div>
  );
}
