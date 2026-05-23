import { EmptyState } from "@sdkwork/ui-pc-react";
import type { SdkworkMediaItem } from "../media";
import {
  createSdkworkMediaPanelStyle,
  createSdkworkMediaToneStyle,
  type SdkworkMediaVisualTone,
} from "../media-appearance";
import { useSdkworkMediaIntl } from "../media-intl";

export function SdkworkMediaItemGrid({ items }: { items: readonly SdkworkMediaItem[] }) {
  const {
    copy,
    formatKindLabel,
    formatPublishPostureLabel,
  } = useSdkworkMediaIntl();

  if (items.length === 0) {
    return (
      <EmptyState
        description={copy.empty.noItemsDescription}
        title={copy.empty.noItemsTitle}
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {items.map((item) => {
        const tone: SdkworkMediaVisualTone = item.kind === "audio"
          ? "accent"
          : item.kind === "image"
            ? "warning"
            : "brand";

        return (
          <article
            className="rounded-[1.2rem] border p-4 shadow-[var(--sdk-shadow-soft)]"
            key={item.id}
            style={createSdkworkMediaPanelStyle("neutral", {
              backgroundWeight: 8,
              borderWeight: 20,
            })}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-[var(--sdk-color-text-primary)]">{item.title}</h3>
              <span
                className="rounded-full border px-2.5 py-1 text-xs font-semibold uppercase"
                style={createSdkworkMediaToneStyle(tone, {
                  backgroundWeight: 14,
                  borderWeight: 26,
                })}
              >
                {formatKindLabel(item.kind)}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--sdk-color-text-secondary)]">
              {item.durationLabel} | {formatPublishPostureLabel(item.publishPosture)}
            </p>
          </article>
        );
      })}
    </div>
  );
}
