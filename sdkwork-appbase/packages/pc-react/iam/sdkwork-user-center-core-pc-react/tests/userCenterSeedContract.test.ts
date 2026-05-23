import { describe, expect, it } from "vitest";

import * as userCenterCore from "../src/index.ts";

function requireExport<T>(name: string): T {
  return (userCenterCore as Record<string, unknown>)[name] as T;
}

describe("user-center seed contract catalog", () => {
  it("publishes governed seed domains with parity-safe and fast-login-aware fields", () => {
    const createUserCenterSeedContractCatalog = requireExport<
      (() => {
        authority: {
          domains: string[];
          exportable: boolean;
          fields: Array<{ name: string; required: boolean; secret?: boolean }>;
          idempotent: boolean;
          inspectable: boolean;
          replaySafe: boolean;
        };
        authDevelopment: {
          domains: string[];
          exportable: boolean;
          fields: Array<{ name: string; required: boolean; secret?: boolean }>;
          idempotent: boolean;
          inspectable: boolean;
          replaySafe: boolean;
        };
        catalog: {
          domains: string[];
          exportable: boolean;
          fields: Array<{ name: string; required: boolean; secret?: boolean }>;
          idempotent: boolean;
          inspectable: boolean;
          replaySafe: boolean;
        };
        starterWorkspace: {
          domains: string[];
          exportable: boolean;
          fields: Array<{ name: string; required: boolean; secret?: boolean }>;
          idempotent: boolean;
          inspectable: boolean;
          replaySafe: boolean;
        };
      })
      | undefined
    >("createUserCenterSeedContractCatalog");

    expect(createUserCenterSeedContractCatalog).toBeTypeOf("function");

    const catalog = createUserCenterSeedContractCatalog?.();
    expect(catalog).toBeDefined();

    expect(catalog?.authority).toMatchObject({
      domains: ["sqlite", "postgresql", "upstream-bridge"],
      exportable: true,
      idempotent: true,
      inspectable: true,
      replaySafe: true,
    });
    expect(catalog?.authDevelopment).toMatchObject({
      domains: ["sqlite", "postgresql", "upstream-bridge"],
      exportable: true,
      idempotent: true,
      inspectable: true,
      replaySafe: true,
    });
    expect(catalog?.catalog).toMatchObject({
      domains: ["sqlite", "postgresql", "upstream-bridge"],
      exportable: true,
      idempotent: true,
      inspectable: true,
      replaySafe: true,
    });
    expect(catalog?.starterWorkspace).toMatchObject({
      domains: ["sqlite", "postgresql", "upstream-bridge"],
      exportable: true,
      idempotent: true,
      inspectable: true,
      replaySafe: true,
    });

    expect(catalog?.authority.fields.map((field) => field.name)).toEqual([
      "defaultTenant",
      "defaultOwnerUser",
      "defaultProfile",
      "defaultMembership",
      "localProviderMetadata",
      "oauthProviderMetadata",
    ]);
    expect(catalog?.authDevelopment.fields).toEqual([
      { name: "defaultAccount", required: true },
      { name: "defaultEmail", required: true },
      { name: "defaultPhone", required: false },
      { name: "defaultPassword", required: true, secret: true },
      { name: "fixedVerificationCode", required: false, secret: true },
      { name: "defaultLoginMethod", required: true },
    ]);
    expect(catalog?.catalog.fields.map((field) => field.name)).toEqual([
      "defaultSkills",
      "defaultTemplates",
      "defaultModels",
      "defaultProviders",
    ]);
    expect(catalog?.starterWorkspace.fields.map((field) => field.name)).toEqual([
      "starterWorkspace",
      "starterProject",
      "starterRuntimeConfiguration",
      "starterPolicy",
    ]);
  });
});
