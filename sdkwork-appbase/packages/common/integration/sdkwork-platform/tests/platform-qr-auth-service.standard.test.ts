import { describe, expect, it, vi } from "vitest";

import {
  createPlatformQrAuthMemoryStore,
  createPlatformQrAuthService,
  type PlatformQrAuthAccountSelection,
  type PlatformQrAuthIamPort,
  type PlatformQrAuthPurpose,
  type PlatformQrAuthResult,
} from "../src/index";

describe("SDKWork platform QR auth service", () => {
  it("creates fallback URL QR sessions when no default account is configured", async () => {
    const harness = createHarness({ defaultAccount: null });

    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    expect(session).toEqual(
      expect.objectContaining({
        purpose: "login",
        status: "pending",
        qrContent: {
          mode: "fallback_url",
          content: "https://auth.example.test/qr?session_key=session_1&purpose=login",
        },
        fallbackUrl: "https://auth.example.test/qr?session_key=session_1&purpose=login",
        defaultAccountId: null,
        defaultEntryId: null,
      }),
    );
    expect(await harness.service.qrAuth.sessions.retrieve(session.sessionKey)).toEqual(
      expect.objectContaining({
        sessionKey: "session_1",
        status: "pending",
      }),
    );
    expect(harness.defaultAccountResolver).toHaveBeenCalledWith("login");
  });

  it("rejects QR session creation with a non-standard purpose", async () => {
    const harness = createHarness({ defaultAccount: null });

    await expect(
      harness.service.qrAuth.sessions.create({ purpose: "reset_password" } as never),
    ).rejects.toThrow(/purpose/i);

    expect(harness.defaultAccountResolver).not.toHaveBeenCalled();
  });

  it("uses the default official account entry as QR content and records scan events and logs", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
      accountId: "account_official_1",
      entryId: "entry_official_1",
      externalUserId: "openid_1",
      scanSource: "official_account",
      userAgent: "MicroMessenger",
      ipHash: "ip_hash_1",
    });

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const events = await harness.service.qrAuth.sessions.events.list(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(session.qrContent).toEqual({
      mode: "official_account_entry",
      content: "https://platform.example.test/official/account_official_1/entry?session_key=session_1&purpose=login&account_id=account_official_1&entry_id=entry_official_1",
    });
    expect(stored).toEqual(expect.objectContaining({ status: "scanned", scannedAt: "2026-05-21T05:00:00.000Z" }));
    expect(events.items).toEqual([
      expect.objectContaining({
        eventType: "session.created",
        sessionId: session.id,
      }),
      expect.objectContaining({
        eventType: "session.scanned",
        payload: {
          accountId: "account_official_1",
          entryId: "entry_official_1",
          externalUserId: "openid_1",
          scanSource: "official_account",
        },
      }),
    ]);
    expect(logs.items.map((log) => [log.eventType, log.result])).toEqual([
      ["session.created", "success"],
      ["session.scanned", "success"],
    ]);
  });

  it("adds QR session context to configured official account and mini app entry URLs", async () => {
    const officialHarness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry?scene=follow",
      },
    });
    const miniAppHarness = createHarness({
      defaultAccount: {
        accountId: "account_mini_1",
        entryId: "entry_mini_1",
        provider: "douyin",
        type: "mini_app",
        entryUrl: "snssdk1128://microapp?app_id=tt123&start_page=pages/login/index",
      },
    });

    const officialSession = await officialHarness.service.qrAuth.sessions.create({ purpose: "login" });
    const miniAppSession = await miniAppHarness.service.qrAuth.sessions.create({ purpose: "register" });
    const officialUrl = new URL(officialSession.qrContent.content);
    const miniAppUrl = new URL(miniAppSession.qrContent.content);

    expect(officialSession.qrContent.mode).toBe("official_account_entry");
    expect(officialUrl.searchParams.get("scene")).toBe("follow");
    expect(officialUrl.searchParams.get("session_key")).toBe(officialSession.sessionKey);
    expect(officialUrl.searchParams.get("purpose")).toBe("login");
    expect(officialUrl.searchParams.get("account_id")).toBe("account_official_1");
    expect(officialUrl.searchParams.get("entry_id")).toBe("entry_official_1");
    expect(miniAppSession.qrContent.mode).toBe("mini_app_url");
    expect(miniAppUrl.searchParams.get("app_id")).toBe("tt123");
    expect(miniAppUrl.searchParams.get("session_key")).toBe(miniAppSession.sessionKey);
    expect(miniAppUrl.searchParams.get("purpose")).toBe("register");
    expect(miniAppUrl.searchParams.get("account_id")).toBe("account_mini_1");
    expect(miniAppUrl.searchParams.get("entry_id")).toBe("entry_mini_1");
  });

  it("replaces stale QR session context already present in configured entry URLs", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/entry?session_key=stale&purpose=register&account_id=stale_account&entry_id=stale_entry&scene=follow#wechat_redirect",
      },
    });

    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });
    const qrUrl = new URL(session.qrContent.content);

    expect(qrUrl.searchParams.getAll("session_key")).toEqual([session.sessionKey]);
    expect(qrUrl.searchParams.getAll("purpose")).toEqual(["login"]);
    expect(qrUrl.searchParams.getAll("account_id")).toEqual(["account_official_1"]);
    expect(qrUrl.searchParams.getAll("entry_id")).toEqual(["entry_official_1"]);
    expect(qrUrl.searchParams.get("scene")).toBe("follow");
    expect(qrUrl.hash).toBe("#wechat_redirect");
  });

  it("generates stable unique IDs for multiple scan events in the same millisecond", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    const firstScan = await harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
      accountId: "account_official_1",
      entryId: "entry_official_1",
      externalUserId: "openid_1",
      scanSource: "official_account",
    });
    const secondScan = await harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
      accountId: "account_official_1",
      entryId: "entry_official_1",
      externalUserId: "openid_1",
      scanSource: "official_account",
    });
    const events = await harness.service.qrAuth.sessions.events.list(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(new Set([firstScan.id, secondScan.id]).size).toBe(2);
    expect(new Set(events.items.map((event) => event.id)).size).toBe(events.items.length);
    expect(new Set(logs.items.map((log) => log.id)).size).toBe(logs.items.length);
  });

  it("rejects QR scans from a different external identity after the session is claimed", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
      accountId: "account_official_1",
      entryId: "entry_official_1",
      externalUserId: "openid_1",
      scanSource: "official_account",
    });

    await expect(
      harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        externalUserId: "openid_2",
        scanSource: "official_account",
      }),
    ).rejects.toThrow(/already claimed/i);

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const events = await harness.service.qrAuth.sessions.events.list(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(stored).toEqual(expect.objectContaining({ status: "scanned" }));
    expect(events.items.filter((event) => event.eventType === "session.scanned")).toHaveLength(1);
    expect(logs.items.at(-1)).toEqual(
      expect.objectContaining({
        actorId: "openid_2",
        eventType: "session.scanned",
        result: "failed",
      }),
    );
  });

  it("rejects QR scans that do not match the configured default entry", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await expect(
      harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
        accountId: "account_official_1",
        entryId: "entry_official_2",
        externalUserId: "openid_1",
        scanSource: "official_account",
      }),
    ).rejects.toThrow(/default platform entry/i);

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const events = await harness.service.qrAuth.sessions.events.list(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(stored.status).toBe("pending");
    expect(events.items.filter((event) => event.eventType === "session.scanned")).toHaveLength(0);
    expect(logs.items.at(-1)).toEqual(
      expect.objectContaining({
        actorId: "openid_1",
        eventType: "session.scanned",
        result: "failed",
      }),
    );
  });

  it("rejects QR scans that do not match the configured default account", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await expect(
      harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
        accountId: "account_official_2",
        entryId: "entry_official_1",
        externalUserId: "openid_1",
        scanSource: "official_account",
      }),
    ).rejects.toThrow(/default platform account/i);

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const events = await harness.service.qrAuth.sessions.events.list(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(stored.status).toBe("pending");
    expect(events.items.filter((event) => event.eventType === "session.scanned")).toHaveLength(0);
    expect(logs.items.at(-1)).toEqual(
      expect.objectContaining({
        actorId: "openid_1",
        eventType: "session.scanned",
        result: "failed",
      }),
    );
  });

  it("rejects QR scans with a non-standard scan source", async () => {
    const harness = createHarness({ defaultAccount: null });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await expect(
      harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
        scanSource: "unknown_channel",
      } as never),
    ).rejects.toThrow(/scan source/i);

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const events = await harness.service.qrAuth.sessions.events.list(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(stored.status).toBe("pending");
    expect(events.items.filter((event) => event.eventType === "session.scanned")).toHaveLength(0);
    expect(logs.items.at(-1)).toEqual(
      expect.objectContaining({
        eventType: "session.scanned",
        result: "failed",
      }),
    );
  });

  it("uses the default mini app URL as QR content and rejects invalid mini app URLs", async () => {
    const validHarness = createHarness({
      defaultAccount: {
        accountId: "account_mini_1",
        entryId: "entry_mini_1",
        provider: "douyin",
        type: "mini_app",
        entryUrl: "snssdk1128://microapp?app_id=tt123&start_page=pages/login/index",
      },
    });

    await expect(validHarness.service.qrAuth.sessions.create({ purpose: "login" })).resolves.toEqual(
      expect.objectContaining({
        qrContent: {
          mode: "mini_app_url",
          content: "snssdk1128://microapp?app_id=tt123&start_page=pages/login/index&session_key=session_1&purpose=login&account_id=account_mini_1&entry_id=entry_mini_1",
        },
      }),
    );

    const wechatHarness = createHarness({
      defaultAccount: {
        accountId: "account_mini_wechat",
        entryId: "entry_mini_wechat",
        provider: "wechat",
        type: "mini_app",
        entryUrl: "weixin://dl/business/?t=mini_ticket",
      },
    });

    await expect(wechatHarness.service.qrAuth.sessions.create({ purpose: "login" })).resolves.toEqual(
      expect.objectContaining({
        qrContent: {
          mode: "mini_app_url",
          content: "weixin://dl/business/?t=mini_ticket&session_key=session_1&purpose=login&account_id=account_mini_wechat&entry_id=entry_mini_wechat",
        },
      }),
    );

    const invalidHarness = createHarness({
      defaultAccount: {
        accountId: "account_mini_2",
        entryId: "entry_mini_2",
        provider: "wechat",
        type: "mini_app",
        entryUrl: "pages/login/index",
      },
    });

    await expect(invalidHarness.service.qrAuth.sessions.create({ purpose: "login" })).rejects.toThrow(
      /mini app URL/i,
    );

    const wrongHostHarness = createHarness({
      defaultAccount: {
        accountId: "account_mini_3",
        entryId: "entry_mini_3",
        provider: "wechat",
        type: "mini_app",
        entryUrl: "https://example.test/pages/login/index",
      },
    });

    await expect(wrongHostHarness.service.qrAuth.sessions.create({ purpose: "login" })).rejects.toThrow(
      /mini app URL/i,
    );
  });

  it("completes QR login through webhook by delegating token issuing to IAM without storing tokens", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
      accountId: "account_official_1",
      entryId: "entry_official_1",
      externalUserId: "openid_1",
      scanSource: "official_account",
    });
    const result = await harness.service.admin.qrAuth.sessions.complete(session.sessionKey, {
      accountId: "account_official_1",
      externalUserId: "openid_1",
      deliveryId: "delivery_1",
      conversationId: "conversation_1",
      messageId: "message_1",
    });

    const stored = await harness.store.retrieveSession(session.sessionKey);
    const events = await harness.service.qrAuth.sessions.events.list(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(result).toEqual({
      userId: "user_external_openid_1",
      accessToken: "access_external_openid_1",
      authToken: "auth_external_openid_1",
      refreshToken: "refresh_external_openid_1",
      expiresIn: 7200,
    });
    expect(harness.iam.completeExternalLogin).toHaveBeenCalledWith({
      provider: "wechat",
      accountId: "account_official_1",
      externalUserId: "openid_1",
      purpose: "login",
      sessionKey: session.sessionKey,
    });
    expect(stored).toEqual(
      expect.objectContaining({
        status: "completed",
        completedAt: "2026-05-21T05:00:00.000Z",
      }),
    );
    expect(JSON.stringify(stored)).not.toContain("access_external_openid_1");
    expect(JSON.stringify(stored)).not.toContain("refresh_external_openid_1");
    expect(events.items).toContainEqual(
      expect.objectContaining({
        eventType: "session.completed",
        deliveryId: "delivery_1",
        conversationId: "conversation_1",
        messageId: "message_1",
      }),
    );
    expect(logs.items.at(-1)).toEqual(
      expect.objectContaining({
        eventType: "session.completed",
        result: "success",
        actorType: "webhook",
      }),
    );
  });

  it("rejects webhook completion when the scanned account does not match the default login account", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await expect(
      harness.service.admin.qrAuth.sessions.complete(session.sessionKey, {
        accountId: "account_official_2",
        externalUserId: "openid_2",
      }),
    ).rejects.toThrow(/default platform account/i);

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(stored.status).toBe("pending");
    expect(harness.iam.completeExternalLogin).not.toHaveBeenCalled();
    expect(logs.items.at(-1)).toEqual(
      expect.objectContaining({
        eventType: "session.completed",
        result: "failed",
        actorId: "openid_2",
      }),
    );
  });

  it("rejects webhook completion when the external user does not match the claimed scan", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });
    await harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
      accountId: "account_official_1",
      entryId: "entry_official_1",
      externalUserId: "openid_1",
      scanSource: "official_account",
    });

    await expect(
      harness.service.admin.qrAuth.sessions.complete(session.sessionKey, {
        accountId: "account_official_1",
        externalUserId: "openid_2",
      }),
    ).rejects.toThrow(/claimed scan/i);

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(stored.status).toBe("scanned");
    expect(harness.iam.completeExternalLogin).not.toHaveBeenCalled();
    expect(logs.items.at(-1)).toEqual(
      expect.objectContaining({
        actorId: "openid_2",
        eventType: "session.completed",
        result: "failed",
      }),
    );
  });

  it("rejects provider webhook scans that do not match the configured default entry", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await expect(
      harness.service.admin.qrAuth.sessions.webhooks.create(session.sessionKey, {
        accountId: "account_official_1",
        entryId: "entry_official_2",
        externalUserId: "openid_1",
      }),
    ).rejects.toThrow(/default platform entry/i);

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const events = await harness.service.qrAuth.sessions.events.list(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(stored.status).toBe("pending");
    expect(events.items.filter((event) => event.eventType === "session.scanned")).toHaveLength(0);
    expect(harness.iam.completeExternalLogin).not.toHaveBeenCalled();
    expect(logs.items.at(-1)).toEqual(
      expect.objectContaining({
        actorId: "openid_1",
        actorType: "webhook",
        eventType: "session.scanned",
        result: "failed",
      }),
    );
  });

  it("rejects provider webhook completion for fallback URL sessions without claiming the QR session", async () => {
    const harness = createHarness({ defaultAccount: null });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await expect(
      harness.service.admin.qrAuth.sessions.webhooks.create(session.sessionKey, {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        externalUserId: "openid_1",
      }),
    ).rejects.toThrow(/no default platform account/i);

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const events = await harness.service.qrAuth.sessions.events.list(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(stored.status).toBe("pending");
    expect(events.items.filter((event) => event.eventType === "session.scanned")).toHaveLength(0);
    expect(harness.iam.completeExternalLogin).not.toHaveBeenCalled();
    expect(logs.items.at(-1)).toEqual(
      expect.objectContaining({
        actorId: "openid_1",
        actorType: "webhook",
        eventType: "session.scanned",
        result: "failed",
      }),
    );

    await expect(
      harness.service.qrAuth.sessions.passwords.create(session.sessionKey, {
        username: "fallback-user",
        password: "fallback-secret",
      }),
    ).rejects.toThrow(/scan/i);
  });

  it("keeps fallback URL sessions available for browser scans and password completion", async () => {
    const harness = createHarness({ defaultAccount: null });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await expect(
      harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
        scanSource: "browser",
        userAgent: "Mozilla/5.0",
      }),
    ).resolves.toEqual(expect.objectContaining({
      accountId: null,
      entryId: null,
      externalUserId: null,
      scanSource: "browser",
    }));
    await expect(
      harness.service.qrAuth.sessions.passwords.create(session.sessionKey, {
        username: "fallback-browser-user",
        password: "fallback-browser-secret",
      }),
    ).resolves.toEqual(expect.objectContaining({
      accessToken: "access_password_fallback-browser-user",
      authToken: "auth_password_fallback-browser-user",
    }));

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const events = await harness.service.qrAuth.sessions.events.list(session.sessionKey);

    expect(stored.status).toBe("completed");
    expect(events.items.map((event) => event.eventType)).toEqual([
      "session.created",
      "session.scanned",
      "session.completed",
    ]);
  });

  it("handles provider webhook scans by recording scan details and completing the QR session", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    const result = await harness.service.admin.qrAuth.sessions.webhooks.create(session.sessionKey, {
      accountId: "account_official_1",
      entryId: "entry_official_1",
      externalUserId: "openid_1",
      deliveryId: "delivery_1",
      conversationId: "conversation_1",
      messageId: "message_1",
      userAgent: "MicroMessenger",
      ipHash: "ip_hash_1",
    });

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const events = await harness.service.qrAuth.sessions.events.list(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(result.accessToken).toBe("access_external_openid_1");
    expect(stored).toEqual(
      expect.objectContaining({
        status: "completed",
        scannedAt: "2026-05-21T05:00:00.000Z",
        completedAt: "2026-05-21T05:00:00.000Z",
      }),
    );
    expect(events.items.map((event) => event.eventType)).toEqual([
      "session.created",
      "session.scanned",
      "session.completed",
    ]);
    expect(events.items.at(-1)).toEqual(
      expect.objectContaining({
        deliveryId: "delivery_1",
        conversationId: "conversation_1",
        messageId: "message_1",
      }),
    );
    expect(logs.items.map((log) => [log.actorType, log.eventType, log.result])).toEqual([
      ["system", "session.created", "success"],
      ["webhook", "session.scanned", "success"],
      ["webhook", "session.completed", "success"],
    ]);
  });

  it("exposes completion through session polling and cursor-based client events without leaking tokens", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });
    const firstBatch = await harness.service.qrAuth.sessions.events.list(session.sessionKey, { cursor: "0" });

    expect(firstBatch.items.map((event) => event.eventType)).toEqual(["session.created"]);
    expect(firstBatch.cursor).toBe("1");

    await harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
      accountId: "account_official_1",
      entryId: "entry_official_1",
      externalUserId: "openid_1",
      scanSource: "official_account",
    });
    await harness.service.admin.qrAuth.sessions.complete(session.sessionKey, {
      accountId: "account_official_1",
      externalUserId: "openid_1",
    });

    const completedSession = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const secondBatch = await harness.service.qrAuth.sessions.events.list(session.sessionKey, {
      cursor: firstBatch.cursor,
    });
    const emptyBatch = await harness.service.qrAuth.sessions.events.list(session.sessionKey, {
      cursor: secondBatch.cursor,
    });

    expect(completedSession).toEqual(
      expect.objectContaining({
        status: "completed",
        completedAt: "2026-05-21T05:00:00.000Z",
      }),
    );
    expect(secondBatch.items.map((event) => event.eventType)).toEqual(["session.scanned", "session.completed"]);
    expect(secondBatch.cursor).toBe("3");
    expect(emptyBatch.items).toEqual([]);
    expect(emptyBatch.cursor).toBe("3");
    expect(JSON.stringify(secondBatch)).not.toContain("access_external_openid_1");
    expect(JSON.stringify(completedSession)).not.toContain("access_external_openid_1");
  });

  it("requires a recorded scan before external completion can finish a QR session", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await expect(
      harness.service.admin.qrAuth.sessions.complete(session.sessionKey, {
        accountId: "account_official_1",
        externalUserId: "openid_1",
      }),
    ).rejects.toThrow(/scan/i);

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(stored.status).toBe("pending");
    expect(harness.iam.completeExternalLogin).not.toHaveBeenCalled();
    expect(logs.items.at(-1)).toEqual(expect.objectContaining({
      actorId: "openid_1",
      actorType: "webhook",
      eventType: "session.completed",
      result: "failed",
    }));
  });

  it("emits session expiration through cursor-based client events", async () => {
    const harness = createHarness({
      defaultAccount: null,
      now: new Date("2026-05-21T05:00:00.000Z"),
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });
    const firstBatch = await harness.service.qrAuth.sessions.events.list(session.sessionKey, { cursor: "0" });

    harness.setNow(new Date("2026-05-21T05:06:00.000Z"));

    const secondBatch = await harness.service.qrAuth.sessions.events.list(session.sessionKey, {
      cursor: firstBatch.cursor,
    });
    const stored = await harness.store.retrieveSession(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(secondBatch.items.map((event) => event.eventType)).toEqual(["session.expired"]);
    expect(secondBatch.cursor).toBe("2");
    expect(stored).toEqual(expect.objectContaining({ status: "expired" }));
    expect(logs.items.at(-1)).toEqual(expect.objectContaining({
      actorType: "system",
      eventType: "session.expired",
      result: "success",
    }));
  });

  it("rejects repeated QR completion after IAM has issued the login result", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await harness.service.qrAuth.sessions.scans.create(session.sessionKey, {
      accountId: "account_official_1",
      entryId: "entry_official_1",
      externalUserId: "openid_1",
      scanSource: "official_account",
    });
    await harness.service.admin.qrAuth.sessions.complete(session.sessionKey, {
      accountId: "account_official_1",
      externalUserId: "openid_1",
    });

    await expect(
      harness.service.admin.qrAuth.sessions.complete(session.sessionKey, {
        accountId: "account_official_1",
        externalUserId: "openid_1",
      }),
    ).rejects.toThrow(/already completed/i);
    await expect(
      harness.service.qrAuth.sessions.passwords.create(session.sessionKey, {
        username: "alice",
        password: "login-secret",
      }),
    ).rejects.toThrow(/already completed/i);

    const events = await harness.service.qrAuth.sessions.events.list(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(harness.iam.completeExternalLogin).toHaveBeenCalledTimes(1);
    expect(harness.iam.loginWithPassword).not.toHaveBeenCalled();
    expect(events.items.filter((event) => event.eventType === "session.completed")).toHaveLength(1);
    expect(logs.items.filter((log) => log.eventType === "session.completed" && log.result === "failed")).toHaveLength(1);
    expect(logs.items.filter((log) => log.eventType === "session.password_completed" && log.result === "failed")).toHaveLength(1);
  });

  it("supports password login and registration fallback through IAM without storing passwords or tokens", async () => {
    const harness = createHarness({ defaultAccount: null });
    const loginSession = await harness.service.qrAuth.sessions.create({ purpose: "login" });
    const registerSession = await harness.service.qrAuth.sessions.create({ purpose: "register" });

    await harness.service.qrAuth.sessions.scans.create(loginSession.sessionKey, {
      scanSource: "browser",
    });
    await harness.service.qrAuth.sessions.scans.create(registerSession.sessionKey, {
      scanSource: "browser",
    });

    const loginResult = await harness.service.qrAuth.sessions.passwords.create(loginSession.sessionKey, {
      username: "alice",
      password: "login-secret",
    });
    const registerResult = await harness.service.qrAuth.sessions.passwords.create(registerSession.sessionKey, {
      username: "bob",
      password: "register-secret",
      profile: { nickname: "Bob" },
    });

    const loginStored = await harness.store.retrieveSession(loginSession.sessionKey);
    const registerStored = await harness.store.retrieveSession(registerSession.sessionKey);

    expect(loginResult.accessToken).toBe("access_password_alice");
    expect(loginResult.authToken).toBe("auth_password_alice");
    expect(registerResult.accessToken).toBe("access_register_bob");
    expect(registerResult.authToken).toBe("auth_register_bob");
    expect(harness.iam.loginWithPassword).toHaveBeenCalledWith({
      username: "alice",
      password: "login-secret",
    });
    expect(harness.iam.registerWithPassword).toHaveBeenCalledWith({
      username: "bob",
      password: "register-secret",
      profile: { nickname: "Bob" },
    });
    expect(JSON.stringify([loginStored, registerStored])).not.toContain("secret");
    expect(JSON.stringify([loginStored, registerStored])).not.toContain("access_password_alice");
    expect(JSON.stringify([loginStored, registerStored])).not.toContain("auth_password_alice");
    expect(loginStored).toEqual(expect.objectContaining({ status: "completed" }));
    expect(registerStored).toEqual(expect.objectContaining({ status: "completed" }));
  });

  it("requires a recorded scan before password fallback can complete a QR session", async () => {
    const harness = createHarness({ defaultAccount: null });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await expect(
      harness.service.qrAuth.sessions.passwords.create(session.sessionKey, {
        username: "alice",
        password: "login-secret",
      }),
    ).rejects.toThrow(/scan/i);

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(stored.status).toBe("pending");
    expect(harness.iam.loginWithPassword).not.toHaveBeenCalled();
    expect(logs.items.at(-1)).toEqual(expect.objectContaining({
      actorId: "alice",
      actorType: "password",
      eventType: "session.password_completed",
      result: "failed",
    }));
  });

  it("rejects password fallback completion without standard credentials", async () => {
    const harness = createHarness({ defaultAccount: null });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });

    await expect(
      harness.service.qrAuth.sessions.passwords.create(session.sessionKey, {
        username: "",
        password: "login-secret",
      }),
    ).rejects.toThrow(/username/i);
    await expect(
      harness.service.qrAuth.sessions.passwords.create(session.sessionKey, {
        username: "alice",
        password: " ",
      }),
    ).rejects.toThrow(/password/i);

    const stored = await harness.service.qrAuth.sessions.retrieve(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(stored.status).toBe("pending");
    expect(harness.iam.loginWithPassword).not.toHaveBeenCalled();
    expect(logs.items.filter((log) => log.eventType === "session.password_completed" && log.result === "failed")).toHaveLength(2);
  });

  it("prevents completing expired sessions and records the failed completion log", async () => {
    const harness = createHarness({
      defaultAccount: {
        accountId: "account_official_1",
        entryId: "entry_official_1",
        provider: "wechat",
        type: "official_account",
        entryUrl: "https://platform.example.test/official/account_official_1/entry",
      },
      now: new Date("2026-05-21T05:00:00.000Z"),
    });
    const session = await harness.service.qrAuth.sessions.create({ purpose: "login" });
    harness.setNow(new Date("2026-05-21T05:06:00.000Z"));

    await expect(
      harness.service.admin.qrAuth.sessions.complete(session.sessionKey, {
        accountId: "account_official_1",
        externalUserId: "openid_1",
      }),
    ).rejects.toThrow(/expired/i);

    const stored = await harness.store.retrieveSession(session.sessionKey);
    const logs = await harness.service.admin.qrAuth.sessions.logs.list(session.sessionKey);

    expect(stored).toEqual(expect.objectContaining({ status: "expired" }));
    expect(logs.items.at(-1)).toEqual(
      expect.objectContaining({
        actorType: "webhook",
        eventType: "session.completed",
        result: "failed",
      }),
    );
    expect(logs.items.filter((log) => log.eventType === "session.completed" && log.result === "failed")).toHaveLength(1);
    expect(harness.iam.completeExternalLogin).not.toHaveBeenCalled();
  });
});

