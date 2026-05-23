import { useEffect } from "react";
import {
  Boxes,
  GaugeCircle,
  Radio,
  Sparkles,
} from "lucide-react";
import {
  Button,
  LoadingBlock,
  StatusNotice,
} from "@sdkwork/ui-pc-react";
import type {
  SdkworkDistributionArtifact,
  SdkworkDistributionChannelType,
} from "../distribution";
import type { SdkworkDistributionController } from "../distribution-controller";
import {
  useSdkworkDistributionController,
  useSdkworkDistributionControllerState,
} from "../distribution-controller";
import type { SdkworkDistributionService } from "../distribution-service";
import { SdkworkDistributionChannelCards } from "../components/DistributionChannelCards";

export interface SdkworkDistributionPageProps {
  controller?: SdkworkDistributionController;
  onNavigate?: (route: string) => void;
  service?: Partial<SdkworkDistributionService>;
}

function channelTypeLabel(value: SdkworkDistributionChannelType): string {
  if (value === "stable") {
    return "Stable";
  }

  if (value === "candidate") {
    return "Candidate";
  }

  if (value === "preview") {
    return "Preview";
  }

  return "Internal";
}

function artifactStatusTone(status: SdkworkDistributionArtifact["status"]): string {
  if (status === "ready") {
    return "text-emerald-400";
  }

  if (status === "building") {
    return "text-sky-400";
  }

  if (status === "blocked") {
    return "text-rose-400";
  }

  return "text-amber-400";
}

export function SdkworkDistributionPage({
  controller: controllerProp,
  onNavigate,
  service,
}: SdkworkDistributionPageProps) {
  const controller = useSdkworkDistributionController(controllerProp, service);
  const state = useSdkworkDistributionControllerState(controller);
  const channelTypes = Array.from(new Set(state.catalog.channels.map((channel) => channel.type))) as SdkworkDistributionChannelType[];
  const selectedChannel = state.selectedChannel;
  const visibleArtifacts = selectedChannel
    ? state.catalog.artifacts.filter((artifact) => selectedChannel.artifactIds.includes(artifact.id))
    : state.catalog.artifacts;

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="h-full overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[96rem] space-y-5">
        <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_28%),linear-gradient(135deg,#09090b,#111827_44%,#27272a)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/68">
                <Sparkles className="h-3.5 w-3.5" />
                Release Workspace
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight">Distribution Center</h1>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Coordinate release channels, artifact readiness, rollout scope, and approval signals across platform distribution pipelines.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {selectedChannel ? (
                <Button
                  onClick={() => onNavigate?.(`/distribution?channelId=${selectedChannel.id}`)}
                  type="button"
                >
                  Open selected channel
                </Button>
              ) : null}
              <Button onClick={() => void controller.refresh()} type="button" variant="outline">
                Refresh distribution state
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.45rem] bg-white/8 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-white/65">Ready artifacts</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    {state.catalog.summary.readyArtifacts}
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] bg-emerald-400/15 text-emerald-200">
                  <Boxes className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-[1.45rem] bg-white/8 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-white/65">Rollout average</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    {state.catalog.summary.rolloutAveragePercent}%
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] bg-sky-400/15 text-sky-200">
                  <GaugeCircle className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-[1.45rem] bg-white/8 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-white/65">Approval pending</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    {state.catalog.summary.approvalPending}
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] bg-amber-400/15 text-amber-200">
                  <Radio className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {state.isLoading && !state.isBootstrapped ? <LoadingBlock label="Loading distribution center..." /> : null}

        {state.lastError ? (
          <StatusNotice title="Distribution center error" tone="danger">
            {state.lastError}
          </StatusNotice>
        ) : null}

        <section className="space-y-5 rounded-[1.5rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-5 shadow-[var(--sdk-shadow-sm)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sdk-color-text-muted)]">
                Release Channels
              </div>
              <h2 className="mt-2 text-xl font-semibold text-[var(--sdk-color-text-primary)]">
                Channel overview
              </h2>
            </div>

            <div className="inline-flex flex-wrap gap-2">
              <Button
                onClick={() => controller.setChannelType("all")}
                type="button"
                variant={state.activeChannelType === "all" ? "secondary" : "ghost"}
              >
                All
              </Button>
              {channelTypes.map((channelType) => (
                <Button
                  key={channelType}
                  onClick={() => controller.setChannelType(channelType)}
                  type="button"
                  variant={state.activeChannelType === channelType ? "secondary" : "ghost"}
                >
                  {channelTypeLabel(channelType)}
                </Button>
              ))}
            </div>
          </div>

          <SdkworkDistributionChannelCards
            channelDigests={state.catalog.channelDigests}
            channels={state.visibleChannels}
            onNavigate={onNavigate}
            onSelectChannel={(channelId) => controller.selectChannel(channelId)}
            selectedChannelId={state.selectedChannelId}
          />

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.8fr)]">
            <article className="rounded-[1.35rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel-muted)] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sdk-color-text-muted)]">
                Artifact matrix
              </div>
              <div className="mt-4 space-y-3">
                {visibleArtifacts.map((artifact) => (
                  <div
                    className="rounded-[0.95rem] border border-[var(--sdk-color-border-subtle)] bg-[var(--sdk-color-surface-panel)] p-3"
                    key={artifact.id}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-semibold text-[var(--sdk-color-text-primary)]">
                          {artifact.title}
                        </div>
                        <div className="mt-1 text-sm text-[var(--sdk-color-text-secondary)]">
                          {artifact.platform} | v{artifact.version} | {artifact.sizeMb} MB
                        </div>
                      </div>
                      <div className={`text-xs font-semibold uppercase tracking-[0.16em] ${artifactStatusTone(artifact.status)}`}>
                        {artifact.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.35rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel-muted)] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sdk-color-text-muted)]">
                Rollout summary
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--sdk-color-text-muted)]">Highest risk</span>
                  <span className="font-medium capitalize text-[var(--sdk-color-text-primary)]">
                    {state.catalog.summary.highestRiskLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--sdk-color-text-muted)]">Coverage</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">
                    {state.catalog.coverage.coveredPlatforms}/{state.catalog.coverage.totalPlatforms} platforms
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--sdk-color-text-muted)]">Missing targets</span>
                  <span className="max-w-[13rem] text-right font-medium text-[var(--sdk-color-text-primary)]">
                    {state.catalog.coverage.missingPlatforms.length > 0
                      ? state.catalog.coverage.missingPlatforms.join(", ")
                      : "None"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--sdk-color-text-muted)]">Channel count</span>
                  <span className="font-medium text-[var(--sdk-color-text-primary)]">
                    {state.catalog.summary.channelCount}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
