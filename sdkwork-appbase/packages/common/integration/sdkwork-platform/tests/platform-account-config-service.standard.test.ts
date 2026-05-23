import { describe, expect, it, vi } from "vitest";

import {
  createPlatformAccountConfigMemoryStore,
  createPlatformAccountConfigService,
  createPlatformQrAuthDefaultAccountResolver,
  createPlatformQrAuthMemoryStore,
  createPlatformQrAuthService,
  type PlatformQrAuthIamPort,
  type PlatformQrAuthResult,
} from "../src/index";

describe("SDKWork platform account configuration service", () => {
  it("lists and removes admin-managed mini app and official account records with provider filters", async () => {
    const config = createPlatformAccountConfigService({
      store: createPlatformAccountConfigMemoryStore(),
      now: () => new Date("2026-05-21T05:00:00.000Z"),
    });
    const official = await config.accounts.create({
      provider: "wechat",
      type: "official_account",
      key: "wechat_mp",
      name: "WeChat MP",
    });
    const mini = await config.accounts.create({
      provider: "douyin",
      type: "mini_app",
      key: "douyin_mini",
      name: "Douyin Mini",
    });
    await config.accounts.create({
      provider: "feishu",
      type: "bot",
      key: "feishu_bot",
      name: "Feishu Bot",
    });

    await expect(config.accounts.list({ type: "official_account", provider: "wechat" })).resolves.toEqual({
      items: [expect.objectContaining({ id: official.id, key: "wechat_mp" })],
    });
    await expect(config.accounts.list({ type: "mini_app" })).resolves.toEqual({
      items: [expect.objectContaining({ id: mini.id, key: "douyin_mini" })],
    });

    await expect(config.accounts.delete(official.id)).resolves.toEqual(
      expect.objectContaining({ id: official.id, status: "inactive", qrDefault: false }),
    );
    await expect(config.accounts.list({ status: "active" })).resolves.toEqual({
      items: expect.not.arrayContaining([expect.objectContaining({ id: official.id })]),
    });
  });

  it("manages multiple platform accounts while QR auth uses only the active QR default entry", async () => {
    const config = createPlatformAccountConfigService({
      store: createPlatformAccountConfigMemoryStore(),
      now: () => new Date("2026-05-21T05:00:00.000Z"),
    });
    const official = await config.accounts.create({
      provider: "wechat",
      type: "official_account",
      key: "wechat_mp",
      name: "WeChat MP",
    });
    const mini = await config.accounts.create({
      provider: "douyin",
      type: "mini_app",
      key: "douyin_mini",
      name: "Douyin Mini",
    });
    const officialEntry = await config.accounts.entries.create(official.id, {
      key: "login",
      type: "url",
      url: "https://platform.example.test/open/wechat_mp/login",
    });
    await config.accounts.entries.create(mini.id, {
      key: "login",
      type: "mini_app_url",
      url: "snssdk1128://microapp?app_id=tt123&start_page=pages/login/index",
    });

    await config.accounts.update(official.id, {
      defaultEntryId: officialEntry.id,
      qrDefault: true,
    });

    const resolver = createPlatformQrAuthDefaultAccountResolver(config);

    await expect(resolver("login")).resolves.toEqual({
      accountId: official.id,
      entryId: officialEntry.id,
      entryUrl: "https://platform.example.test/open/wechat_mp/login",
      provider: "wechat",
      type: "official_account",
    });
    await expect(config.accounts.list()).resolves.toEqual(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({ id: official.id, qrDefault: true }),
          expect.objectContaining({ id: mini.id, qrDefault: false }),
        ]),
      }),
    );
  });

  it("keeps the QR default exclusive when another account is promoted", async () => {
    const config = createPlatformAccountConfigService({
      store: createPlatformAccountConfigMemoryStore(),
      now: () => new Date("2026-05-21T05:00:00.000Z"),
    });
    const official = await config.accounts.create({
      provider: "wechat",
      type: "official_account",
      key: "wechat_mp",
      name: "WeChat MP",
    });
    const mini = await config.accounts.create({
      provider: "wechat",
      type: "mini_app",
      key: "wechat_mini",
      name: "WeChat Mini",
    });
    const officialEntry = await config.accounts.entries.create(official.id, {
      key: "login",
      type: "url",
      url: "https://platform.example.test/open/wechat_mp/login",
    });
    const miniEntry = await config.accounts.entries.create(mini.id, {
      key: "login",
      type: "mini_app_url",
      url: "weixin://dl/business/?t=mini_ticket",
    });

    await config.accounts.update(official.id, { defaultEntryId: officialEntry.id, qrDefault: true });
    await config.accounts.update(mini.id, { defaultEntryId: miniEntry.id, qrDefault: true });

    const accounts = await config.accounts.list();
    const resolver = createPlatformQrAuthDefaultAccountResolver(config);

    expect(accounts.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: official.id, qrDefault: false }),
        expect.objectContaining({ id: mini.id, qrDefault: true }),
      ]),
    );
    await expect(resolver("login")).resolves.toEqual(
      expect.objectContaining({
        accountId: mini.id,
        entryId: miniEntry.id,
        provider: "wechat",
        type: "mini_app",
      }),
    );
  });

  it("falls back to URL QR auth when no QR default account is configured", async () => {
    const config = createPlatformAccountConfigService({
      store: createPlatformAccountConfigMemoryStore(),
      now: () => new Date("2026-05-21T05:00:00.000Z"),
    });
    await config.accounts.create({
      provider: "wechat",
      type: "official_account",
      key: "wechat_mp",
      name: "WeChat MP",
    });
    const qrAuth = createPlatformQrAuthService({
      store: createPlatformQrAuthMemoryStore(),
      iam: createIam(),
      fallbackUrlBase: "https://auth.example.test/qr",
      defaultAccountResolver: createPlatformQrAuthDefaultAccountResolver(config),
      now: () => new Date("2026-05-21T05:00:00.000Z"),
      randomKey: () => "session_1",
    });

    await expect(qrAuth.qrAuth.sessions.create({ purpose: "login" })).resolves.toEqual(
      expect.objectContaining({
        qrContent: {
          mode: "fallback_url",
          content: "https://auth.example.test/qr?session_key=session_1&purpose=login",
        },
      }),
    );
  });

  it("rejects duplicate account keys and duplicate entry keys in the same account", async () => {
    const config = createPlatformAccountConfigService({
      store: createPlatformAccountConfigMemoryStore(),
      now: () => new Date("2026-05-21T05:00:00.000Z"),
    });
    const official = await config.accounts.create({
      provider: "wechat",
      type: "official_account",
      key: "wechat_mp",
      name: "WeChat MP",
    });

    await expect(
      config.accounts.create({
        provider: "wechat",
        type: "official_account",
        key: "wechat_mp",
        name: "Duplicate WeChat MP",
      }),
    ).rejects.toThrow(/account key/i);

    await config.accounts.entries.create(official.id, {
      key: "login",
      type: "url",
      url: "https://platform.example.test/open/wechat_mp/login",
    });
    await expect(
      config.accounts.entries.create(official.id, {
        key: "login",
        type: "url",
        url: "https://platform.example.test/open/wechat_mp/another-login",
      }),
    ).rejects.toThrow(/entry key/i);
  });

  it("clears QR default when the default account is deactivated", async () => {
    const config = createPlatformAccountConfigService({
      store: createPlatformAccountConfigMemoryStore(),
      now: () => new Date("2026-05-21T05:00:00.000Z"),
    });
    const official = await config.accounts.create({
      provider: "wechat",
      type: "official_account",
      key: "wechat_mp",
      name: "WeChat MP",
    });
    const entry = await config.accounts.entries.create(official.id, {
      key: "login",
      type: "url",
      url: "https://platform.example.test/open/wechat_mp/login",
    });

    await config.accounts.update(official.id, { defaultEntryId: entry.id, qrDefault: true });
    const inactive = await config.accounts.update(official.id, { status: "inactive" });
    const resolver = createPlatformQrAuthDefaultAccountResolver(config);

    expect(inactive).toEqual(expect.objectContaining({ status: "inactive", qrDefault: false }));
    await expect(resolver("login")).resolves.toBeNull();
  });

  it("rejects promoting an account as QR default unless it has an active owned default entry", async () => {
    const config = createPlatformAccountConfigService({
      store: createPlatformAccountConfigMemoryStore(),
      now: () => new Date("2026-05-21T05:00:00.000Z"),
    });
    const official = await config.accounts.create({
      provider: "wechat",
      type: "official_account",
      key: "wechat_mp",
      name: "WeChat MP",
    });
    const other = await config.accounts.create({
      provider: "douyin",
      type: "mini_app",
      key: "douyin_mini",
      name: "Douyin Mini",
    });
    const otherEntry = await config.accounts.entries.create(other.id, {
      key: "login",
      type: "mini_app_url",
      url: "snssdk1128://microapp?app_id=tt123&start_page=pages/login/index",
    });

    await expect(config.accounts.update(official.id, { qrDefault: true })).rejects.toThrow(/default entry/i);
    await expect(
      config.accounts.update(official.id, {
        defaultEntryId: otherEntry.id,
        qrDefault: true,
      }),
    ).rejects.toThrow(/owned by account/i);
  });

  it("validates QR default entry URLs at admin configuration time", async () => {
    const config = createPlatformAccountConfigService({
      store: createPlatformAccountConfigMemoryStore(),
      now: () => new Date("2026-05-21T05:00:00.000Z"),
    });
    const official = await config.accounts.create({
      provider: "wechat",
      type: "official_account",
      key: "wechat_mp",
      name: "WeChat MP",
    });
    const mini = await config.accounts.create({
      provider: "wechat",
      type: "mini_app",
      key: "wechat_mini",
      name: "WeChat Mini",
    });
    const invalidOfficialEntry = await config.accounts.entries.create(official.id, {
      key: "login",
      type: "url",
      url: "pages/login/index",
    });
    const invalidMiniEntry = await config.accounts.entries.create(mini.id, {
      key: "login",
      type: "mini_app_url",
      url: "https://example.test/pages/login/index",
    });

    await expect(
      config.accounts.update(official.id, {
        defaultEntryId: invalidOfficialEntry.id,
        qrDefault: true,
      }),
    ).rejects.toThrow(/official account entry URL/i);
    await expect(
      config.accounts.update(mini.id, {
        defaultEntryId: invalidMiniEntry.id,
        qrDefault: true,
      }),
    ).rejects.toThrow(/mini app URL/i);
  });

  it("updates and deletes entries without leaving a stale QR default", async () => {
    const config = createPlatformAccountConfigService({
      store: createPlatformAccountConfigMemoryStore(),
      now: () => new Date("2026-05-21T05:00:00.000Z"),
    });
    const mini = await config.accounts.create({
      provider: "wechat",
      type: "mini_app",
      key: "wechat_mini",
      name: "WeChat Mini",
    });
    const entry = await config.accounts.entries.create(mini.id, {
      key: "login",
      type: "mini_app_url",
      url: "weixin://dl/business/?t=old_ticket",
    });

    await config.accounts.update(mini.id, { defaultEntryId: entry.id, qrDefault: true });
    const updatedEntry = await config.accounts.entries.update(mini.id, entry.id, {
      url: "weixin://dl/business/?t=new_ticket",
    });
    const resolver = createPlatformQrAuthDefaultAccountResolver(config);

    expect(updatedEntry.url).toBe("weixin://dl/business/?t=new_ticket");
    await expect(resolver("login")).resolves.toEqual(
      expect.objectContaining({
        entryUrl: "weixin://dl/business/?t=new_ticket",
      }),
    );

    await config.accounts.entries.delete(mini.id, entry.id);
    const account = await config.accounts.retrieve(mini.id);

    expect(account).toEqual(expect.objectContaining({ defaultEntryId: null, qrDefault: false }));
    await expect(resolver("login")).resolves.toBeNull();
  });
});

function createIam(): PlatformQrAuthIamPort {
  return {
    loginWithPassword: vi.fn(async (input): Promise<PlatformQrAuthResult> => tokenResult(`password_${input.username}`)),
    registerWithPassword: vi.fn(async (input): Promise<PlatformQrAuthResult> => tokenResult(`register_${input.username}`)),
    completeExternalLogin: vi.fn(async (input): Promise<PlatformQrAuthResult> => tokenResult(`external_${input.externalUserId}`)),
  };
}

function tokenResult(suffix: string): PlatformQrAuthResult {
  return {
    userId: `user_${suffix}`,
    accessToken: `access_${suffix}`,
    authToken: `auth_${suffix}`,
    refreshToken: `refresh_${suffix}`,
    expiresIn: 7200,
  };
}
