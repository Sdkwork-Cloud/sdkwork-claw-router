import type { SdkworkVideoDigest } from "../video";
import { createSdkworkVideoPanelStyle } from "../video-appearance";
import { useSdkworkVideoIntl } from "../video-intl";

export function SdkworkVideoSummaryCards({ digest }: { digest: SdkworkVideoDigest }) {
  const {
    copy,
    formatInteger,
  } = useSdkworkVideoIntl();

  const cards = [
    {
      id: "total",
      label: copy.summary.totalVideos,
      tone: "brand" as const,
      value: digest.totalVideos,
    },
    {
      id: "ready",
      label: copy.summary.readyVideos,
      tone: "success" as const,
      value: digest.readyVideos,
    },
    {
      id: "renders",
      label: copy.summary.activeRenders,
      tone: "accent" as const,
      value: digest.activeRenders,
    },
    {
      id: "presets",
      label: copy.summary.presets,
      tone: "neutral" as const,
      value: digest.presetCount,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          className="rounded-[1.25rem] border p-4 shadow-[var(--sdk-shadow-soft)]"
          key={card.id}
          style={createSdkworkVideoPanelStyle(card.tone, {
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
