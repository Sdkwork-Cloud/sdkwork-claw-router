import { EmptyState } from "@sdkwork/ui-pc-react";
import type { SdkworkVideoAsset } from "../video";
import {
  createSdkworkVideoPanelStyle,
  createSdkworkVideoToneStyle,
  type SdkworkVideoVisualTone,
} from "../video-appearance";
import { useSdkworkVideoIntl } from "../video-intl";

export function SdkworkVideoGallery({ videos }: { videos: readonly SdkworkVideoAsset[] }) {
  const {
    copy,
    formatSceneCount,
    formatStatusLabel,
  } = useSdkworkVideoIntl();

  if (videos.length === 0) {
    return (
      <EmptyState
        description={copy.empty.noVideosDescription}
        title={copy.empty.noVideosTitle}
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {videos.map((video) => {
        const tone: SdkworkVideoVisualTone = video.status === "ready"
          ? "success"
          : video.status === "queued"
            ? "warning"
            : "brand";

        return (
          <article
            className="rounded-[1.2rem] border p-4 shadow-[var(--sdk-shadow-soft)]"
            key={video.id}
            style={createSdkworkVideoPanelStyle("neutral", {
              backgroundWeight: 8,
              borderWeight: 20,
            })}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-[var(--sdk-color-text-primary)]">{video.title}</h3>
              <span
                className="rounded-full border px-2.5 py-1 text-xs font-semibold uppercase"
                style={createSdkworkVideoToneStyle(tone, {
                  backgroundWeight: 14,
                  borderWeight: 26,
                })}
              >
                {formatStatusLabel(video.status)}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--sdk-color-text-secondary)]">
              {video.durationLabel} | {formatSceneCount(video.sceneCount)}
            </p>
          </article>
        );
      })}
    </div>
  );
}
