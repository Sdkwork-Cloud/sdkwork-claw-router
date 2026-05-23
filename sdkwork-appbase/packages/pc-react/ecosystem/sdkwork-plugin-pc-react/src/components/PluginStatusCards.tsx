import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ShieldCheck,
} from "lucide-react";
import type { SdkworkPluginRegistrySummary } from "../plugin";

export interface SdkworkPluginStatusCardsProps {
  summary: SdkworkPluginRegistrySummary;
}

export function SdkworkPluginStatusCards({
  summary,
}: SdkworkPluginStatusCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-[1.35rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-[var(--sdk-color-text-secondary)]">Installed</div>
            <div className="mt-1 text-xl font-semibold text-[var(--sdk-color-text-primary)]">
              {summary.installedPlugins}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.35rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-sky-500/10 text-sky-500">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-[var(--sdk-color-text-secondary)]">Updates available</div>
            <div className="mt-1 text-xl font-semibold text-[var(--sdk-color-text-primary)]">
              {summary.updatesAvailable}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.35rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-amber-500/10 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-[var(--sdk-color-text-secondary)]">High risk</div>
            <div className="mt-1 text-xl font-semibold text-[var(--sdk-color-text-primary)]">
              {summary.highRiskPlugins}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.35rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-rose-500/10 text-rose-500">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-[var(--sdk-color-text-secondary)]">Ready</div>
            <div className="mt-1 text-xl font-semibold text-[var(--sdk-color-text-primary)]">
              {summary.readyPlugins}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
