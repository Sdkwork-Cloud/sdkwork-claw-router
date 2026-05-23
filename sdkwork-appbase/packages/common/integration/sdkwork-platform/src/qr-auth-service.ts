import type { PlatformAccountType, PlatformProvider, PlatformQrAuthPurpose, PlatformQrAuthStatus } from "./platform-types";

export type PlatformQrAuthContentMode = "fallback_url" | "official_account_entry" | "mini_app_url";
export type PlatformQrAuthActorType = "password" | "scanner" | "system" | "webhook";
export type PlatformQrAuthLogResult = "failed" | "success";
export type PlatformQrAuthScanSource = "app" | "browser" | "mini_app" | "official_account" | "webhook";

export interface PlatformQrAuthQrContent {
  content: string;
  mode: PlatformQrAuthContentMode;
}

export interface PlatformMiniAppUrlRule {
  host?: string;
  pathPrefix?: string;
  protocol: string;
}

export const SDKWORK_PLATFORM_MINI_APP_URL_RULES = {
  alipay: [{ protocol: "alipays:", host: "platformapi", pathPrefix: "/startapp" }],
  baidu: [{ protocol: "baiduboxapp:" }, { protocol: "https:", host: "smartprogram.baidu.com" }],
  douyin: [
    { protocol: "snssdk1128:", host: "microapp" },
    { protocol: "snssdk2329:", host: "microapp" },
    { protocol: "https:", host: "v.douyin.com" },
  ],
  feishu: [{ protocol: "https:", host: "applink.feishu.cn", pathPrefix: "/client/mini_program" }],
  kuaishou: [{ protocol: "kwai:", host: "miniapp" }, { protocol: "https:", host: "m.kuaishou.com" }],
  wechat: [
    { protocol: "weixin:", host: "dl", pathPrefix: "/business/" },
    { protocol: "https:", host: "wxaurl.cn" },
    { protocol: "https:", host: "wxmpurl.cn" },
  ],
} as const satisfies Record<PlatformProvider, readonly PlatformMiniAppUrlRule[]>;

export interface PlatformQrAuthAccountSelection {
  accountId: string;
  entryId: string;
  entryUrl: string;
  provider: PlatformProvider;
  type: Extract<PlatformAccountType, "mini_app" | "official_account">;
}

export interface PlatformQrAuthSessionRecord {
  completedAt: string | null;
  createdAt: string;
  defaultAccountId: string | null;
  defaultAccountType: PlatformQrAuthAccountSelection["type"] | null;
  defaultEntryId: string | null;
  defaultProvider: PlatformProvider | null;
  expiresAt: string;
  fallbackUrl: string;
  id: string;
  purpose: PlatformQrAuthPurpose;
  qrContent: PlatformQrAuthQrContent;
  scannedAt: string | null;
  sessionKey: string;
  status: PlatformQrAuthStatus;
  updatedAt: string;
}

export interface PlatformQrAuthScanRecord {
  accountId: string | null;
  createdAt: string;
  entryId: string | null;
  externalUserId: string | null;
  id: string;
  ipHash?: string;
  scanSource: PlatformQrAuthScanSource;
  sessionId: string;
  sessionKey: string;
  userAgent?: string;
}

export interface PlatformQrAuthEventRecord {
  conversationId?: string;
  createdAt: string;
  deliveryId?: string;
  eventType: string;
  id: string;
  messageId?: string;
  payload?: Record<string, unknown>;
  sessionId: string;
  sessionKey: string;
}

export interface PlatformQrAuthLogRecord {
  actorId?: string;
  actorType: PlatformQrAuthActorType;
  createdAt: string;
  eventType: string;
  id: string;
  message?: string;
  result: PlatformQrAuthLogResult;
  sessionId: string;
  sessionKey: string;
}

export interface PlatformQrAuthListResult<TItem> {
  cursor?: string;
  items: TItem[];
}

export interface PlatformQrAuthSessionListFilter {
  purpose?: PlatformQrAuthPurpose;
  status?: PlatformQrAuthStatus;
}

