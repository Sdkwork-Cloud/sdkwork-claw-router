import { describe, expect, it } from "vitest";

import {
  SDKWORK_IAM_API_ROUTES,
  SDKWORK_IAM_CAPABILITIES,
  SDKWORK_IAM_DOMAIN_MODELS,
  SDKWORK_IAM_HEADERS,
  SDKWORK_IAM_OPERATION_IDS,
  SDKWORK_IAM_STANDARD,
  SDKWORK_IAM_TABLES,
  SDKWORK_STANDARD_PAGE_QUERY_PARAMS,
  createIamAppContext,
  createIamShardingContext,
  isSdkworkQueryParameterName,
} from "../src/index";

describe("SDKWork IAM standard contracts", () => {
  it("keeps app and backend API prefixes aligned with the v3 standard", () => {
    expect(SDKWORK_IAM_STANDARD.api.appPrefix).toBe("/app/v3/api");
    expect(SDKWORK_IAM_STANDARD.api.backendPrefix).toBe("/backend/v3/api");
    expect(SDKWORK_IAM_STANDARD.api.openapi).toBe("3.1.2");
    expect(SDKWORK_IAM_API_ROUTES.auth.sessions.create.path).toBe("/app/v3/api/auth/sessions");
    expect(SDKWORK_IAM_API_ROUTES.auth.registrations.create.path).toBe("/app/v3/api/auth/registrations");
    expect(SDKWORK_IAM_API_ROUTES.auth.sessions.current.retrieve.path).toBe("/app/v3/api/auth/sessions/current");
    expect(SDKWORK_IAM_API_ROUTES.auth.verificationPolicy.retrieve.path).toBe("/app/v3/api/auth/verification_policy");
    expect(SDKWORK_IAM_API_ROUTES.iam.users.current.retrieve.path).toBe("/app/v3/api/iam/users/current");
    expect(SDKWORK_IAM_API_ROUTES.iam.users.list.path).toBe("/backend/v3/api/iam/users");
  });

  it("uses lower_snake_case URL segments without double underscores", () => {
    const paths = Object.values(SDKWORK_IAM_OPERATION_IDS).map((operation) => operation.path);

    for (const path of paths) {
      expect(path).not.toContain("__");
      expect(path).not.toContain("userCenter");
      expect(path).not.toContain("/auth/login");
      expect(path).not.toContain("qr_login_codes");
      expect(path).not.toContain("{organization_id}");
    }

    expect(paths).toContain("/backend/v3/api/iam/api_keys");
    expect(paths).toContain("/backend/v3/api/iam/security_events");
    expect(paths).toContain("/backend/v3/api/iam/audit_events");
  });

  it("uses dotted lowerCamelCase operationIds that generate nested SDK resources", () => {
    const operationIds = Object.values(SDKWORK_IAM_OPERATION_IDS).map((operation) => operation.operationId);
    const uniqueOperationIds = new Set(operationIds);

    expect(uniqueOperationIds.size).toBe(operationIds.length);
    expect(operationIds).toContain("sessions.create");
    expect(operationIds).toContain("registrations.create");
    expect(operationIds).toContain("sessions.current.retrieve");
    expect(operationIds).toContain("verificationPolicy.retrieve");
    expect(operationIds).toContain("verificationCodes.create");
    expect(operationIds).toContain("passwordResetRequests.create");
    expect(operationIds).toContain("apiKeys.list");
    expect(operationIds).toContain("securityEvents.list");
    expect(operationIds).toContain("auditEvents.list");
    expect(operationIds).not.toContain("loginQrCodeCallbacks.create");
    expect(operationIds).not.toContain("loginQrCodes.confirm");
    expect(operationIds).not.toContain("loginQrCodes.create");
    expect(operationIds).not.toContain("loginQrCodes.retrieve");

    for (const operationId of operationIds) {
      expect(operationId).toMatch(/^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)+$/);
      expect(operationId).not.toMatch(/(^auth\.|^iam\.)/);
      expect(operationId).not.toMatch(/[_\-/{}:\s]/);
    }
  });

  it("defines dual token security headers with canonical access token naming", () => {
    expect(SDKWORK_IAM_HEADERS.authToken).toEqual({
      header: "Authorization",
      scheme: "Bearer",
    });
    expect(SDKWORK_IAM_HEADERS.accessToken).toBe("Sdkwork-Access-Token");
  });

  it("keeps OpenAPI query parameter wire names stable and prevents SDK alias feedback loops", () => {
    expect(SDKWORK_STANDARD_PAGE_QUERY_PARAMS).toEqual(["page", "page_size", "cursor", "sort", "q"]);

    for (const queryName of SDKWORK_STANDARD_PAGE_QUERY_PARAMS) {
      expect(isSdkworkQueryParameterName(queryName)).toBe(true);
    }

    for (const forbiddenName of ["search_query", "keyword", "search", "pageNo", "pageSize", "searchQuery", "size", "page_no"]) {
      expect(isSdkworkQueryParameterName(forbiddenName)).toBe(false);
    }

    for (const operation of Object.values(SDKWORK_IAM_OPERATION_IDS)) {
      for (const queryName of operation.queryParameters ?? []) {
        expect(isSdkworkQueryParameterName(queryName)).toBe(true);
      }
    }
  });

  it("owns complete iam-prefixed database table names for shared IAM foundation", () => {
    expect(SDKWORK_IAM_TABLES).toMatchObject({
      tenant: "iam_tenant",
      organization: "iam_organization",
      organizationMember: "iam_organization_member",
      user: "iam_user",
      userIdentity: "iam_user_identity",
      credential: "iam_credential",
      session: "iam_session",
      mfaFactor: "iam_mfa_factor",
      device: "iam_device",
      role: "iam_role",
      permission: "iam_permission",
      policy: "iam_policy",
      rolePermission: "iam_role_permission",
      userRole: "iam_user_role",
      apiKey: "iam_api_key",
      securityEvent: "iam_security_event",
      auditEvent: "iam_audit_event",
    });

    for (const tableName of Object.values(SDKWORK_IAM_TABLES)) {
      expect(tableName).toMatch(/^iam_[a-z0-9_]+$/);
      expect(tableName).not.toContain("__");
    }
  });

  it("defines a complete composable IAM domain model catalog", () => {
    expect(SDKWORK_IAM_DOMAIN_MODELS.map((model) => model.name)).toEqual([
      "tenant",
      "organization",
      "organizationMember",
      "user",
      "userIdentity",
      "credential",
      "session",
      "mfaFactor",
      "device",
      "role",
      "permission",
      "policy",
      "rolePermission",
      "userRole",
      "apiKey",
      "securityEvent",
      "auditEvent",
    ]);

    for (const model of SDKWORK_IAM_DOMAIN_MODELS) {
      expect(model.domain).toBe("iam");
      expect(model.table).toBe(SDKWORK_IAM_TABLES[model.name]);
      expect(model.fields).toContain("id");
      expect(model.capabilities.length).toBeGreaterThan(0);
      expect(model.ownership).toMatch(/^(tenant|global)$/);

      if (model.ownership === "tenant") {
        expect(model.fields).toContain("tenant_id");
      }
    }

    expect(SDKWORK_IAM_DOMAIN_MODELS.find((model) => model.name === "permission")?.ownership).toBe("global");
    expect(SDKWORK_IAM_DOMAIN_MODELS.find((model) => model.name === "permission")?.fields).toContain("code");
    expect(SDKWORK_IAM_DOMAIN_MODELS.find((model) => model.name === "permission")?.fields).not.toContain("tenant_id");
    expect(SDKWORK_IAM_DOMAIN_MODELS.find((model) => model.name === "organizationMember")?.fields).toEqual([
      "id",
      "tenant_id",
      "organization_id",
      "user_id",
      "role_code",
      "status",
      "joined_at",
      "left_at",
      "remark",
    ]);
    expect(SDKWORK_IAM_DOMAIN_MODELS.find((model) => model.name === "session")?.fields).toEqual(
      expect.arrayContaining([
        "auth_token_hash",
        "access_token_hash",
        "sharding_key",
        "sharding_strategy",
        "data_scope_json",
        "permission_scope_json",
      ]),
    );
  });

  it("defines capability blocks that can be assembled by applications", () => {
    expect(SDKWORK_IAM_CAPABILITIES.map((capability) => capability.name)).toEqual([
      "tenantManagement",
      "organizationManagement",
      "userDirectory",
      "accountIdentity",
      "sessionSecurity",
      "accessControl",
      "apiAccess",
      "securityAudit",
    ]);

    for (const capability of SDKWORK_IAM_CAPABILITIES) {
      expect(capability.domain).toBe("iam");
      expect(capability.sdkNamespaces.length).toBeGreaterThan(0);
      expect(capability.models.length).toBeGreaterThan(0);
      expect(capability.operations.length).toBeGreaterThan(0);

      for (const operationId of capability.operations) {
        expect(SDKWORK_IAM_OPERATION_IDS[operationId]).toBeDefined();
      }
    }

    expect(SDKWORK_IAM_CAPABILITIES.find((capability) => capability.name === "accountIdentity")).toMatchObject({
      sdkNamespaces: ["auth", "iam"],
      operations: expect.arrayContaining([
        "passwordResetRequests.create",
        "passwordResets.create",
        "registrations.create",
        "verificationPolicy.retrieve",
        "verificationCodes.create",
        "verificationCodes.verify",
        "users.current.retrieve",
      ]),
    });
    expect(SDKWORK_IAM_CAPABILITIES.find((capability) => capability.name === "sessionSecurity")).toMatchObject({
      sdkNamespaces: ["auth"],
      operations: expect.arrayContaining([
        "oauthAuthorizationUrls.retrieve",
        "oauthSessions.create",
        "sessions.create",
        "sessions.current.delete",
        "sessions.current.retrieve",
        "sessions.current.update",
        "sessions.refresh",
      ]),
    });
    expect(SDKWORK_IAM_CAPABILITIES.find((capability) => capability.name === "sessionSecurity")?.operations).not.toEqual(
      expect.arrayContaining([
        "loginQrCodeCallbacks.create",
        "loginQrCodes.confirm",
        "loginQrCodes.create",
        "loginQrCodes.retrieve",
      ]),
    );
    expect(SDKWORK_IAM_CAPABILITIES.find((capability) => capability.name === "sessionSecurity")?.operations).not.toContain(
      "registrations.create",
    );
    expect(SDKWORK_IAM_CAPABILITIES.find((capability) => capability.name === "accessControl")).toMatchObject({
      sdkNamespaces: ["iam"],
      operations: expect.arrayContaining([
        "roles.permissions.create",
        "users.roles.list",
        "permissions.list",
        "policies.list",
      ]),
    });
  });

  it("assigns every operation to exactly one composable capability block", () => {
    const operationIds = Object.keys(SDKWORK_IAM_OPERATION_IDS).sort();
    const capabilityOperationIds = SDKWORK_IAM_CAPABILITIES.flatMap((capability) => capability.operations).sort();

    expect(capabilityOperationIds).toEqual(operationIds);
    expect(new Set(capabilityOperationIds).size).toBe(operationIds.length);
  });

  it("creates explicit AppContext and ShardingContext from access token claims", () => {
    const appContext = createIamAppContext({
      appId: "sdkwork-router",
      authLevel: "mfa",
      dataScope: ["tenant:t1", "organization:o1"],
      deploymentMode: "saas",
      environment: "dev",
      organizationId: "o1",
      permissionScope: ["iam.users.read"],
      sessionId: "s1",
      tenantId: "t1",
      userId: "u1",
    });

    expect(appContext).toEqual({
      appId: "sdkwork-router",
      authLevel: "mfa",
      dataScope: ["tenant:t1", "organization:o1"],
      deploymentMode: "saas",
      environment: "dev",
      organizationId: "o1",
      permissionScope: ["iam.users.read"],
      sessionId: "s1",
      tenantId: "t1",
      userId: "u1",
    });

    expect(createIamShardingContext(appContext)).toEqual({
      shardingKey: "t1",
      shardingStrategy: "tenant",
    });
  });
});
