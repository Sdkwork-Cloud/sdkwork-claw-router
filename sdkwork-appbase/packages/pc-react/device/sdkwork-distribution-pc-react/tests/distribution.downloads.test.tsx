import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  detectSdkworkDownloadPlatform,
  resolveSdkworkDownloadCardActions,
  SdkworkProductDownloadSection,
  type SdkworkDownloadCatalog,
  type SdkworkDownloadCard,
} from "../src/downloads";

const cards: SdkworkDownloadCard[] = [
  {
    actions: [
      {
        href: "https://downloads.example.test/desktop/macos",
        id: "desktop-macos",
        label: "macOS",
        platform: "macos",
      },
      {
        href: "https://downloads.example.test/desktop/windows",
        id: "desktop-windows",
        label: "Windows",
        platform: "windows",
      },
      {
        disabled: true,
        href: "",
        id: "desktop-linux",
        label: "Linux",
        platform: "linux",
      },
    ],
    description: "Full local workspace for builders.",
    icon: "desktop",
    id: "desktop",
    kind: "desktop",
    primaryActionStrategy: "detected-platform",
    title: "Desktop",
    tone: "brand",
  },
  {
    actions: [
      {
        href: "https://downloads.example.test/server",
        id: "server",
        label: "Server edition",
        platform: "linux",
      },
      {
        href: "https://downloads.example.test/docker",
        id: "docker",
        label: "Docker image",
        platform: "docker",
      },
      {
        href: "https://downloads.example.test/helm",
        id: "helm",
        label: "Helm chart",
        platform: "helm",
      },
    ],
    description: "Headless runtime for production clusters.",
    icon: "server",
    id: "server",
    kind: "server",
    primaryActionId: "server",
    title: "Server",
    tone: "server",
  },
  {
    actions: [
      {
        href: "https://downloads.example.test/mobile/ios",
        id: "mobile-ios",
        label: "iOS",
        platform: "ios",
      },
      {
        href: "https://downloads.example.test/mobile/android",
        id: "mobile-android",
        label: "Android",
        platform: "android",
      },
    ],
    description: "Mobile companion for routing insight on the go.",
    icon: "mobile",
    id: "mobile",
    kind: "mobile",
    primaryActionStrategy: "detected-platform",
    title: "Mobile",
    tone: "mobile",
  },
];