export interface PlatformQrAuthStore {
  createEvent(input: PlatformQrAuthEventRecord): Promise<PlatformQrAuthEventRecord>;
  createLog(input: PlatformQrAuthLogRecord): Promise<PlatformQrAuthLogRecord>;
  createScan(input: PlatformQrAuthScanRecord): Promise<PlatformQrAuthScanRecord>;
  createSession(input: PlatformQrAuthSessionRecord): Promise<PlatformQrAuthSessionRecord>;
  listEvents(sessionKey: string, cursor?: string): Promise<PlatformQrAuthListResult<PlatformQrAuthEventRecord>>;
  listLogs(sessionKey: string, cursor?: string): Promise<PlatformQrAuthListResult<PlatformQrAuthLogRecord>>;
  listScans(sessionKey: string): Promise<PlatformQrAuthListResult<PlatformQrAuthScanRecord>>;
  listSessions(filter?: PlatformQrAuthSessionListFilter): Promise<PlatformQrAuthListResult<PlatformQrAuthSessionRecord>>;
  retrieveSession(sessionKey: string): Promise<PlatformQrAuthSessionRecord | null>;
  updateSession(input: PlatformQrAuthSessionRecord): Promise<PlatformQrAuthSessionRecord>;
}

export interface PlatformQrAuthResult {
  accessToken: string;
  authToken: string;
  expiresIn: number;
  refreshToken?: string;
  userId: string;
}

export interface PlatformQrAuthPasswordLoginInput {
  password: string;
  username: string;
}

export interface PlatformQrAuthPasswordRegisterInput extends PlatformQrAuthPasswordLoginInput {
  [key: string]: unknown;
}

export interface PlatformQrAuthExternalLoginInput {
  accountId: string;
  externalUserId: string;
  provider: PlatformProvider;
  purpose: PlatformQrAuthPurpose;
  sessionKey: string;
}

export interface PlatformQrAuthIamPort {
  completeExternalLogin(input: PlatformQrAuthExternalLoginInput): Promise<PlatformQrAuthResult>;
  loginWithPassword(input: PlatformQrAuthPasswordLoginInput): Promise<PlatformQrAuthResult>;
  registerWithPassword(input: PlatformQrAuthPasswordRegisterInput): Promise<PlatformQrAuthResult>;
}

export interface PlatformQrAuthCreateSessionInput {
  purpose: PlatformQrAuthPurpose;
}

export interface PlatformQrAuthCreateScanInput {
  accountId?: string;
  entryId?: string;
  externalUserId?: string;
  ipHash?: string;
  scanSource: PlatformQrAuthScanSource;
  userAgent?: string;
}

export interface PlatformQrAuthCompleteSessionInput {
  accountId?: string;
  conversationId?: string;
  deliveryId?: string;
  externalUserId: string;
  messageId?: string;
}

export interface PlatformQrAuthWebhookInput extends PlatformQrAuthCompleteSessionInput {
  entryId?: string;
  ipHash?: string;
  userAgent?: string;
}

export interface CreatePlatformQrAuthServiceInput {
  defaultAccountResolver: (purpose: PlatformQrAuthPurpose) => Promise<PlatformQrAuthAccountSelection | null>;
  fallbackUrlBase: string;
  iam: PlatformQrAuthIamPort;
  now?: () => Date;
  randomKey?: () => string;
  sessionTtlSeconds?: number;
  store: PlatformQrAuthStore;
}

export interface PlatformQrAuthService {
  admin: {
    qrAuth: {
      sessions: {
        complete(sessionKey: string, input: PlatformQrAuthCompleteSessionInput): Promise<PlatformQrAuthResult>;
        list(filter?: PlatformQrAuthSessionListFilter): Promise<PlatformQrAuthListResult<PlatformQrAuthSessionRecord>>;
        logs: {
          list(sessionKey: string, options?: { cursor?: string }): Promise<PlatformQrAuthListResult<PlatformQrAuthLogRecord>>;
        };
        webhooks: {
          create(sessionKey: string, input: PlatformQrAuthWebhookInput): Promise<PlatformQrAuthResult>;
        };
      };
    };
  };
  qrAuth: {
    sessions: {
      create(input: PlatformQrAuthCreateSessionInput): Promise<PlatformQrAuthSessionRecord>;
      events: {
        list(
          sessionKey: string,
          options?: { cursor?: string },
        ): Promise<PlatformQrAuthListResult<PlatformQrAuthEventRecord>>;
      };
      passwords: {
        create(sessionKey: string, input: PlatformQrAuthPasswordRegisterInput): Promise<PlatformQrAuthResult>;
      };
      retrieve(sessionKey: string): Promise<PlatformQrAuthSessionRecord>;
      scans: {
        create(sessionKey: string, input: PlatformQrAuthCreateScanInput): Promise<PlatformQrAuthScanRecord>;
      };
    };
  };
}

