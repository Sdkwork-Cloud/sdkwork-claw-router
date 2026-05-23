import type { CSSProperties } from "react";
import {
  createSdkworkBackdropStyle,
  createSdkworkGlassStyle,
  createSdkworkHeroStyle,
  createSdkworkPanelStyle,
  createSdkworkToneStyle,
  type SdkworkThemeVisualTone,
} from "@sdkwork/ui-pc-react/theme";

export type SdkworkVipVisualTone = SdkworkThemeVisualTone;

export function createSdkworkVipToneStyle(
  tone: SdkworkVipVisualTone,
  options: {
    backgroundWeight?: number;
    borderWeight?: number;
  } = {},
): CSSProperties {
  return createSdkworkToneStyle(tone, options);
}

export function createSdkworkVipPanelStyle(
  tone: SdkworkVipVisualTone,
  options: {
    backgroundWeight?: number;
    borderWeight?: number;
    surfaceColor?: string;
    surfaceWeight?: number;
  } = {},
): CSSProperties {
  return createSdkworkPanelStyle(tone, options);
}

export function createSdkworkVipGlassStyle(
  tone: SdkworkVipVisualTone,
  options: {
    backgroundWeight?: number;
    borderWeight?: number;
    surfaceColor?: string;
    surfaceWeight?: number;
  } = {},
): CSSProperties {
  return createSdkworkGlassStyle(tone, options);
}

export function createSdkworkVipBackdropStyle(): CSSProperties {
  return createSdkworkBackdropStyle();
}

export function createSdkworkVipHeroStyle(): CSSProperties {
  return createSdkworkHeroStyle();
}

export function createSdkworkVipHeroTextStyle(
  tone: "muted" | "primary" | "subtle" = "primary",
): CSSProperties {
  if (tone === "muted") {
    return {
      color: "color-mix(in srgb, white 72%, var(--sdk-color-brand-accent))",
    };
  }

  if (tone === "subtle") {
    return {
      color: "color-mix(in srgb, white 64%, var(--sdk-color-brand-accent))",
    };
  }

  return {
    color: "color-mix(in srgb, white 92%, var(--sdk-color-brand-accent))",
  };
}
