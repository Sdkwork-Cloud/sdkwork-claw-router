import { useEffect } from "react";
import {
  LoadingBlock,
  StatusNotice,
} from "@sdkwork/ui-pc-react";
import type { SdkworkMediaPublishPosture } from "../media";
import { SdkworkMediaItemGrid } from "../components/MediaItemGrid";
import { SdkworkMediaSummaryCards } from "../components/MediaSummaryCards";
import {
  createSdkworkMediaBackdropStyle,
  createSdkworkMediaHeroStyle,
  createSdkworkMediaHeroTextStyle,
  createSdkworkMediaPanelStyle,
  createSdkworkMediaToneStyle,
} from "../media-appearance";
import type { SdkworkMediaMessagesOverrides } from "../media-copy";
import {
  useSdkworkMediaController,
  useSdkworkMediaControllerState,
} from "../media-controller";
import {
  SdkworkMediaIntlProvider,
  useSdkworkMediaIntl,
} from "../media-intl";
import type { SdkworkMediaService } from "../media-service";

export interface SdkworkMediaPageProps {
  controller?: ReturnType<typeof import("../media-controller").createSdkworkMediaController>;
  locale?: string | null;
  messages?: SdkworkMediaMessagesOverrides;
  service?: Partial<SdkworkMediaService>;
}

interface SdkworkMediaPageContentProps extends SdkworkMediaPageProps {}

const publishPostures: Array<SdkworkMediaPublishPosture | "all"> = ["all", "ready", "draft", "blocked"];

function SdkworkMediaPageContent({
  controller: controllerProp,
  locale,
  messages,
  service,
}: SdkworkMediaPageContentProps) {
  const controller = useSdkworkMediaController(controllerProp, {
    locale,
    messages,
    service,
  });
  const state = useSdkworkMediaControllerState(controller);
  const {
    copy,
    formatPublishPostureLabel,
  } = useSdkworkMediaIntl();
  const primaryHeroTextStyle = createSdkworkMediaHeroTextStyle();
  const mutedHeroTextStyle = createSdkworkMediaHeroTextStyle("muted");
  const subtleHeroTextStyle = createSdkworkMediaHeroTextStyle("subtle");

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="relative h-full overflow-y-auto">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={createSdkworkMediaBackdropStyle()}
      />

      <div className="relative px-4 py-4 sm:px-5 sm:py-5">
        <div className="mx-auto max-w-[96rem] space-y-5">
          <section
            className="rounded-[2rem] border border-[color-mix(in_srgb,var(--sdk-color-border-default)_72%,transparent)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]"
            style={createSdkworkMediaHeroStyle()}
          >
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]" style={subtleHeroTextStyle}>
              {copy.page.eyebrow}
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight" style={primaryHeroTextStyle}>{copy.page.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7" style={mutedHeroTextStyle}>
              {copy.page.description}
            </p>
          </section>

          {state.isLoading && !state.isBootstrapped ? <LoadingBlock label={copy.page.loading} /> : null}
          {state.lastError ? <StatusNotice title={copy.page.errorTitle} tone="danger">{state.lastError}</StatusNotice> : null}

          <SdkworkMediaSummaryCards digest={state.workspace.digest} />

          <section
            className="rounded-[1.5rem] border p-5 shadow-[var(--sdk-shadow-soft)]"
            style={createSdkworkMediaPanelStyle("neutral", {
              backgroundWeight: 8,
              borderWeight: 20,
            })}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <input
                aria-label={copy.page.searchLabel}
                className="w-full rounded-[0.95rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] px-3 py-2 text-sm text-[var(--sdk-color-text-primary)] shadow-[var(--sdk-shadow-sm)] outline-none ring-offset-[var(--sdk-color-surface-canvas)] placeholder:text-[var(--sdk-color-text-muted)] focus-visible:ring-2 focus-visible:ring-[var(--sdk-color-border-focus)]"
                onChange={(event) => controller.setSearchQuery(event.target.value)}
                placeholder={copy.page.searchPlaceholder}
                type="search"
                value={state.searchQuery}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-full border px-3 py-1.5 text-xs font-semibold"
                  onClick={() => controller.setQueue("all")}
                  style={state.activeQueue === "all"
                    ? createSdkworkMediaToneStyle("brand", {
                      backgroundWeight: 18,
                      borderWeight: 30,
                    })
                    : undefined}
                  type="button"
                >
                  {copy.queues.all}
                </button>
                {state.workspace.queues.map((queue) => (
                  <button
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      state.activeQueue === queue.id
                        ? ""
                        : "border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel-muted)] text-[var(--sdk-color-text-secondary)]"
                    }`}
                    key={queue.id}
                    onClick={() => controller.setQueue(queue.id)}
                    style={state.activeQueue === queue.id
                      ? createSdkworkMediaToneStyle("accent", {
                        backgroundWeight: 18,
                        borderWeight: 30,
                      })
                      : undefined}
                    type="button"
                  >
                    {queue.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {publishPostures.map((publishPosture) => (
                <button
                  className={`rounded-[0.85rem] border px-3 py-1.5 text-xs font-semibold ${
                    state.activePublishPosture === publishPosture
                      ? ""
                      : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                  }`}
                  key={publishPosture}
                  onClick={() => controller.setPublishPosture(publishPosture as SdkworkMediaPublishPosture | "all")}
                  style={state.activePublishPosture === publishPosture
                    ? createSdkworkMediaToneStyle(
                      publishPosture === "ready"
                        ? "success"
                        : publishPosture === "draft"
                          ? "accent"
                          : publishPosture === "blocked"
                            ? "danger"
                            : "brand",
                      {
                        backgroundWeight: 14,
                        borderWeight: 28,
                      },
                    )
                    : undefined}
                  type="button"
                >
                  {formatPublishPostureLabel(publishPosture)}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <SdkworkMediaItemGrid items={state.visibleItems} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function SdkworkMediaPage({
  locale,
  messages,
  ...props
}: SdkworkMediaPageProps) {
  const content = (
    <SdkworkMediaPageContent
      {...props}
      locale={locale}
      messages={messages}
    />
  );

  if (locale || messages) {
    return (
      <SdkworkMediaIntlProvider locale={locale} messages={messages}>
        {content}
      </SdkworkMediaIntlProvider>
    );
  }

  return content;
}