const DEFAULT_SESSION_TTL_SECONDS = 300;

export function createPlatformQrAuthService(input: CreatePlatformQrAuthServiceInput): PlatformQrAuthService {
  const now = input.now ?? (() => new Date());
  const randomKey = input.randomKey ?? createRandomSessionKey;
  const sessionTtlSeconds = input.sessionTtlSeconds ?? DEFAULT_SESSION_TTL_SECONDS;
  const nextId = createRecordIdFactory();

  async function createSession(createInput: PlatformQrAuthCreateSessionInput): Promise<PlatformQrAuthSessionRecord> {
    const purpose = normalizeQrAuthPurpose(createInput.purpose);
    const current = now();
    const createdAt = toIso(current);
    const sessionKey = randomKey();
    const fallbackUrl = createFallbackUrl(input.fallbackUrlBase, sessionKey, purpose);
    const account = await input.defaultAccountResolver(purpose);
    const qrContent = createQrContent(account, fallbackUrl, sessionKey, purpose);
    const session: PlatformQrAuthSessionRecord = {
      id: `qr_auth_session_${sessionKey}`,
      sessionKey,
      purpose,
      defaultAccountId: account?.accountId ?? null,
      defaultEntryId: account?.entryId ?? null,
      defaultProvider: account?.provider ?? null,
      defaultAccountType: account?.type ?? null,
      qrContent,
      fallbackUrl,
      status: "pending",
      scannedAt: null,
      completedAt: null,
      expiresAt: toIso(new Date(current.getTime() + sessionTtlSeconds * 1000)),
      createdAt,
      updatedAt: createdAt,
    };

    const created = await input.store.createSession(session);
    await appendEvent(created, "session.created", { qrMode: created.qrContent.mode });
    await appendLog(created, "system", "session.created", "success");
    return created;
  }

  async function retrieveSession(sessionKey: string): Promise<PlatformQrAuthSessionRecord> {
    const session = await requireSession(sessionKey);
    return refreshExpiredSession(session);
  }

  async function listSessions(
    filter?: PlatformQrAuthSessionListFilter,
  ): Promise<PlatformQrAuthListResult<PlatformQrAuthSessionRecord>> {
    const result = await input.store.listSessions(filter);
    const refreshed: PlatformQrAuthSessionRecord[] = [];
    for (const session of result.items) {
      refreshed.push(await refreshExpiredSession(session));
    }
    return { ...result, items: refreshed };
  }

  async function listEvents(
    sessionKey: string,
    options?: { cursor?: string },
  ): Promise<PlatformQrAuthListResult<PlatformQrAuthEventRecord>> {
    await refreshExpiredSession(await requireSession(sessionKey));
    return input.store.listEvents(sessionKey, options?.cursor);
  }

  async function listLogs(
    sessionKey: string,
    options?: { cursor?: string },
  ): Promise<PlatformQrAuthListResult<PlatformQrAuthLogRecord>> {
    await refreshExpiredSession(await requireSession(sessionKey));
    return input.store.listLogs(sessionKey, options?.cursor);
  }

  async function createScan(sessionKey: string, scanInput: PlatformQrAuthCreateScanInput): Promise<PlatformQrAuthScanRecord> {
    const session = await requireSession(sessionKey);
    let activeSession: PlatformQrAuthSessionRecord;
    try {
      activeSession = await ensureActiveSession(session);
    } catch (error) {
      await appendLog(session, "scanner", "session.scanned", "failed", scanInput.externalUserId, getErrorMessage(error));
      throw error;
    }
    let scanSource: PlatformQrAuthScanSource;
    try {
      scanSource = normalizeQrAuthScanSource(scanInput.scanSource);
    } catch (error) {
      await appendLog(activeSession, "scanner", "session.scanned", "failed", scanInput.externalUserId, getErrorMessage(error));
      throw error;
    }
    const current = toIso(now());
    const scan: PlatformQrAuthScanRecord = {
      id: nextId("qr_auth_scan"),
      sessionId: activeSession.id,
      sessionKey: activeSession.sessionKey,
      accountId: scanInput.accountId ?? activeSession.defaultAccountId,
      entryId: scanInput.entryId ?? activeSession.defaultEntryId,
      externalUserId: scanInput.externalUserId ?? null,
      scanSource,
      ...(scanInput.userAgent ? { userAgent: scanInput.userAgent } : {}),
      ...(scanInput.ipHash ? { ipHash: scanInput.ipHash } : {}),
      createdAt: current,
    };
    try {
      assertMatchesDefaultAccount(activeSession, scan.accountId, "QR auth scan");
      assertMatchesDefaultEntry(activeSession, scan.entryId, "QR auth scan");
    } catch (error) {
      await appendLog(activeSession, "scanner", "session.scanned", "failed", scanInput.externalUserId, getErrorMessage(error));
      throw error;
    }
    const claim = await findClaimedScan(activeSession.sessionKey);
    if (claim && !scanMatchesClaim(claim, scan, true)) {
      const message = "QR auth session already claimed by a different scanner";
      await appendLog(activeSession, "scanner", "session.scanned", "failed", scanInput.externalUserId, message);
      throw new Error(message);
    }
    const createdScan = await input.store.createScan(scan);
    const nextSession =
      activeSession.status === "pending"
        ? await input.store.updateSession({
            ...activeSession,
            status: "scanned",
            scannedAt: current,
            updatedAt: current,
          })
        : activeSession;

    await appendEvent(nextSession, "session.scanned", {
      accountId: createdScan.accountId,
      entryId: createdScan.entryId,
      externalUserId: createdScan.externalUserId,
      scanSource: createdScan.scanSource,
    });
    await appendLog(nextSession, "scanner", "session.scanned", "success", createdScan.externalUserId ?? undefined);
    return createdScan;
  }

  async function handleWebhook(sessionKey: string, webhookInput: PlatformQrAuthWebhookInput): Promise<PlatformQrAuthResult> {
    const session = await requireSession(sessionKey);
    let activeSession: PlatformQrAuthSessionRecord;
    try {
      activeSession = await ensureActiveSession(session);
    } catch (error) {
      await appendLog(session, "webhook", "session.scanned", "failed", webhookInput.externalUserId, getErrorMessage(error));
      throw error;
    }
    try {
      assertWebhookCompletionAvailable(activeSession);
      assertMatchesDefaultAccount(
        activeSession,
        webhookInput.accountId ?? activeSession.defaultAccountId,
        "QR auth webhook scan",
      );
      assertMatchesDefaultEntry(
        activeSession,
        webhookInput.entryId ?? activeSession.defaultEntryId,
        "QR auth webhook scan",
      );
    } catch (error) {
      await appendLog(activeSession, "webhook", "session.scanned", "failed", webhookInput.externalUserId, getErrorMessage(error));
      throw error;
    }

    const current = toIso(now());
    const scan = await input.store.createScan({
      id: nextId("qr_auth_scan"),
      sessionId: activeSession.id,
      sessionKey: activeSession.sessionKey,
      accountId: webhookInput.accountId ?? activeSession.defaultAccountId,
      entryId: webhookInput.entryId ?? activeSession.defaultEntryId,
      externalUserId: webhookInput.externalUserId,
      scanSource: "webhook",
      ...(webhookInput.userAgent ? { userAgent: webhookInput.userAgent } : {}),
      ...(webhookInput.ipHash ? { ipHash: webhookInput.ipHash } : {}),
      createdAt: current,
    });
    const scanned =
      activeSession.status === "pending"
        ? await input.store.updateSession({
            ...activeSession,
            status: "scanned",
            scannedAt: current,
            updatedAt: current,
          })
        : activeSession;
    await appendEvent(scanned, "session.scanned", {
      accountId: scan.accountId,
      entryId: scan.entryId,
      externalUserId: scan.externalUserId,
      scanSource: scan.scanSource,
    });
    await appendLog(scanned, "webhook", "session.scanned", "success", webhookInput.externalUserId);
    return completeSession(sessionKey, webhookInput);
  }

  async function completeSession(
    sessionKey: string,
    completeInput: PlatformQrAuthCompleteSessionInput,
  ): Promise<PlatformQrAuthResult> {
    const session = await requireSession(sessionKey);
    try {
      const activeSession = await ensureActiveSession(session);
      assertWebhookCompletionAvailable(activeSession);
      const accountId = completeInput.accountId ?? activeSession.defaultAccountId;
      if (accountId !== activeSession.defaultAccountId) {
        throw new Error("QR auth webhook completion does not match the default platform account");
      }
      const claim = await findClaimedScan(activeSession.sessionKey);
      if (!claim) {
        throw new Error("QR auth external completion requires a recorded scan");
      }
      if (!scanMatchesClaim(claim, {
        accountId,
        entryId: null,
        externalUserId: completeInput.externalUserId,
      }, false)) {
        throw new Error("QR auth webhook completion does not match the claimed scan");
      }

      const result = await input.iam.completeExternalLogin({
        provider: activeSession.defaultProvider,
        accountId,
        externalUserId: completeInput.externalUserId,
        purpose: activeSession.purpose,
        sessionKey: activeSession.sessionKey,
      });
      const current = toIso(now());
      const completed = await input.store.updateSession({
        ...activeSession,
        status: "completed",
        completedAt: current,
        updatedAt: current,
      });
      await appendEvent(completed, "session.completed", {
        method: "external",
        accountId,
        externalUserId: completeInput.externalUserId,
      }, {
        conversationId: completeInput.conversationId,
        deliveryId: completeInput.deliveryId,
        messageId: completeInput.messageId,
      });
      await appendLog(completed, "webhook", "session.completed", "success", completeInput.externalUserId);
      return result;
    } catch (error) {
      await appendLog(session, "webhook", "session.completed", "failed", completeInput.externalUserId, getErrorMessage(error));
      throw error;
    }
  }

  async function completeWithPassword(
    sessionKey: string,
    passwordInput: PlatformQrAuthPasswordRegisterInput,
  ): Promise<PlatformQrAuthResult> {
    const session = await requireSession(sessionKey);
    try {
      const activeSession = await ensureActiveSession(session);
      const username = normalizeRequiredText(passwordInput.username, "username");
      const password = requireNonBlankText(passwordInput.password, "password");
      const claim = await findClaimedScan(activeSession.sessionKey);
      if (!claim) {
        throw new Error("QR auth password completion requires a recorded scan");
      }
      const result =
        activeSession.purpose === "register"
          ? await input.iam.registerWithPassword({
              ...passwordInput,
              username,
              password,
            })
          : await input.iam.loginWithPassword({
              username,
              password,
            });
      const current = toIso(now());
      const completed = await input.store.updateSession({
        ...activeSession,
        status: "completed",
        completedAt: current,
        updatedAt: current,
      });
      await appendEvent(completed, "session.completed", { method: "password", username });
      await appendLog(completed, "password", "session.password_completed", "success", username);
      return result;
    } catch (error) {
      await appendLog(session, "password", "session.password_completed", "failed", passwordInput.username, getErrorMessage(error));
      throw error;
    }
  }

  async function requireSession(sessionKey: string): Promise<PlatformQrAuthSessionRecord> {
    const session = await input.store.retrieveSession(sessionKey);
    if (!session) {
      throw new Error(`QR auth session not found: ${sessionKey}`);
    }
    return session;
  }

  async function ensureActiveSession(session: PlatformQrAuthSessionRecord): Promise<PlatformQrAuthSessionRecord> {
    const refreshed = await refreshExpiredSession(session);
    if (refreshed.status === "expired") {
      throw new Error(`QR auth session expired: ${refreshed.sessionKey}`);
    }
    if (refreshed.status === "completed") {
      throw new Error(`QR auth session already completed: ${refreshed.sessionKey}`);
    }
    if (refreshed.status === "cancelled") {
      throw new Error(`QR auth session cancelled: ${refreshed.sessionKey}`);
    }
    return refreshed;
  }

  async function refreshExpiredSession(session: PlatformQrAuthSessionRecord): Promise<PlatformQrAuthSessionRecord> {
    if (!isActiveStatus(session.status) || Date.parse(session.expiresAt) > now().getTime()) {
      return session;
    }
    const current = toIso(now());
    const expired = await input.store.updateSession({
      ...session,
      status: "expired",
      updatedAt: current,
    });
    await appendEvent(expired, "session.expired");
    await appendLog(expired, "system", "session.expired", "success");
    return expired;
  }

  async function findClaimedScan(sessionKey: string): Promise<PlatformQrAuthScanRecord | null> {
    const scans = await input.store.listScans(sessionKey);
    return scans.items.find((scan) => scan.sessionKey === sessionKey) ?? null;
  }

  async function appendEvent(
    session: PlatformQrAuthSessionRecord,
    eventType: string,
    payload?: Record<string, unknown>,
    refs?: { conversationId?: string; deliveryId?: string; messageId?: string },
  ): Promise<PlatformQrAuthEventRecord> {
    const createdAt = toIso(now());
    return input.store.createEvent({
      id: nextId("qr_auth_event"),
      sessionId: session.id,
      sessionKey: session.sessionKey,
      eventType,
      ...(refs?.conversationId ? { conversationId: refs.conversationId } : {}),
      ...(refs?.deliveryId ? { deliveryId: refs.deliveryId } : {}),
      ...(refs?.messageId ? { messageId: refs.messageId } : {}),
      ...(payload ? { payload } : {}),
      createdAt,
    });
  }

  async function appendLog(
    session: PlatformQrAuthSessionRecord,
    actorType: PlatformQrAuthActorType,
    eventType: string,
    result: PlatformQrAuthLogResult,
    actorId?: string,
    message?: string,
  ): Promise<PlatformQrAuthLogRecord> {
    const createdAt = toIso(now());
    return input.store.createLog({
      id: nextId("qr_auth_log"),
      sessionId: session.id,
      sessionKey: session.sessionKey,
      actorType,
      ...(actorId ? { actorId } : {}),
      eventType,
      result,
      ...(message ? { message } : {}),
      createdAt,
    });
  }

  return {
    qrAuth: {
      sessions: {
        create: createSession,
        retrieve: retrieveSession,
        events: {
          list: listEvents,
        },
        passwords: {
          create: completeWithPassword,
        },
        scans: {
          create: createScan,
        },
      },
    },
    admin: {
      qrAuth: {
        sessions: {
          list: listSessions,
          complete: completeSession,
          logs: {
            list: listLogs,
          },
          webhooks: {
            create: handleWebhook,
          },
        },
      },
    },
  };
}