describe("sdkwork distribution downloads", () => {
  it("detects common desktop and mobile platforms from user agents", () => {
    expect(detectSdkworkDownloadPlatform("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("windows");
    expect(detectSdkworkDownloadPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)")).toBe("macos");
    expect(detectSdkworkDownloadPlatform("Mozilla/5.0 (X11; Linux x86_64)")).toBe("linux");
    expect(detectSdkworkDownloadPlatform("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")).toBe("ios");
    expect(detectSdkworkDownloadPlatform("Mozilla/5.0 (Linux; Android 15; Pixel 9)")).toBe("android");
    expect(detectSdkworkDownloadPlatform("")).toBe("generic");
  });

  it("promotes the detected platform action without losing unavailable alternatives", () => {
    const resolved = resolveSdkworkDownloadCardActions(cards[0], "windows");

    expect(resolved.primaryAction.id).toBe("desktop-windows");
    expect(resolved.secondaryActions.map((action) => action.id)).toEqual([
      "desktop-macos",
      "desktop-linux",
    ]);
    expect(resolved.secondaryActions[1].disabled).toBe(true);
  });

  it("renders desktop server and mobile cards with accessible unavailable states", () => {
    render(
      <SdkworkProductDownloadSection
        cards={cards}
        detectedPlatform="android"
        subtitle="Choose the right runtime."
        title="Downloads"
      />,
    );

    expect(screen.getByRole("heading", { name: "Downloads" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Desktop" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Server" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Mobile" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Download Android" })).toHaveAttribute(
      "href",
      "https://downloads.example.test/mobile/android",
    );
    expect(screen.getByRole("button", { name: "Linux unavailable" })).toBeDisabled();
  });

  it("renders cards directly from a release download catalog", () => {
    const catalog: SdkworkDownloadCatalog = {
      schemaVersion: "2026-05-18.sdkwork-download-catalog.v1",
      generatedAt: "2026-05-18T00:00:00.000Z",
      product: {
        id: "sdkwork-router",
        name: "Sdkwork Router",
        version: "9.8.7",
      },
      cards: [
        {
          actions: [
            {
              fileName: "sdkwork-router-windows-x64-desktop-9.8.7.msi",
              href: "https://downloads.example.test/sdkwork-router-windows-x64-desktop-9.8.7.msi",
              id: "desktop-windows-x64",
              label: "Windows x64",
              platform: "windows",
              version: "9.8.7",
            },
          ],
          description: "Release-managed desktop packages.",
          icon: "desktop",
          id: "catalog-desktop",
          kind: "desktop",
          primaryActionStrategy: "detected-platform",
          title: "Desktop",
          tone: "brand",
        },
      ],
    };

    render(
      <SdkworkProductDownloadSection
        catalog={catalog}
        detectedPlatform="windows"
        title="Release downloads"
      />,
    );

    expect(screen.getByRole("heading", { name: "Release downloads" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Download Windows x64" })).toHaveAttribute(
      "href",
      "https://downloads.example.test/sdkwork-router-windows-x64-desktop-9.8.7.msi",
    );
  });

  it("renders compact download cards with a flat borderless surface", () => {
    const { container } = render(
      <SdkworkProductDownloadSection
        cards={cards}
        detectedPlatform="windows"
        variant="compact"
      />,
    );
    const article = container.querySelector("article");

    expect(article?.className).toContain("bg-transparent");
    expect(article?.className).not.toContain("border ");
    expect(article?.className).not.toContain("shadow");
    expect(article?.className).not.toContain("rounded-[1.5rem]");
  });

  it("renders section download cards with the same flat borderless design language", () => {
    const { container } = render(
      <SdkworkProductDownloadSection
        cards={cards}
        detectedPlatform="windows"
        title="Downloads"
      />,
    );
    const section = container.querySelector("section");
    const article = container.querySelector("article");

    expect(section?.className).not.toContain("border-t");
    expect(article?.className).toContain("bg-transparent");
    expect(article?.className).not.toContain("border ");
    expect(article?.className).not.toContain("shadow");
    expect(article?.className).not.toContain("rounded-[1.5rem]");
  });

  it("renders selectable download sources for release-managed actions", () => {
    const onDownloadSelect = vi.fn();
    const catalog: SdkworkDownloadCatalog = {
      schemaVersion: "2026-05-18.sdkwork-download-catalog.v1",
      generatedAt: "2026-05-18T00:00:00.000Z",
      product: {
        id: "sdkwork-router",
        name: "Sdkwork Router",
        version: "9.8.7",
      },
      cards: [
        {
          actions: [
            {
              fileName: "sdkwork-router-windows-x64-desktop-9.8.7.msi",
              href: "https://github.com/Sdkwork-Cloud/sdkwork-router/releases/download/v9.8.7/sdkwork-router-windows-x64-desktop-9.8.7.msi",
              id: "desktop-windows-x64",
              label: "Windows x64",
              platform: "windows",
              sources: [
                {
                  href: "https://github.com/Sdkwork-Cloud/sdkwork-router/releases/download/v9.8.7/sdkwork-router-windows-x64-desktop-9.8.7.msi",
                  id: "github",
                  label: "GitHub",
                  primary: true,
                },
                {
                  href: "https://cdn.example.test/sdkwork-router/v9.8.7/sdkwork-router-windows-x64-desktop-9.8.7.msi",
                  id: "cdn",
                  label: "CDN",
                },
              ],
              version: "9.8.7",
            },
          ],
          description: "Release-managed desktop packages.",
          icon: "desktop",
          id: "catalog-desktop",
          kind: "desktop",
          primaryActionStrategy: "detected-platform",
          title: "Desktop",
          tone: "brand",
        },
      ],
    };

    render(
      <SdkworkProductDownloadSection
        catalog={catalog}
        detectedPlatform="windows"
        onDownloadSelect={onDownloadSelect}
        title="Release downloads"
      />,
    );

    expect(screen.getByRole("link", { name: "Download Windows x64" })).toHaveAttribute(
      "href",
      "https://github.com/Sdkwork-Cloud/sdkwork-router/releases/download/v9.8.7/sdkwork-router-windows-x64-desktop-9.8.7.msi",
    );
    expect(screen.getByRole("link", { name: "Download Windows x64 from GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Sdkwork-Cloud/sdkwork-router/releases/download/v9.8.7/sdkwork-router-windows-x64-desktop-9.8.7.msi",
    );
    const cdnLink = screen.getByRole("link", { name: "Download Windows x64 from CDN" });
    expect(cdnLink).toHaveAttribute(
      "href",
      "https://cdn.example.test/sdkwork-router/v9.8.7/sdkwork-router-windows-x64-desktop-9.8.7.msi",
    );

    cdnLink.addEventListener("click", (event) => event.preventDefault());
    cdnLink.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onDownloadSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "desktop-windows-x64" }),
      expect.objectContaining({ id: "catalog-desktop" }),
      expect.objectContaining({ id: "cdn" }),
    );
  });

  it("renders selectable download sources for secondary actions", () => {
    const catalog: SdkworkDownloadCatalog = {
      schemaVersion: "2026-05-18.sdkwork-download-catalog.v1",
      generatedAt: "2026-05-18T00:00:00.000Z",
      product: {
        id: "sdkwork-router",
        name: "Sdkwork Router",
        version: "9.8.7",
      },
      cards: [
        {
          actions: [
            {
              href: "https://github.com/Sdkwork-Cloud/sdkwork-router/releases/download/v9.8.7/sdkwork-router-windows-x64-desktop-9.8.7.msi",
              id: "desktop-windows-x64",
              label: "Windows x64",
              platform: "windows",
            },
            {
              href: "https://github.com/Sdkwork-Cloud/sdkwork-router/releases/download/v9.8.7/sdkwork-router-macos-x64-desktop-9.8.7.pkg",
              id: "desktop-macos-x64",
              label: "macOS x64",
              platform: "macos",
              sources: [
                {
                  href: "https://github.com/Sdkwork-Cloud/sdkwork-router/releases/download/v9.8.7/sdkwork-router-macos-x64-desktop-9.8.7.pkg",
                  id: "github",
                  label: "GitHub",
                  primary: true,
                },
                {
                  href: "https://cdn.example.test/sdkwork-router/v9.8.7/sdkwork-router-macos-x64-desktop-9.8.7.pkg",
                  id: "cdn",
                  label: "CDN",
                },
              ],
            },
          ],
          description: "Release-managed desktop packages.",
          icon: "desktop",
          id: "catalog-desktop",
          kind: "desktop",
          primaryActionStrategy: "detected-platform",
          title: "Desktop",
          tone: "brand",
        },
      ],
    };

    render(
      <SdkworkProductDownloadSection
        catalog={catalog}
        detectedPlatform="windows"
        title="Release downloads"
      />,
    );

    expect(screen.getByRole("link", { name: "Download macOS x64 from CDN" })).toHaveAttribute(
      "href",
      "https://cdn.example.test/sdkwork-router/v9.8.7/sdkwork-router-macos-x64-desktop-9.8.7.pkg",
    );
  });

  it("reports download selections before navigation", () => {
    const onDownloadSelect = vi.fn();

    render(
      <SdkworkProductDownloadSection
        cards={cards}
        detectedPlatform="windows"
        onDownloadSelect={onDownloadSelect}
      />,
    );

    const downloadLink = screen.getByRole("link", { name: "Download Windows" });
    downloadLink.addEventListener("click", (event) => event.preventDefault());

    downloadLink.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onDownloadSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "desktop-windows" }),
      expect.objectContaining({ id: "desktop" }),
    );
  });
});
