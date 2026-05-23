import {
  Crown,
  Gem,
  Sparkles,
} from "lucide-react";
import { Button } from "@sdkwork/ui-pc-react/components/ui/button";
import {
  formatSdkworkCommerceCurrencyCny as formatSdkworkCurrencyCny,
} from "@sdkwork/commerce-service";
import {
  createSdkworkVipGlassStyle,
  createSdkworkVipHeroStyle,
  createSdkworkVipHeroTextStyle,
  createSdkworkVipToneStyle,
} from "../vip-appearance";
import { useSdkworkVipIntl } from "../vip-intl";
import type {
  SdkworkVipPlan,
  SdkworkVipSummary,
} from "../vip-service";

export interface SdkworkVipMembershipHeroProps {
  isMutating: boolean;
  onPurchase: () => void;
  onRenew: () => void;
  onUpgrade: () => void;
  selectedPlan?: SdkworkVipPlan | null;
  summary: SdkworkVipSummary;
}

export function SdkworkVipMembershipHero({
  isMutating,
  onPurchase,
  onRenew,
  onUpgrade,
  selectedPlan,
  summary,
}: SdkworkVipMembershipHeroProps) {
  const {
    copy,
    formatDuration,
    formatIncludedPoints,
    formatPriceWas,
    formatStatus,
    locale,
  } = useSdkworkVipIntl();
  const selectedPrice = selectedPlan
    ? formatSdkworkCurrencyCny(selectedPlan.priceCny, locale)
    : copy.common.noValue;
  const selectedOriginalPrice = selectedPlan?.originalPriceCny
    && selectedPlan.originalPriceCny > selectedPlan.priceCny
    ? formatPriceWas(formatSdkworkCurrencyCny(selectedPlan.originalPriceCny, locale))
    : null;
  const primaryHeroTextStyle = createSdkworkVipHeroTextStyle();
  const mutedHeroTextStyle = createSdkworkVipHeroTextStyle("muted");
  const subtleHeroTextStyle = createSdkworkVipHeroTextStyle("subtle");

  return (
    <section
      className="overflow-hidden rounded-[2rem] border border-[color-mix(in_srgb,var(--sdk-color-border-default)_72%,transparent)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]"
      style={createSdkworkVipHeroStyle()}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em]"
            style={{
              ...createSdkworkVipGlassStyle("accent", {
                backgroundWeight: 12,
                borderWeight: 22,
                surfaceWeight: 82,
              }),
              ...mutedHeroTextStyle,
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {copy.hero.eyebrow}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight" style={primaryHeroTextStyle}>{copy.hero.title}</h1>
          <p className="mt-3 text-sm leading-7" style={mutedHeroTextStyle}>
            {copy.hero.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button disabled={!selectedPlan} loading={isMutating} onClick={summary.isVip ? onUpgrade : onPurchase} type="button" variant="secondary">
            {copy.actions.upgrade}
          </Button>
          <Button disabled={!selectedPlan || isMutating} onClick={onRenew} type="button" variant="outline">
            {copy.actions.renew}
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.9fr)]">
        <div
          className="rounded-[1.5rem] border p-5"
          style={createSdkworkVipGlassStyle("brand", {
            backgroundWeight: 12,
            borderWeight: 24,
            surfaceWeight: 84,
          })}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm" style={mutedHeroTextStyle}>{copy.hero.currentLevel}</div>
              <div className="mt-3 text-4xl font-semibold tracking-tight">
                {summary.currentLevelName}
              </div>
            </div>
            <div
              className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] border"
              style={createSdkworkVipToneStyle("warning", {
                backgroundWeight: 18,
                borderWeight: 28,
              })}
            >
              <Crown className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div
              className="rounded-[1rem] border px-4 py-3"
              style={createSdkworkVipGlassStyle("neutral", {
                backgroundWeight: 10,
                borderWeight: 18,
                surfaceWeight: 78,
              })}
            >
              <div className="text-[0.7rem] uppercase tracking-[0.18em]" style={subtleHeroTextStyle}>{copy.hero.status}</div>
              <div className="mt-2 text-sm font-semibold">{formatStatus(summary.status)}</div>
            </div>
            <div
              className="rounded-[1rem] border px-4 py-3"
              style={createSdkworkVipGlassStyle("warning", {
                backgroundWeight: 10,
                borderWeight: 18,
                surfaceWeight: 78,
              })}
            >
              <div className="text-[0.7rem] uppercase tracking-[0.18em]" style={subtleHeroTextStyle}>{copy.hero.remaining}</div>
              <div className="mt-2 text-sm font-semibold">
                {formatDuration(summary.remainingDays)}
              </div>
            </div>
            <div
              className="rounded-[1rem] border px-4 py-3"
              style={createSdkworkVipGlassStyle("accent", {
                backgroundWeight: 10,
                borderWeight: 18,
                surfaceWeight: 78,
              })}
            >
              <div className="text-[0.7rem] uppercase tracking-[0.18em]" style={subtleHeroTextStyle}>{copy.hero.vipPoints}</div>
              <div className="mt-2 text-sm font-semibold">
                {summary.vipPoints !== null ? formatIncludedPoints(summary.vipPoints) : copy.common.noValue}
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-[1.5rem] border p-5"
          style={createSdkworkVipGlassStyle("accent", {
            backgroundWeight: 12,
            borderWeight: 24,
            surfaceWeight: 84,
          })}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-[1rem] border"
              style={createSdkworkVipToneStyle("accent", {
                backgroundWeight: 20,
                borderWeight: 28,
              })}
            >
              <Gem className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm" style={mutedHeroTextStyle}>{copy.hero.selectedOffer}</div>
              <div className="mt-1 text-xl font-semibold" style={primaryHeroTextStyle}>
                {selectedPlan?.name ?? copy.hero.noPackageSelected}
              </div>
            </div>
          </div>

          <div
            className="mt-4 rounded-[1rem] border px-4 py-4 text-sm"
            style={{
              ...createSdkworkVipGlassStyle("neutral", {
                backgroundWeight: 10,
                borderWeight: 18,
                surfaceWeight: 76,
              }),
              ...mutedHeroTextStyle,
            }}
          >
            {selectedPlan?.description || copy.hero.noPackageDescription}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div
              className="rounded-[1rem] border px-4 py-3"
              style={createSdkworkVipGlassStyle("brand", {
                backgroundWeight: 10,
                borderWeight: 18,
                surfaceWeight: 78,
              })}
            >
              <div className="text-[0.7rem] uppercase tracking-[0.18em]" style={subtleHeroTextStyle}>{copy.hero.price}</div>
              <div className="mt-2 text-lg font-semibold">
                {selectedPrice}
              </div>
              {selectedOriginalPrice ? (
                <div className="mt-1 text-xs line-through" style={subtleHeroTextStyle}>
                  {selectedOriginalPrice}
                </div>
              ) : null}
            </div>
            <div
              className="rounded-[1rem] border px-4 py-3"
              style={createSdkworkVipGlassStyle("warning", {
                backgroundWeight: 10,
                borderWeight: 18,
                surfaceWeight: 78,
              })}
            >
              <div className="text-[0.7rem] uppercase tracking-[0.18em]" style={subtleHeroTextStyle}>{copy.hero.includedPoints}</div>
              <div className="mt-2 text-lg font-semibold">
                {selectedPlan ? formatIncludedPoints(selectedPlan.includedPoints) : copy.common.noValue}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