export function createPlatformQrAuthMemoryStore(): PlatformQrAuthStore {
  const sessions = new Map<string, PlatformQrAuthSessionRecord>();
  const scans: PlatformQrAuthScanRecord[] = [];
  const events: PlatformQrAuthEventRecord[] = [];
  const logs: PlatformQrAuthLogRecord[] = [];
  let scanSeq = 0;
  let eventSeq = 0;
  let logSeq = 0;

  return {
    async createSession(session) {
      const cloned = cloneSession(session);
      sessions.set(cloned.sessionKey, cloned);
      return cloneSession(cloned);
    },
    async retrieveSession(sessionKey) {
      const session = sessions.get(sessionKey);
      return session ? cloneSession(session) : null;
    },
    async updateSession(session) {
      if (!sessions.has(session.sessionKey)) {
        throw new Error(`QR auth session not found: ${session.sessionKey}`);
      }
      const cloned = cloneSession(session);
      sessions.set(cloned.sessionKey, cloned);
      return cloneSession(cloned);
    },
    async listSessions(filter) {
      const items = [...sessions.values()]
        .filter((session) => !filter?.purpose || session.purpose === filter.purpose)
        .filter((session) => !filter?.status || session.status === filter.status)
        .map(cloneSession);
      return { items };
    },
    async createScan(scan) {
      scanSeq += 1;
      const cloned = { ...scan, id: scan.id || `qr_auth_scan_${scanSeq}` };
      scans.push(cloned);
      return { ...cloned };
    },
    async listScans(sessionKey) {
      return {
        items: scans.filter((scan) => scan.sessionKey === sessionKey).map((scan) => ({ ...scan })),
      };
    },
    async createEvent(event) {
      eventSeq += 1;
      const cloned = cloneEvent({ ...event, id: event.id || `qr_auth_event_${eventSeq}` });
      events.push(cloned);
      return cloneEvent(cloned);
    },
    async listEvents(sessionKey, cursor) {
      return listByCursor(
        events.filter((event) => event.sessionKey === sessionKey).map(cloneEvent),
        cursor,
      );
    },
    async createLog(log) {
      logSeq += 1;
      const cloned = { ...log, id: log.id || `qr_auth_log_${logSeq}` };
      logs.push(cloned);
      return { ...cloned };
    },
    async listLogs(sessionKey, cursor) {
      return listByCursor(
        logs.filter((log) => log.sessionKey === sessionKey).map((log) => ({ ...log })),
        cursor,
      );
    },
  };
}

