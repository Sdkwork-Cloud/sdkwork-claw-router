import { useEffect } from "react";
import {
  Compass,
  Layers,
  RefreshCcw,
  Sparkles,
  Star,
} from "lucide-react";
import {
  Button,
  LoadingBlock,
  StatusNotice,
} from "@sdkwork/ui-pc-react";
import type { SdkworkMarketController } from "../market-controller";
import {
  useSdkworkMarketController,
  useSdkworkMarketControllerState,
} from "../market-controller";
import type { SdkworkMarketService } from "../market-service";
import { SdkworkMarketDetailRail } from "../components/MarketDetailRail";
import { SdkworkMarketListingCards } from "../components/MarketListingCards";

export interface SdkworkMarketPageProps {
  controller?: SdkworkMarketController;
  onNavigate?: (route: string) => void;
  service?: Partial<SdkworkMarketService>;
}

export function SdkworkMarketPage({
  controller: controllerProp,
  onNavigate,
  service,
}: SdkworkMarketPageProps) {
  const controller = useSdkworkMarketController(controllerProp, service);
  const state = useSdkworkMarketControllerState(controller);

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="h-full overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[96rem] space-y-5">
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(22rem,0.85fr)]">
          <div className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(212,212,216,0.16),transparent_28%),linear-gradient(135deg,#09090b,#18181b_48%,#27272a)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/72">
                  <Compass className="h-3.5 w-3.5" />
                  Ecosystem Market
                </div>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight">Market Center</h1>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  Discover apps, plugins, skills, templates, and model packages with normalized listing filters and install route intents.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => void controller.refresh()} type="button" variant="outline">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Refresh market
                </Button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.4rem] bg-white/8 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/65">Total items</div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight">
                      {state.catalog.summary.itemCount}
                    </div>
                  </div>
                  <Layers className="h-5 w-5 text-white/80" />
                </div>
              </div>

              <div className="rounded-[1.4rem] bg-white/8 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/65">Installed items</div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight">
                      {state.catalog.summary.installedItems}
                    </div>
                  </div>
                  <Sparkles className="h-5 w-5 text-white/80" />
                </div>
              </div>

              <div className="rounded-[1.4rem] bg-white/8 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/65">Recommended</div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight">
                      {state.catalog.summary.recommendedItemIds.length}
                    </div>
                  </div>
                  <Star className="h-5 w-5 text-white/80" />
                </div>
              </div>
            </div>
          </div>

          <SdkworkMarketDetailRail item={state.selectedItem} onNavigate={onNavigate} />
        </section>

        {state.isLoading && !state.isBootstrapped ? <LoadingBlock label="Loading market center..." /> : null}

        {state.lastError ? (
          <StatusNotice title="Market center error" tone="danger">
            {state.lastError}
          </StatusNotice>
        ) : null}

        <section className="rounded-[1.5rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] shadow-[var(--sdk-shadow-sm)]">
          <div className="space-y-4 border-b border-[var(--sdk-color-border-subtle)] px-6 py-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sdk-color-text-muted)]">Catalog filters</div>
                <h2 className="mt-2 text-xl font-semibold text-[var(--sdk-color-text-primary)]">Package discovery</h2>
              </div>

              <label className="inline-flex w-full items-center gap-2 rounded-[1rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-base)] px-4 py-3 text-sm text-[var(--sdk-color-text-primary)] lg:max-w-sm">
                <span className="text-[var(--sdk-color-text-muted)]">Search</span>
                <input
                  className="w-full bg-transparent outline-none placeholder:text-[var(--sdk-color-text-muted)]"
                  onChange={(event) => controller.setSearchQuery(event.target.value)}
                  placeholder="packages, categories, tags"
                  type="text"
                  value={state.searchQuery}
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              {state.catalog.filters.kindOptions.map((kindOption) => (
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                    state.activeKind === kindOption.id
                      ? "bg-rose-500 text-white"
                      : "bg-[var(--sdk-color-surface-panel-muted)] text-[var(--sdk-color-text-secondary)]"
                  }`}
                  key={kindOption.id}
                  onClick={() => controller.setKind(kindOption.id)}
                  type="button"
                >
                  {kindOption.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {state.catalog.filters.categories.map((categoryOption) => (
                <button
                  className={`rounded-[0.9rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    state.activeCategoryId === categoryOption.id
                      ? "border-sky-500 bg-sky-500/10 text-sky-500"
                      : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                  }`}
                  key={categoryOption.id}
                  onClick={() => controller.setCategoryId(categoryOption.id)}
                  type="button"
                >
                  {categoryOption.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {state.catalog.filters.sourceOptions.map((sourceOption) => (
                <button
                  className={`rounded-[0.9rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    state.activeSourceKind === sourceOption.id
                      ? "border-amber-500 bg-amber-500/10 text-amber-500"
                      : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                  }`}
                  key={sourceOption.id}
                  onClick={() => controller.setSourceKind(sourceOption.id)}
                  type="button"
                >
                  {sourceOption.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {state.catalog.filters.sortOptions.map((sortOption) => (
                <button
                  className={`rounded-[0.9rem] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    state.sortBy === sortOption.id
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                      : "border-[var(--sdk-color-border-default)] text-[var(--sdk-color-text-secondary)]"
                  }`}
                  key={sortOption.id}
                  onClick={() => controller.setSortBy(sortOption.id)}
                  type="button"
                >
                  {sortOption.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-6">
            <SdkworkMarketListingCards
              items={state.visibleItems}
              onNavigate={onNavigate}
              onSelectItem={(itemId) => controller.selectItem(itemId)}
              selectedItemId={state.selectedItemId}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
