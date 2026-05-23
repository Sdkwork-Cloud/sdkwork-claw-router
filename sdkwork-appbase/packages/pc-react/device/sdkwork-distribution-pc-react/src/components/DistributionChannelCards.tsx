import { EmptyState } from "@sdkwork/ui-pc-react";
import {
  createDistributionRouteIntent,
  type SdkworkDistributionChannel,
  type SdkworkDistributionChannelDigest,
} from "../distribution";

export interface SdkworkDistributionChannelCardsProps {
  channelDigests: Record<string, SdkworkDistributionChannelDigest>;
  channels: readonly SdkworkDistributionChannel[];
  onNavigate?: (route: string) => void;
  onSelectChannel?: (channelId: string) => void;
  selectedChannelId?: string | null;
}

function riskTone(value: SdkworkDistributionChannel["riskLevel"]): string {
  if (value === "high") {
    return "text-rose-400";
  }

  if (value === "medium") {
    return "text-amber-400";
  }

  return "text-emerald-400";
}

export function SdkworkDistributionChannelCards({
  channelDigests,
  channels,
  onNavigate,
  onSelectChannel,
  selectedChannelId,
}: SdkworkDistributionChannelCardsProps) {
  if (channels.length === 0) {
    return (
      <EmptyState
        description="No distribution channels are currently available."
        title="No channels"
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {channels.map((channel) => {
        const digest = channelDigests[channel.id] ?? {
          approvalPending: 0,
          blockedArtifacts: 0,
          readyArtifacts: 0,
        };
        const isSelected = channel.id === selectedChannelId;
        const route = createDistributionRouteIntent({
          channelId: channel.id,
        }).route;

        return (
          <article
            className={`rounded-[1.45rem] border p-5 shadow-[var(--sdk-shadow-sm)] transition-all ${
              isSelected
                ? "border-sky-400 bg-[linear-gradient(180deg,rgba(56,189,248,0.12),rgba(9,9,11,0.02))] shadow-[var(--sdk-shadow-lg)]"
                : "border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)]"
            }`}
            key={channel.id}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--sdk-color-surface-panel-muted)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--sdk-color-text-muted)]">
                {channel.type}
              </span>
              <span className={`rounded-full bg-white/5 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${riskTone(channel.riskLevel)}`}>
                {channel.riskLevel} risk
              </span>
              {channel.approvalRequired ? (
                <span className="rounded-full bg-amber-500/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-amber-400">
                  Approval
                </span>
              ) : null}
            </div>

            <h3 className="mt-4 text-xl font-semibold text-[var(--sdk-color-text-primary)]">
              {channel.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--sdk-color-text-secondary)]">
              {channel.description}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-[0.9rem] bg-[var(--sdk-color-surface-panel-muted)] p-3">
                <div className="text-xs uppercase tracking-[0.12em] text-[var(--sdk-color-text-muted)]">Ready</div>
                <div className="mt-1 text-lg font-semibold text-[var(--sdk-color-text-primary)]">
                  {digest.readyArtifacts}
                </div>
              </div>
              <div className="rounded-[0.9rem] bg-[var(--sdk-color-surface-panel-muted)] p-3">
                <div className="text-xs uppercase tracking-[0.12em] text-[var(--sdk-color-text-muted)]">Blocked</div>
                <div className="mt-1 text-lg font-semibold text-[var(--sdk-color-text-primary)]">
                  {digest.blockedArtifacts}
                </div>
              </div>
              <div className="rounded-[0.9rem] bg-[var(--sdk-color-surface-panel-muted)] p-3">
                <div className="text-xs uppercase tracking-[0.12em] text-[var(--sdk-color-text-muted)]">Approval</div>
                <div className="mt-1 text-lg font-semibold text-[var(--sdk-color-text-primary)]">
                  {digest.approvalPending}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                aria-label={`Open channel route for ${channel.title}`}
                className="flex-1 rounded-[0.95rem] bg-[linear-gradient(135deg,#0f172a,#1f2937_48%,#3f3f46)] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                onClick={() => onNavigate?.(route)}
                type="button"
              >
                Open channel
              </button>
              <button
                aria-label={`Select ${channel.title}`}
                className="rounded-[0.95rem] border border-[var(--sdk-color-border-default)] px-4 py-2.5 text-sm font-semibold text-[var(--sdk-color-text-primary)] transition-colors hover:bg-[var(--sdk-color-surface-panel-muted)]"
                onClick={() => onSelectChannel?.(channel.id)}
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