export function createPlatformQrAuthQrContent(
  account: PlatformQrAuthAccountSelection | null,
  fallbackUrl: string,
  sessionKey?: string,
  purpose?: PlatformQrAuthPurpose,
): PlatformQrAuthQrContent {
  if (!account) {
    return {
      mode: "fallback_url",
      content: fallbackUrl,
    };
  }
  const entryUrl = sessionKey && purpose
    ? addQrAuthSessionContext(account.entryUrl, sessionKey, purpose, account.accountId, account.entryId)
    : account.entryUrl;
  if (account.type === "official_account") {
    assertAbsoluteUrl(entryUrl, "official account entry URL");
    return {
      mode: "official_account_entry",
      content: entryUrl,
    };
  }

  assertMiniAppUrl(entryUrl, account.provider);
  return {
    mode: "mini_app_url",
    content: entryUrl,
  };
}

const createQrContent = createPlatformQrAuthQrContent;

function createFallbackUrl(base: string, sessionKey: string, purpose: PlatformQrAuthPurpose): string {
  const url = new URL(base);
  url.searchParams.set("session_key", sessionKey);
  url.searchParams.set("purpose", purpose);
  return url.toString();
}

function addQrAuthSessionContext(
  entryUrl: string,
  sessionKey: string,
  purpose: PlatformQrAuthPurpose,
  accountId: string,
  entryId: string,
): string {
  const fragmentIndex = entryUrl.indexOf("#");
  const urlWithoutFragment = fragmentIndex >= 0 ? entryUrl.slice(0, fragmentIndex) : entryUrl;
  const fragment = fragmentIndex >= 0 ? entryUrl.slice(fragmentIndex) : "";
  const queryIndex = urlWithoutFragment.indexOf("?");
  const base = queryIndex >= 0 ? urlWithoutFragment.slice(0, queryIndex) : urlWithoutFragment;
  const existingQuery = queryIndex >= 0 ? urlWithoutFragment.slice(queryIndex + 1) : "";
  const existingParams = existingQuery
    .split("&")
    .filter(Boolean)
    .filter((part) => {
      const key = decodeQueryKey(part.split("=", 1)[0] ?? "");
      return key !== "session_key"
        && key !== "purpose"
        && key !== "account_id"
        && key !== "entry_id"
        && key !== "scan_source";
    });
  const sessionParams = new URLSearchParams({
    session_key: sessionKey,
    purpose,
    account_id: accountId,
    entry_id: entryId,
  }).toString();
  const nextQuery = [...existingParams, sessionParams].join("&");
  return `${base}${nextQuery ? `?${nextQuery}` : ""}${fragment}`;
}

