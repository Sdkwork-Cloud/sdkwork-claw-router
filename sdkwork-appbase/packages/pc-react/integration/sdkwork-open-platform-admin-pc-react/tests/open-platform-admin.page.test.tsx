import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  SdkworkOpenPlatformAdminPage,
  createSdkworkOpenPlatformAdminController,
  type SdkworkOpenPlatformAdminService,
} from "../src";

describe("SdkworkOpenPlatformAdminPage", () => {
  it("uses the admin workspace width and exposes dark mode readable surfaces", async () => {
    const service = createService();
    const controller = createSdkworkOpenPlatformAdminController({ service });

    const { container } = render(<SdkworkOpenPlatformAdminPage controller={controller} />);

    await screen.findByText("Open Platform Admin");
    const page = container.querySelector(".sdkwork-open-platform-admin");
    const workspace = container.querySelector("[data-testid='open-platform-admin-workspace']");
    const accountPanel = screen.getByRole("region", { name: /accounts/i });
    const configurationPanel = screen.getByRole("region", { name: /configuration/i });
    const searchBox = screen.getByLabelText("Search");

    expect(page).toHaveClass("dark:bg-[#0a0a0a]", "dark:text-slate-50");
    expect(workspace).toHaveClass("max-w-none");
    expect(workspace?.className).not.toContain("max-w-7xl");
    expect(accountPanel).toHaveClass("dark:bg-[#121212]", "dark:border-white/10");
    expect(configurationPanel).toHaveClass("dark:bg-[#121212]", "dark:border-white/10");
    expect(searchBox).toHaveClass("dark:bg-[#121212]", "dark:text-slate-100");
  });

  it("renders admin management for official accounts and mini apps", async () => {
    const service = createService();
    const controller = createSdkworkOpenPlatformAdminController({ service });

    render(<SdkworkOpenPlatformAdminPage controller={controller} />);

    await screen.findByText("Open Platform Admin");
    expect(screen.getByRole("button", { name: /official accounts/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mini apps/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByText("WeChat MP").length).toBeGreaterThan(0);
    });
    expect(screen.getByText("Default QR")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /mini apps/i }));
    expect(screen.getByText("No mini app accounts yet.")).toBeInTheDocument();
  });

  it("creates a provider-neutral official account through the controller", async () => {
    const service = createService();
    const controller = createSdkworkOpenPlatformAdminController({ service });

    render(<SdkworkOpenPlatformAdminPage controller={controller} />);

    await waitFor(() => {
      expect(screen.getAllByText("WeChat MP").length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getByRole("button", { name: /new account/i }));
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Douyin Official" } });
    fireEvent.change(screen.getByLabelText("Key"), { target: { value: "douyin_official" } });
    fireEvent.change(screen.getByLabelText("Provider"), { target: { value: "douyin" } });
    fireEvent.change(screen.getByLabelText("App ID"), { target: { value: "dy123" } });
    fireEvent.change(screen.getByLabelText("Secret Ref"), { target: { value: "secret://douyin_official" } });
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(service.createAccount).toHaveBeenCalledWith({
        appId: "dy123",
        key: "douyin_official",
        name: "Douyin Official",
        provider: "douyin",
        secretRef: "secret://douyin_official",
        type: "official_account",
      });
    });
  });

  it("keeps an initial load failure visible without automatically retrying", async () => {
    const service = createService();
    vi.mocked(service.getDashboard)
      .mockReset()
      .mockRejectedValueOnce(new Error("backend down"))
      .mockImplementation(() => new Promise(() => undefined));
    const controller = createSdkworkOpenPlatformAdminController({ service });

    render(<SdkworkOpenPlatformAdminPage controller={controller} />);

    await waitFor(() => {
      expect(service.getDashboard).toHaveBeenCalledTimes(1);
      expect(controller.getState()).toMatchObject({
        isBootstrapped: false,
        isLoading: false,
        lastError: "backend down",
      });
    });
    expect(screen.getByText("backend down")).toBeInTheDocument();
  });

  it("recovers from an initial load failure when refresh is clicked", async () => {
    const service = createService();
    const dashboard = await service.getDashboard();
    vi.mocked(service.getDashboard)
      .mockReset()
      .mockRejectedValueOnce(new Error("backend down"))
      .mockResolvedValueOnce(dashboard);
    const controller = createSdkworkOpenPlatformAdminController({ service });

    render(<SdkworkOpenPlatformAdminPage controller={controller} />);

    await screen.findByText("backend down");
    expect(service.getDashboard).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /refresh/i }));

    await waitFor(() => {
      expect(service.getDashboard).toHaveBeenCalledTimes(2);
      expect(controller.getState()).toMatchObject({
        isBootstrapped: true,
        isLoading: false,
      });
    });
    expect(screen.queryByText("backend down")).not.toBeInTheDocument();
    expect(screen.getAllByText("WeChat MP").length).toBeGreaterThan(0);
  });
});

function createService(): SdkworkOpenPlatformAdminService {
  const dashboard = {
    accounts: [
      {
        appId: "wx123",
        defaultEntryId: "entry-1",
        id: "acct-1",
        key: "wechat_mp",
        name: "WeChat MP",
        provider: "wechat",
        qrDefault: true,
        secretRef: "secret://wechat_mp",
        status: "active",
        type: "official_account",
      },
    ],
    entriesByAccountId: {
      "acct-1": [
        {
          accountId: "acct-1",
          id: "entry-1",
          key: "login",
          status: "active",
          type: "url",
          url: "https://platform.example.test/login",
        },
      ],
    },
    payBindingsByAccountId: {
      "acct-1": [],
    },
    summary: {
      activeAccounts: 1,
      entries: 1,
      miniApps: 0,
      officialAccounts: 1,
      payBindings: 0,
      qrDefaultAccounts: 1,
    },
  };

  return {
    createAccount: vi.fn().mockResolvedValue(dashboard.accounts[0]),
    createEntry: vi.fn(),
    createPayBinding: vi.fn(),
    deleteAccount: vi.fn(),
    deleteEntry: vi.fn(),
    deletePayBinding: vi.fn(),
    getDashboard: vi.fn().mockResolvedValue(dashboard),
    listAccounts: vi.fn().mockResolvedValue(dashboard.accounts),
    listEntries: vi.fn().mockResolvedValue(dashboard.entriesByAccountId["acct-1"]),
    listPayBindings: vi.fn().mockResolvedValue([]),
    refreshDashboard: vi.fn().mockResolvedValue(dashboard),
    setQrDefault: vi.fn(),
    updateAccount: vi.fn(),
    updateEntry: vi.fn(),
  };
}
