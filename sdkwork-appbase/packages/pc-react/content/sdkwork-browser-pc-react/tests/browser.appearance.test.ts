import { describe, expect, it } from "vitest";
import * as browserModule from "../src";

describe("sdkwork-browser-pc-react appearance", () => {
  it("exports theme-driven tone styles for reusable browser chips and accents", () => {
    const createToneStyle = (browserModule as Record<string, any>).createSdkworkBrowserToneStyle;
    const createHeroTextStyle = (browserModule as Record<string, any>).createSdkworkBrowserHeroTextStyle;

    expect(createToneStyle).toBeTypeOf("function");
    expect(createHeroTextStyle).toBeTypeOf("function");

    if (
      typeof createToneStyle !== "function"
      || typeof createHeroTextStyle !== "function"
    ) {
      return;
    }

    expect(
      createToneStyle("brand", {
        backgroundWeight: 18,
        borderWeight: 32,
      }),
    ).toEqual({
      backgroundColor: "color-mix(in srgb, var(--sdk-color-brand-primary) 18%, transparent)",
      borderColor: "color-mix(in srgb, var(--sdk-color-brand-primary) 32%, transparent)",
      color: "var(--sdk-color-brand-primary)",
    });
    expect(createHeroTextStyle("muted")).toEqual({
      color: "color-mix(in srgb, white 72%, var(--sdk-color-brand-accent))",
    });
  });

  it("exports layered Sdkwork-style browser gradients for hero and panel surfaces", () => {
    const createPanelStyle = (browserModule as Record<string, any>).createSdkworkBrowserPanelStyle;
    const createGlassStyle = (browserModule as Record<string, any>).createSdkworkBrowserGlassStyle;
    const createHeroStyle = (browserModule as Record<string, any>).createSdkworkBrowserHeroStyle;
    const createBackdropStyle = (browserModule as Record<string, any>).createSdkworkBrowserBackdropStyle;

    expect(createPanelStyle).toBeTypeOf("function");
    expect(createGlassStyle).toBeTypeOf("function");
    expect(createHeroStyle).toBeTypeOf("function");
    expect(createBackdropStyle).toBeTypeOf("function");

    if (
      typeof createPanelStyle !== "function"
      || typeof createGlassStyle !== "function"
      || typeof createHeroStyle !== "function"
      || typeof createBackdropStyle !== "function"
    ) {
      return;
    }

    expect(createPanelStyle("accent").backgroundImage).toContain("var(--sdk-color-brand-accent)");
    expect(createPanelStyle("accent").backgroundImage).toContain("var(--sdk-color-surface-panel)");
    expect(createGlassStyle("brand").backgroundImage).toContain("var(--sdk-color-surface-panel)");
    expect(createHeroStyle().backgroundImage).toContain("var(--sdk-color-brand-accent)");
    expect(createHeroStyle().backgroundImage).toContain("var(--sdk-color-surface-canvas)");
    expect(createHeroStyle().backgroundImage).toContain("var(--sdk-color-surface-panel)");
    expect(createHeroStyle().backgroundImage).toContain("var(--sdk-color-surface-elevated)");
    expect(createHeroStyle().backgroundImage).not.toContain("#09090b");
    expect(createBackdropStyle().backgroundImage).toContain("var(--sdk-color-brand-primary)");
    expect(createBackdropStyle().backgroundImage).toContain("var(--sdk-color-brand-accent)");
  });
});
