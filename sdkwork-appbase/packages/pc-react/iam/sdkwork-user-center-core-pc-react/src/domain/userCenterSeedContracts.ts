import type {
  UserCenterSeedContract,
  UserCenterSeedContractCatalog,
  UserCenterSeedContractField,
  UserCenterSeedStorageDomain,
} from "../types/userCenterTypes.ts";

export const USER_CENTER_SEED_STORAGE_DOMAINS = [
  "sqlite",
  "postgresql",
  "upstream-bridge",
] as const satisfies readonly UserCenterSeedStorageDomain[];

function createSeedField(
  name: string,
  _description: string,
  required: boolean,
  secret = false,
): UserCenterSeedContractField {
  return {
    name,
    required,
    ...(secret ? { secret: true } : {}),
  };
}

function createSeedContract(
  description: string,
  fields: readonly UserCenterSeedContractField[],
): UserCenterSeedContract {
  return {
    description,
    domains: [...USER_CENTER_SEED_STORAGE_DOMAINS],
    exportable: true,
    fields: fields.map((field) => ({
      ...field,
    })),
    idempotent: true,
    inspectable: true,
    replaySafe: true,
  };
}

export function createUserCenterSeedContractCatalog(): UserCenterSeedContractCatalog {
  return {
    authority: createSeedContract(
      "Canonical authority bootstrap data for user-center ownership and providers.",
      [
        createSeedField(
          "defaultTenant",
          "The default tenant scaffold owned by the application.",
          true,
        ),
        createSeedField(
          "defaultOwnerUser",
          "The default owner account seeded into the authority.",
          true,
        ),
        createSeedField("defaultProfile", "The canonical owner profile scaffold.", true),
        createSeedField(
          "defaultMembership",
          "The canonical membership seed scaffold.",
          true,
        ),
        createSeedField(
          "localProviderMetadata",
          "Builtin-local provider metadata for bootstrap flows.",
          true,
        ),
        createSeedField(
          "oauthProviderMetadata",
          "OAuth provider metadata exposed to the canonical auth surface.",
          false,
        ),
      ],
    ),
    authDevelopment: createSeedContract(
      "Development and test login defaults exposed through governed runtime prefill contracts.",
      [
        createSeedField(
          "defaultAccount",
          "The default account identifier presented for fast login.",
          true,
        ),
        createSeedField(
          "defaultEmail",
          "The default email presented for fast login.",
          true,
        ),
        createSeedField(
          "defaultPhone",
          "The default phone number presented for fast login.",
          false,
        ),
        createSeedField(
          "defaultPassword",
          "The default password presented for fast login.",
          true,
          true,
        ),
        createSeedField(
          "fixedVerificationCode",
          "The fixed verification code used for deterministic development login flows.",
          false,
          true,
        ),
        createSeedField(
          "defaultLoginMethod",
          "The preferred login method shown by default in development and test.",
          true,
        ),
      ],
    ),
    catalog: createSeedContract(
      "Starter catalog content for models, templates, providers, and skills.",
      [
        createSeedField("defaultSkills", "Starter skills catalog entries.", true),
        createSeedField("defaultTemplates", "Starter prompt or workflow templates.", true),
        createSeedField("defaultModels", "Starter model catalog entries.", true),
        createSeedField("defaultProviders", "Starter provider catalog entries.", true),
      ],
    ),
    starterWorkspace: createSeedContract(
      "Starter workspace and project bootstrap content.",
      [
        createSeedField("starterWorkspace", "Starter workspace metadata.", true),
        createSeedField("starterProject", "Starter project metadata and files.", true),
        createSeedField(
          "starterRuntimeConfiguration",
          "Starter runtime configuration scaffold.",
          true,
        ),
        createSeedField("starterPolicy", "Starter policy or guardrail scaffold.", true),
      ],
    ),
  };
}