interface HarnessOptions {
  defaultAccount: PlatformQrAuthAccountSelection | null;
  now?: Date;
}

function createHarness(options: HarnessOptions) {
  let now = options.now ?? new Date("2026-05-21T05:00:00.000Z");
  let keyIndex = 0;
  const store = createPlatformQrAuthMemoryStore();
  const defaultAccountResolver = vi.fn(async (_purpose: PlatformQrAuthPurpose) => options.defaultAccount);
  const iam: PlatformQrAuthIamPort = {
    loginWithPassword: vi.fn(async (input): Promise<PlatformQrAuthResult> => {
      return tokenResult(`password_${input.username}`);
    }),
    registerWithPassword: vi.fn(async (input): Promise<PlatformQrAuthResult> => {
      return tokenResult(`register_${input.username}`);
    }),
    completeExternalLogin: vi.fn(async (input): Promise<PlatformQrAuthResult> => {
      return tokenResult(`external_${input.externalUserId}`);
    }),
  };

  const service = createPlatformQrAuthService({
    store,
    iam,
    fallbackUrlBase: "https://auth.example.test/qr",
    defaultAccountResolver,
    now: () => now,
    randomKey: () => {
      keyIndex += 1;
      return `session_${keyIndex}`;
    },
  });

  return {
    defaultAccountResolver,
    iam,
    service,
    store,
    setNow(next: Date) {
      now = next;
    },
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