function decodeQueryKey(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/gu, " "));
  } catch {
    return value;
  }
}

export function assertPlatformMiniAppUrl(value: string, provider: PlatformProvider): void {
  const url = parseAbsoluteUrl(value, "mini app URL");
  const rules = SDKWORK_PLATFORM_MINI_APP_URL_RULES[provider];
  if (rules.some((rule) => matchesMiniAppUrlRule(url, rule))) {
    return;
  }
  throw new Error(`Invalid mini app URL: ${provider} entry URL does not match a supported mini app URL rule`);
}

const assertMiniAppUrl = assertPlatformMiniAppUrl;

function matchesMiniAppUrlRule(url: URL, rule: PlatformMiniAppUrlRule): boolean {
  if (url.protocol !== rule.protocol) {
    return false;
  }
  if (rule.host && url.hostname !== rule.host) {
    return false;
  }
  if (rule.pathPrefix && !url.pathname.startsWith(rule.pathPrefix)) {
    return false;
  }
  return true;
}

export function assertPlatformAbsoluteUrl(value: string, label: string): void {
  parseAbsoluteUrl(value, label);
}

const assertAbsoluteUrl = assertPlatformAbsoluteUrl;

function parseAbsoluteUrl(value: string, label: string): URL {
  if (!value.trim()) {
    throw new Error(`Invalid ${label}: value is empty`);
  }
  try {
    const url = new URL(value);
    if (!url.protocol || !url.host) {
      throw new Error("missing protocol or host");
    }
    return url;
  } catch {
    throw new Error(`Invalid ${label}: expected an absolute URL`);
  }
}

function createRandomSessionKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function createRecordIdFactory(): (prefix: string) => string {
  let sequence = 0;
  return (prefix: string) => {
    sequence += 1;
    return `${prefix}_${sequence}`;
  };
}

function isActiveStatus(status: PlatformQrAuthStatus): boolean {
  return status === "pending" || status === "scanned";
}

function normalizeQrAuthPurpose(purpose: unknown): PlatformQrAuthPurpose {
  if (purpose === "login" || purpose === "register") {
    return purpose;
  }
  throw new Error("QR auth purpose must be login or register");
}

function normalizeQrAuthScanSource(scanSource: unknown): PlatformQrAuthScanSource {
  if (
    scanSource === "app"
    || scanSource === "browser"
    || scanSource === "mini_app"
    || scanSource === "official_account"
    || scanSource === "webhook"
  ) {
    return scanSource;
  }
  throw new Error("QR auth scan source must be app, browser, mini_app, official_account, or webhook");
}

function normalizeRequiredText(value: unknown, label: string): string {
  if (typeof value !== "string") {
    throw new Error(`QR auth ${label} is required`);
  }
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`QR auth ${label} is required`);
  }
  return normalized;
}

function requireNonBlankText(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`QR auth ${label} is required`);
  }
  return value;
}

function assertWebhookCompletionAvailable(
  session: PlatformQrAuthSessionRecord,
): asserts session is PlatformQrAuthSessionRecord & { defaultAccountId: string; defaultProvider: PlatformProvider } {
  if (!session.defaultProvider || !session.defaultAccountId) {
    throw new Error("QR auth session has no default platform account for webhook completion");
  }
}

