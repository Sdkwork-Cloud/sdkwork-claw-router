import { describe, expect, it, vi } from "vitest";

import {
  createSdkworkOpenPlatformAdminController,
  createSdkworkOpenPlatformAdminService,
  type SdkworkOpenPlatformAdminBackendClient,
} from "../src";

describe("sdkwork-open-platform-admin-pc-react service", () => {
  it("manages mini app and official account records through openPlatform backend SDK methods", async () => {
    const backendClient = createBackendClient();
    const service = createSdkworkOpenPlatformAdminService({ backendClient });

    await expect(service.listAccounts({ type: "official_account" })).resolves.toEqual([
      expect.objectContaining({ id: "acct-1", type: "official_account" }),
    ]);
    await expect(service.createAccount({
      appId: "wx123",
      key: "wechat_mp",
      name: "WeChat MP",
      provider: "wechat",
      secretRef: "secret://wechat_mp",
      type: "official_account",
    })).resolves.toEqual(expect.objectContaining({ id: "acct-1" }));
    await expect(service.updateAccount("acct-1", { name: "Primary MP", qrDefault: true })).resolves.toEqual(
      expect.objectContaining({ id: "acct-1", qrDefault: true }),
    );
    await expect(service.deleteAccount("acct-1")).resolves.toEqual(expect.objectContaining({ id: "acct-1" }));

    expect(backendClient.openPlatform.accounts.list).toHaveBeenCalledWith({ type_: "official_account" });
    expect(backendClient.openPlatform.accounts.create).toHaveBeenCalledWith({
      appId: "wx123",
      key: "wechat_mp",
      name: "WeChat MP",
      provider: "wechat",
      secretRef: "secret://wechat_mp",
      type: "official_account",
    });
    expect(backendClient.openPlatform.accounts.update).toHaveBeenCalledWith("acct-1", {
      name: "Primary MP",
      qrDefault: true,
    });
    expect(backendClient.openPlatform.accounts.delete).toHaveBeenCalledWith("acct-1");
  });

  it("manages login entries and payment bindings under the account resource tree", async () => {
    const backendClient = createBackendClient();
    const service = createSdkworkOpenPlatformAdminService({ backendClient });

    await expect(service.createEntry("acct-1", {
      key: "login",
      type: "mini_app_url",
      url: "weixin://dl/business/?t=login_ticket",
    })).resolves.toEqual(expect.objectContaining({ id: "entry-1" }));
    await expect(service.listEntries("acct-1")).resolves.toEqual([expect.objectContaining({ id: "entry-1" })]);
    await expect(service.listPayBindings("acct-1")).resolves.toEqual([
      expect.objectContaining({ id: "pay-1", scene: "mini_app" }),
    ]);

    expect(backendClient.openPlatform.accounts.entries.create).toHaveBeenCalledWith("acct-1", {
      key: "login",
      type: "mini_app_url",
      url: "weixin://dl/business/?t=login_ticket",
    });
    expect(backendClient.openPlatform.accounts.entries.list).toHaveBeenCalledWith("acct-1");
    expect(backendClient.openPlatform.accounts.payBindings.list).toHaveBeenCalledWith("acct-1");
  });

  it("fails fast when the generated backend SDK is missing openPlatform methods", async () => {
    const service = createSdkworkOpenPlatformAdminService({ backendClient: {} as SdkworkOpenPlatformAdminBackendClient });

    await expect(service.listAccounts()).rejects.toThrow(/openPlatform\.accounts\.list/);
  });

  it("bootstraps and refreshes admin state with account, entry, and pay binding data", async () => {
    const backendClient = createBackendClient();
    const controller = createSdkworkOpenPlatformAdminController({
      service: createSdkworkOpenPlatformAdminService({ backendClient }),
    });

    await expect(controller.bootstrap()).resolves.toMatchObject({
      dashboard: {
        accounts: [expect.objectContaining({ id: "acct-1" })],
        entriesByAccountId: {
          "acct-1": [expect.objectContaining({ id: "entry-1" })],
        },
        payBindingsByAccountId: {
          "acct-1": [expect.objectContaining({ id: "pay-1" })],
        },
        summary: {
          miniApps: 0,
          officialAccounts: 1,
          qrDefaultAccounts: 1,
        },
      },
      isBootstrapped: true,
    });
  });
});

function createBackendClient(): SdkworkOpenPlatformAdminBackendClient {
  return {
    openPlatform: {
      accounts: {
        list: vi.fn().mockResolvedValue({
          items: [
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
        }),
        create: vi.fn().mockResolvedValue(createAccountRecord()),
        retrieve: vi.fn().mockResolvedValue(createAccountRecord()),
        update: vi.fn().mockResolvedValue(createAccountRecord({ qrDefault: true })),
        delete: vi.fn().mockResolvedValue(createAccountRecord({ status: "inactive" })),
        entries: {
          list: vi.fn().mockResolvedValue({
            items: [
              {
                accountId: "acct-1",
                id: "entry-1",
                key: "login",
                status: "active",
                type: "url",
                url: "https://platform.example.test/login",
              },
            ],
          }),
          create: vi.fn().mockResolvedValue({ accountId: "acct-1", id: "entry-1" }),
          update: vi.fn().mockResolvedValue({ accountId: "acct-1", id: "entry-1" }),
          delete: vi.fn().mockResolvedValue({ accountId: "acct-1", id: "entry-1", status: "inactive" }),
        },
        hooks: {
          list: vi.fn(),
          create: vi.fn(),
          update: vi.fn(),
          delete: vi.fn(),
        },
        menus: {
          list: vi.fn(),
          create: vi.fn(),
        },
        payBindings: {
          list: vi.fn().mockResolvedValue({
            items: [
              {
                accountId: "acct-1",
                id: "pay-1",
                mode: "direct",
                paymentAccountId: "payment-account-1",
                scene: "mini_app",
                status: "active",
              },
            ],
          }),
          create: vi.fn().mockResolvedValue({ accountId: "acct-1", id: "pay-1" }),
          delete: vi.fn().mockResolvedValue({ accountId: "acct-1", id: "pay-1", status: "inactive" }),
        },
      },
      providers: { list: vi.fn() },
      manifests: { list: vi.fn() },
    },
  } as unknown as SdkworkOpenPlatformAdminBackendClient;
}

function createAccountRecord(input: Record<string, unknown> = {}) {
  return {
    appId: "wx123",
    defaultEntryId: "entry-1",
    id: "acct-1",
    key: "wechat_mp",
    name: "WeChat MP",
    provider: "wechat",
    qrDefault: false,
    secretRef: "secret://wechat_mp",
    status: "active",
    type: "official_account",
    ...input,
  };
}
