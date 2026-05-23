import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const appClient = {
    setAccessToken: vi.fn(),
    setAuthToken: vi.fn(),
  };
  const imClient = {
    auth: {
      clearToken: vi.fn(),
      useToken: vi.fn(),
    },
    connect: vi.fn(),
  };

  return {
    appClient,
    createAppClientMock: vi.fn(() => appClient),
    imClient,
    imSdkConstructor: vi.fn((args: unknown[]) => args),
  };
});

vi.mock("@sdkwork/app-sdk", () => ({
  createClient: mocks.createAppClientMock,
}));

vi.mock("@sdkwork/im-sdk", () => ({
  ImSdkClient: class {
    constructor(...args: unknown[]) {
      mocks.imSdkConstructor(args);
      return mocks.imClient;
    }
  },
}));

import {
  configurePcReactRuntime,
  readPcReactShellPreferences,
  resetPcReactRuntime,
} from "@sdkwork/core-pc-react";
import {
  SdkworkShellRuntimeProvider,
  useSdkworkShell,
} from "../src";

function RuntimeShellProbe() {
  const shell = useSdkworkShell();

  return (
    <div>
      <span>{shell.themeColor}</span>
      <span>{shell.themeSelection}</span>
      <span>{shell.locale}</span>
      <span>{shell.localePreference}</span>
      <button onClick={() => shell.setThemeColor("tech-blue")} type="button">
        set-tech-blue
      </button>
      <button onClick={() => shell.setThemeSelection("light")} type="button">
        set-light
      </button>
      <button onClick={() => shell.setLocalePreference("zh-CN")} type="button">
        set-chinese
      </button>
    </div>
  );
}

describe("sdkwork shell runtime provider", () => {
  beforeEach(() => {
    resetPcReactRuntime();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockImplementation(() => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
        matches: false,
        media: "(prefers-color-scheme: light)",
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
      writable: true,
    });
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "en-US",
    });

    configurePcReactRuntime({
      envSource: {
        VITE_ACCESS_TOKEN: "tenant-access-token",
        VITE_API_BASE_URL: "https://api.example.com",
      },
      preferences: {
        defaults: {
          localePreference: "system",
          themeColor: "lobster",
          themeSelection: "system",
        },
      },
    });
  });

  it("bridges sdkwork-core shell preferences into the shared shell provider and persists mutations", () => {
    render(
      <SdkworkShellRuntimeProvider>
        <RuntimeShellProbe />
      </SdkworkShellRuntimeProvider>,
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "lobster");
    expect(document.documentElement).toHaveAttribute("data-sdk-color-mode", "dark");
    expect(document.documentElement).toHaveAttribute("lang", "en-US");
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
    expect(screen.getByText("lobster")).toBeInTheDocument();
    expect(screen.getAllByText("system")).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: "set-tech-blue" }));
    fireEvent.click(screen.getByRole("button", { name: "set-light" }));
    fireEvent.click(screen.getByRole("button", { name: "set-chinese" }));

    expect(readPcReactShellPreferences()).toEqual({
      locale: "zh-CN",
      localePreference: "zh-CN",
      themeColor: "tech-blue",
      themeSelection: "light",
    });
    expect(document.documentElement).toHaveAttribute("data-theme", "tech-blue");
    expect(document.documentElement).toHaveAttribute("data-sdk-color-mode", "light");
    expect(document.documentElement).toHaveAttribute("lang", "zh-CN");
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
  });
});