function assertMatchesDefaultAccount(
  session: PlatformQrAuthSessionRecord,
  accountId: string | null | undefined,
  label: string,
): void {
  if (!session.defaultAccountId) {
    return;
  }
  if (scanValueConflicts(session.defaultAccountId, accountId)) {
    throw new Error(`${label} does not match the default platform account`);
  }
}

function assertMatchesDefaultEntry(
  session: PlatformQrAuthSessionRecord,
  entryId: string | null | undefined,
  label: string,
): void {
  if (!session.defaultEntryId) {
    return;
  }
  if (scanValueConflicts(session.defaultEntryId, entryId)) {
    throw new Error(`${label} does not match the default platform entry`);
  }
}

function scanMatchesClaim(
  claim: Pick<PlatformQrAuthScanRecord, "accountId" | "entryId" | "externalUserId">,
  candidate: Pick<PlatformQrAuthScanRecord, "accountId" | "entryId" | "externalUserId">,
  includeEntry: boolean,
): boolean {
  if (scanValueConflicts(claim.accountId, candidate.accountId)) {
    return false;
  }
  if (includeEntry && scanValueConflicts(claim.entryId, candidate.entryId)) {
    return false;
  }
  if (scanValueConflicts(claim.externalUserId, candidate.externalUserId)) {
    return false;
  }
  return true;
}

function scanValueConflicts(left: string | null | undefined, right: string | null | undefined): boolean {
  const normalizedLeft = left?.trim() || null;
  const normalizedRight = right?.trim() || null;
  return Boolean(normalizedLeft || normalizedRight) && normalizedLeft !== normalizedRight;
}

function toIso(value: Date): string {
  return value.toISOString();
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function cloneSession(session: PlatformQrAuthSessionRecord): PlatformQrAuthSessionRecord {
  return {
    ...session,
    qrContent: { ...session.qrContent },
  };
}

function cloneEvent(event: PlatformQrAuthEventRecord): PlatformQrAuthEventRecord {
  return {
    ...event,
    ...(event.payload ? { payload: { ...event.payload } } : {}),
  };
}

function listByCursor<TItem>(items: TItem[], cursor?: string): PlatformQrAuthListResult<TItem> {
  const offset = cursor ? Number.parseInt(cursor, 10) : 0;
  const start = Number.isFinite(offset) && offset > 0 ? offset : 0;
  const sliced = items.slice(start);
  return {
    items: sliced,
    cursor: String(start + sliced.length),
  };
}
