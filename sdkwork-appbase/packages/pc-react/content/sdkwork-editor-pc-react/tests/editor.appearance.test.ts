import { describe, expect, it } from "vitest";
import * as editorModule from "../src";

describe("sdkwork-editor-pc-react appearance", () => {
  it("exports theme-driven tone styles for reusable editor chips and accents", () => {
    const createToneStyle = (editorModule as Record<string, any>).createSdkworkEditorToneStyle;
    const createHeroTextStyle = (editorModule as Record<string, any>).createSdkworkEditorHeroTextStyle;

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

  it("exports layered Sdkwork-style editor gradients for hero and panel surfaces", () => {
    const createPanelStyle = (editorModule as Record<string, any>).createSdkworkEditorPanelStyle;
    const createGlassStyle = (editorModule as Record<string, any>).createSdkworkEditorGlassStyle;
    const createHeroStyle = (editorModule as Record<string, any>).createSdkworkEditorHeroStyle;
    const createBackdropStyle = (editorModule as Record<string, any>).createSdkworkEditorBackdropStyle;

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
    expect(createHeroStyle().backgroundImage).not.toContain("#0b1120");
    expect(createBackdropStyle().backgroundImage).toContain("var(--sdk-color-brand-primary)");
    expect(createBackdropStyle().backgroundImage).toContain("var(--sdk-color-brand-accent)");
  });
});
