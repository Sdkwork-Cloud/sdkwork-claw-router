import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";
import type { SdkworkLlmMessage, SdkworkLlmMessageRole } from "@sdkwork/llm-pc-react";

export type SdkworkPromptKind = "agent" | "chat" | "system" | "workflow";
export type SdkworkPromptStatus = "archived" | "draft" | "published";
export type SdkworkPromptVisibility = "private" | "public" | "shared";
export type SdkworkPromptVariableType = "boolean" | "json" | "number" | "string" | "string-list";
export type SdkworkPromptCatalogSortMode = "latest" | "name" | "popular";
export type SdkworkPromptMissingValueStrategy = "empty" | "preserve-token";
export type SdkworkPromptVariableValue =
  | boolean
  | number
  | string
  | readonly string[]
  | Record<string, unknown>;

export interface SdkworkPromptVariableDefinition {
  defaultValue?: SdkworkPromptVariableValue;
  id: string;
  label: string;
  required: boolean;
  type: SdkworkPromptVariableType;
}

export interface SdkworkPromptMessageTemplate {
  id: string;
  role: SdkworkLlmMessageRole;
  template: string;
}

export interface SdkworkPromptVersion {
  createdAt: number;
  id: string;
  labels?: readonly string[];
  messages: readonly SdkworkPromptMessageTemplate[];
  status: SdkworkPromptStatus;
  version: number;
}

export interface SdkworkPromptAsset {
  id: string;
  kind: SdkworkPromptKind;
  name: string;
  summary?: string;
  tags: readonly string[];
  usageCount?: number;
  variables: readonly SdkworkPromptVariableDefinition[];
  versions: readonly SdkworkPromptVersion[];
  visibility: SdkworkPromptVisibility;
}

export interface FilterPromptCatalogOptions {
  kinds?: readonly SdkworkPromptKind[];
  labels?: readonly string[];
  query?: string;
  sort?: SdkworkPromptCatalogSortMode;
  tags?: readonly string[];
  visibility?: readonly SdkworkPromptVisibility[];
}

export interface ResolvePromptVersionOptions {
  label?: string;
  version?: number;
}

export interface RenderPromptTemplateOptions {
  missingValueStrategy?: SdkworkPromptMissingValueStrategy;
}

export interface SdkworkRenderedPromptTemplate {
  missingVariables: string[];
  output: string;
  ready: boolean;
  usedVariables: string[];
}

export interface CompilePromptAssetOptions extends ResolvePromptVersionOptions {
  values?: Record<string, SdkworkPromptVariableValue>;
}

export interface SdkworkCompiledPromptAsset {
  assetId: string;
  label?: string;
  messages: SdkworkLlmMessage[];
  missingVariables: string[];
  ready: boolean;
  usedVariables: string[];
  version: number;
  versionId: string;
}

export interface SdkworkPromptBundleEntry {
  assetId: string;
  label?: string;
  slot: string;
  version?: number;
}

export interface SdkworkPromptBundle {
  entries: readonly SdkworkPromptBundleEntry[];
  id: string;
  name: string;
}

export interface CompilePromptBundleOptions {
  values?: Record<string, Record<string, SdkworkPromptVariableValue>>;
}

export interface SdkworkPromptBundleMissingVariable {
  assetId: string;
  variableId: string;
}

export interface SdkworkCompiledPromptBundleEntry {
  compiled: SdkworkCompiledPromptAsset;
  slot: string;
}

export interface SdkworkCompiledPromptBundle {
  bundleId: string;
  entries: SdkworkCompiledPromptBundleEntry[];
  messages: SdkworkLlmMessage[];
  missingVariables: SdkworkPromptBundleMissingVariable[];
  ready: boolean;
}

export interface SdkworkPromptAssetDigest {
  defaultVersion?: number;
  defaultVersionId?: string;
  defaultVersionStatus?: SdkworkPromptStatus;
  id: string;
  kind: SdkworkPromptKind;
  labels: string[];
  latestVersion?: number;
  latestVersionStatus?: SdkworkPromptStatus;
  name: string;
  optionalVariableCount: number;
  publishedVersion?: number;
  publishedVersionId?: string;
  requiredVariableCount: number;
  tagCount: number;
  updatedAt: number;
  usageCount: number;
  variableCount: number;
  versionCount: number;
  visibility: SdkworkPromptVisibility;
}

export interface SdkworkPromptAssetDigestSummary {
  archivedDefaultAssets: number;
  assetCount: number;
  draftDefaultAssets: number;
  kindCounts: Record<SdkworkPromptKind, number>;
  latestUpdatedAt: number;
  privateAssets: number;
  publicAssets: number;
  publishedDefaultAssets: number;
  sharedAssets: number;
  totalRequiredVariables: number;
  totalUsageCount: number;
  totalVersions: number;
  uniqueLabelCount: number;
}

export type SdkworkPromptExecutionIssue =
  | "archived-version"
  | "draft-version"
  | "empty-messages"
  | "missing-asset"
  | "missing-variables"
  | "no-version";

export interface EvaluatePromptExecutionReadinessOptions extends CompilePromptAssetOptions {}

export interface SdkworkPromptExecutionReadiness {
  assetId: string;
  compiled?: SdkworkCompiledPromptAsset;
  degraded: boolean;
  issues: SdkworkPromptExecutionIssue[];
  ready: boolean;
  status?: SdkworkPromptStatus;
  version?: number;
  versionId?: string;
}

export interface SdkworkPromptBundleEntryExecutionReadiness extends SdkworkPromptExecutionReadiness {
  slot: string;
}

export interface EvaluatePromptBundleExecutionReadinessOptions extends CompilePromptBundleOptions {}

export interface SdkworkPromptBundleExecutionReadiness {
  bundle: SdkworkCompiledPromptBundle;
  bundleId: string;
  degraded: boolean;
  entries: SdkworkPromptBundleEntryExecutionReadiness[];
  issues: SdkworkPromptExecutionIssue[];
  ready: boolean;
}

export interface SdkworkPromptWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "prompt";
  detailRoutePattern: string;
  editorRoutePattern: string;
  routePath: string;
}

export interface CreatePromptWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkPromptLibraryRouteIntent {
  focusWindow: boolean;
  kind?: SdkworkPromptKind;
  label?: string;
  route: string;
  source: "prompt-library";
  tag?: string;
  type: "prompt-library-route-intent";
}

export interface CreatePromptLibraryRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  kind?: SdkworkPromptKind;
  label?: string;
  tag?: string;
}

export interface SdkworkPromptDetailRouteIntent {
  focusWindow: boolean;
  label?: string;
  promptId: string;
  route: string;
  source: "prompt-library";
  type: "prompt-detail-route-intent";
  version?: number;
}

export interface CreatePromptDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  label?: string;
  version?: number;
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function createPromptKindCounts(): Record<SdkworkPromptKind, number> {
  return {
    agent: 0,
    chat: 0,
    system: 0,
    workflow: 0,
  };
}

function latestTimestamp(asset: SdkworkPromptAsset): number {
  return asset.versions.reduce((latest, version) => Math.max(latest, version.createdAt), 0);
}

function normalizePromptValue(value: SdkworkPromptVariableValue): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.filter((entry) => entry.trim().length > 0).join(", ");
  }

  return JSON.stringify(value, null, 2);
}

function hasRenderableValue(value: SdkworkPromptVariableValue | undefined): boolean {
  if (value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.some((entry) => entry.trim().length > 0);
  }

  return true;
}

function sortPromptCatalog(
  assets: readonly SdkworkPromptAsset[],
  mode: SdkworkPromptCatalogSortMode = "latest",
): SdkworkPromptAsset[] {
  return [...assets].sort((left, right) => {
    if (mode === "popular") {
      const usageDifference = (right.usageCount ?? 0) - (left.usageCount ?? 0);
      if (usageDifference !== 0) {
        return usageDifference;
      }
    }

    if (mode === "latest") {
      const latestDifference = latestTimestamp(right) - latestTimestamp(left);
      if (latestDifference !== 0) {
        return latestDifference;
      }
    }

    return left.name.localeCompare(right.name);
  });
}

function matchesLabels(asset: SdkworkPromptAsset, labels: readonly string[]): boolean {
  return labels.every((label) =>
    asset.versions.some((version) => version.labels?.includes(label)),
  );
}

function promptSearchValues(asset: SdkworkPromptAsset): string[] {
  return [
    asset.name,
    asset.summary ?? "",
    asset.kind,
    asset.visibility,
    ...asset.tags,
    ...asset.variables.flatMap((variable) => [variable.id, variable.label]),
    ...asset.versions.flatMap((version) => version.labels ?? []),
  ];
}

function sortPromptVersions(versions: readonly SdkworkPromptVersion[]): SdkworkPromptVersion[] {
  return [...versions].sort((left, right) => {
    if (right.version !== left.version) {
      return right.version - left.version;
    }

    return right.createdAt - left.createdAt;
  });
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function toUniquePromptLabels(labels: readonly string[]): string[] {
  return Array.from(new Set(labels.map((label) => label.trim()).filter(Boolean))).sort((left, right) =>
    left.localeCompare(right),
  );
}

function toUniquePromptExecutionIssues(
  issues: readonly SdkworkPromptExecutionIssue[],
): SdkworkPromptExecutionIssue[] {
  const seen = new Set<SdkworkPromptExecutionIssue>();
  const uniqueIssues: SdkworkPromptExecutionIssue[] = [];

  for (const issue of issues) {
    if (seen.has(issue)) {
      continue;
    }

    seen.add(issue);
    uniqueIssues.push(issue);
  }

  return uniqueIssues;
}

export function filterPromptCatalog(
  assets: readonly SdkworkPromptAsset[],
  options: FilterPromptCatalogOptions = {},
): SdkworkPromptAsset[] {
  const query = normalizeQuery(options.query);
  const kinds = options.kinds ? new Set(options.kinds) : null;
  const visibility = options.visibility ? new Set(options.visibility) : null;
  const tags = options.tags ?? [];
  const labels = options.labels ?? [];

  return sortPromptCatalog(assets, options.sort).filter((asset) => {
    if (kinds && !kinds.has(asset.kind)) {
      return false;
    }

    if (visibility && !visibility.has(asset.visibility)) {
      return false;
    }

    if (tags.length > 0 && !tags.every((tag) => asset.tags.includes(tag))) {
      return false;
    }

    if (labels.length > 0 && !matchesLabels(asset, labels)) {
      return false;
    }

    if (!query) {
      return true;
    }

    return promptSearchValues(asset).some((value) => value.toLowerCase().includes(query));
  });
}

export function resolvePromptVersion(
  asset: SdkworkPromptAsset,
  options: ResolvePromptVersionOptions = {},
): SdkworkPromptVersion {
  const sortedVersions = sortPromptVersions(asset.versions);
  if (sortedVersions.length === 0) {
    throw new Error(`Prompt ${asset.id} does not include any versions.`);
  }

  if (options.version !== undefined) {
    const version = sortedVersions.find((entry) => entry.version === options.version);
    if (!version) {
      throw new Error(`Prompt ${asset.id} does not include version ${options.version}.`);
    }

    return version;
  }

  if (options.label) {
    const label = options.label;
    const labeledVersion = sortedVersions.find((entry) => entry.labels?.includes(label));
    if (!labeledVersion) {
      throw new Error(`Prompt ${asset.id} does not include label ${label}.`);
    }

    return labeledVersion;
  }

  return sortedVersions.find((entry) => entry.status === "published") ?? sortedVersions[0]!;
}

export function extractPromptVariableTokens(template: string): string[] {
  const matches = template.matchAll(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g);
  const tokens = new Set<string>();

  for (const match of matches) {
    tokens.add(match[1]!);
  }

  return [...tokens];
}

export function renderPromptTemplate(
  template: string,
  values: Record<string, SdkworkPromptVariableValue> = {},
  variableDefinitions: readonly SdkworkPromptVariableDefinition[] = [],
  options: RenderPromptTemplateOptions = {},
): SdkworkRenderedPromptTemplate {
  const definitionMap = new Map(variableDefinitions.map((definition) => [definition.id, definition]));
  const missingVariables = new Set<string>();
  const usedVariables = extractPromptVariableTokens(template);
  const strategy = options.missingValueStrategy ?? "preserve-token";

  const output = template.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (fullMatch, rawToken: string) => {
    const token = rawToken.trim();
    const definition = definitionMap.get(token);
    const explicitValue = values[token];
    const candidateValue = hasRenderableValue(explicitValue)
      ? explicitValue
      : hasRenderableValue(definition?.defaultValue)
        ? definition?.defaultValue
        : undefined;

    if (candidateValue !== undefined) {
      return normalizePromptValue(candidateValue);
    }

    if (!definition || definition.required) {
      missingVariables.add(token);
      return strategy === "empty" ? "" : fullMatch;
    }

    return "";
  });

  return {
    missingVariables: [...missingVariables],
    output,
    ready: missingVariables.size === 0,
    usedVariables,
  };
}

export function compilePromptAsset(
  asset: SdkworkPromptAsset,
  options: CompilePromptAssetOptions = {},
): SdkworkCompiledPromptAsset {
  const version = resolvePromptVersion(asset, options);
  const missingVariables = new Set<string>();
  const usedVariables = new Set<string>();
  const messages: SdkworkLlmMessage[] = [];

  for (const messageTemplate of version.messages) {
    const rendered = renderPromptTemplate(
      messageTemplate.template,
      options.values,
      asset.variables,
    );

    rendered.missingVariables.forEach((variableId) => missingVariables.add(variableId));
    rendered.usedVariables.forEach((variableId) => usedVariables.add(variableId));

    if (rendered.output.trim().length === 0) {
      continue;
    }

    messages.push({
      parts: [
        {
          text: rendered.output,
          type: "text",
        },
      ],
      role: messageTemplate.role,
    });
  }

  return {
    assetId: asset.id,
    ...(options.label ? { label: options.label } : {}),
    messages,
    missingVariables: [...missingVariables],
    ready: missingVariables.size === 0,
    usedVariables: [...usedVariables],
    version: version.version,
    versionId: version.id,
  };
}

export function compilePromptBundle(
  bundle: SdkworkPromptBundle,
  assets: readonly SdkworkPromptAsset[],
  options: CompilePromptBundleOptions = {},
): SdkworkCompiledPromptBundle {
  const assetMap = new Map(assets.map((asset) => [asset.id, asset]));
  const entries: SdkworkCompiledPromptBundleEntry[] = [];
  const messages: SdkworkLlmMessage[] = [];
  const missingVariables: SdkworkPromptBundleMissingVariable[] = [];

  for (const entry of bundle.entries) {
    const asset = assetMap.get(entry.assetId);
    if (!asset) {
      throw new Error(`Prompt bundle ${bundle.id} references unknown asset ${entry.assetId}.`);
    }

    const compiled = compilePromptAsset(asset, {
      label: entry.label,
      values: options.values?.[entry.assetId],
      version: entry.version,
    });

    entries.push({
      compiled,
      slot: entry.slot,
    });
    messages.push(...compiled.messages);
    missingVariables.push(
      ...compiled.missingVariables.map((variableId) => ({
        assetId: entry.assetId,
        variableId,
      })),
    );
  }

  return {
    bundleId: bundle.id,
    entries,
    messages,
    missingVariables,
    ready: missingVariables.length === 0,
  };
}

export function createPromptAssetDigest(
  asset: SdkworkPromptAsset,
): SdkworkPromptAssetDigest {
  const sortedVersions = sortPromptVersions(asset.versions);
  const defaultVersion = sortedVersions.find((version) => version.status === "published") ?? sortedVersions[0];
  const latestVersion = sortedVersions[0];
  const publishedVersion = sortedVersions.find((version) => version.status === "published");

  return {
    ...(defaultVersion
      ? {
          defaultVersion: defaultVersion.version,
          defaultVersionId: defaultVersion.id,
          defaultVersionStatus: defaultVersion.status,
        }
      : {}),
    id: asset.id,
    kind: asset.kind,
    labels: toUniquePromptLabels(asset.versions.flatMap((version) => version.labels ?? [])),
    ...(latestVersion
      ? {
          latestVersion: latestVersion.version,
          latestVersionStatus: latestVersion.status,
        }
      : {}),
    name: asset.name,
    optionalVariableCount: asset.variables.filter((variable) => !variable.required).length,
    ...(publishedVersion
      ? {
          publishedVersion: publishedVersion.version,
          publishedVersionId: publishedVersion.id,
        }
      : {}),
    requiredVariableCount: asset.variables.filter((variable) => variable.required).length,
    tagCount: asset.tags.length,
    updatedAt: latestTimestamp(asset),
    usageCount: asset.usageCount ?? 0,
    variableCount: asset.variables.length,
    versionCount: asset.versions.length,
    visibility: asset.visibility,
  };
}

export function summarizePromptAssetDigests(
  digests: readonly SdkworkPromptAssetDigest[],
): SdkworkPromptAssetDigestSummary {
  const kindCounts = createPromptKindCounts();
  const labelSet = new Set<string>();
  let archivedDefaultAssets = 0;
  let draftDefaultAssets = 0;
  let latestUpdatedAt = 0;
  let privateAssets = 0;
  let publicAssets = 0;
  let publishedDefaultAssets = 0;
  let sharedAssets = 0;
  let totalRequiredVariables = 0;
  let totalUsageCount = 0;
  let totalVersions = 0;

  for (const digest of digests) {
    kindCounts[digest.kind] += 1;
    digest.labels.forEach((label) => labelSet.add(label));
    latestUpdatedAt = Math.max(latestUpdatedAt, digest.updatedAt);
    totalRequiredVariables += digest.requiredVariableCount;
    totalUsageCount += digest.usageCount;
    totalVersions += digest.versionCount;

    switch (digest.visibility) {
      case "private":
        privateAssets += 1;
        break;
      case "public":
        publicAssets += 1;
        break;
      case "shared":
        sharedAssets += 1;
        break;
      default:
        break;
    }

    switch (digest.defaultVersionStatus) {
      case "archived":
        archivedDefaultAssets += 1;
        break;
      case "draft":
        draftDefaultAssets += 1;
        break;
      case "published":
        publishedDefaultAssets += 1;
        break;
      default:
        break;
    }
  }

  return {
    archivedDefaultAssets,
    assetCount: digests.length,
    draftDefaultAssets,
    kindCounts,
    latestUpdatedAt,
    privateAssets,
    publicAssets,
    publishedDefaultAssets,
    sharedAssets,
    totalRequiredVariables,
    totalUsageCount,
    totalVersions,
    uniqueLabelCount: labelSet.size,
  };
}

export function evaluatePromptExecutionReadiness(
  asset: SdkworkPromptAsset,
  options: EvaluatePromptExecutionReadinessOptions = {},
): SdkworkPromptExecutionReadiness {
  let version: SdkworkPromptVersion;

  try {
    version = resolvePromptVersion(asset, options);
  } catch {
    return {
      assetId: asset.id,
      degraded: false,
      issues: ["no-version"],
      ready: false,
    };
  }

  const compiled = compilePromptAsset(asset, options);
  const issues = toUniquePromptExecutionIssues([
    ...(version.status === "draft" ? ["draft-version" as const] : []),
    ...(version.status === "archived" ? ["archived-version" as const] : []),
    ...(compiled.missingVariables.length > 0 ? ["missing-variables" as const] : []),
    ...(compiled.messages.length === 0 ? ["empty-messages" as const] : []),
  ]);

  return {
    assetId: asset.id,
    compiled,
    degraded: version.status === "draft" || version.status === "archived",
    issues,
    ready: !issues.some((issue) => issue === "missing-variables" || issue === "empty-messages"),
    status: version.status,
    version: version.version,
    versionId: version.id,
  };
}

export function evaluatePromptBundleExecutionReadiness(
  bundle: SdkworkPromptBundle,
  assets: readonly SdkworkPromptAsset[],
  options: EvaluatePromptBundleExecutionReadinessOptions = {},
): SdkworkPromptBundleExecutionReadiness {
  const assetMap = new Map(assets.map((asset) => [asset.id, asset] as const));
  const compiledEntries: SdkworkCompiledPromptBundleEntry[] = [];
  const entries: SdkworkPromptBundleEntryExecutionReadiness[] = [];
  const messages: SdkworkLlmMessage[] = [];
  const missingVariables: SdkworkPromptBundleMissingVariable[] = [];

  for (const entry of bundle.entries) {
    const asset = assetMap.get(entry.assetId);
    if (!asset) {
      entries.push({
        assetId: entry.assetId,
        degraded: false,
        issues: ["missing-asset"],
        ready: false,
        slot: entry.slot,
      });
      continue;
    }

    const readiness = evaluatePromptExecutionReadiness(asset, {
      label: entry.label,
      values: options.values?.[entry.assetId],
      version: entry.version,
    });

    entries.push({
      ...readiness,
      slot: entry.slot,
    });

    if (!readiness.compiled) {
      continue;
    }

    compiledEntries.push({
      compiled: readiness.compiled,
      slot: entry.slot,
    });
    messages.push(...readiness.compiled.messages);
    missingVariables.push(
      ...readiness.compiled.missingVariables.map((variableId) => ({
        assetId: entry.assetId,
        variableId,
      })),
    );
  }

  const issues = toUniquePromptExecutionIssues(entries.flatMap((entry) => entry.issues));
  const ready = entries.length > 0 && entries.every((entry) => entry.ready);
  const bundleSummary: SdkworkCompiledPromptBundle = {
    bundleId: bundle.id,
    entries: compiledEntries,
    messages,
    missingVariables,
    ready,
  };

  return {
    bundle: bundleSummary,
    bundleId: bundle.id,
    degraded: entries.some((entry) => entry.degraded),
    entries,
    issues: messages.length === 0 && !issues.includes("empty-messages")
      ? [...issues, "empty-messages"]
      : issues,
    ready,
  };
}

export function createPromptWorkspaceManifest({
  description = "Prompt workspace for versioned assets, runtime labels, and reusable prompt bundles.",
  host,
  id = "sdkwork-prompt",
  packageNames = ["@sdkwork/prompt-pc-react", "@sdkwork/llm-pc-react"],
  routePath = "/prompts",
  theme,
  title = "Prompts",
}: CreatePromptWorkspaceManifestOptions = {}): SdkworkPromptWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "prompt",
    detailRoutePattern: `${routePath}/:promptId`,
    editorRoutePattern: `${routePath}/:promptId/versions/:version`,
    routePath,
  };
}

export function createPromptLibraryRouteIntent(
  options: CreatePromptLibraryRouteIntentOptions = {},
): SdkworkPromptLibraryRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.kind) {
    queryParams.set("kind", options.kind);
  }

  if (options.label) {
    queryParams.set("label", options.label);
  }

  if (options.tag) {
    queryParams.set("tag", options.tag);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.kind ? { kind: options.kind } : {}),
    ...(options.label ? { label: options.label } : {}),
    route: `${options.basePath ?? "/prompts"}${querySuffix}`,
    source: "prompt-library",
    ...(options.tag ? { tag: options.tag } : {}),
    type: "prompt-library-route-intent",
  };
}

export function createPromptDetailRouteIntent(
  promptId: string,
  options: CreatePromptDetailRouteIntentOptions = {},
): SdkworkPromptDetailRouteIntent {
  const detailRoute = options.version
    ? `${options.basePath ?? "/prompts"}/${promptId}/versions/${options.version}`
    : `${options.basePath ?? "/prompts"}/${promptId}${
        options.label ? `?label=${encodeURIComponent(options.label)}` : ""
      }`;

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.label ? { label: options.label } : {}),
    promptId,
    route: detailRoute,
    source: "prompt-library",
    type: "prompt-detail-route-intent",
    ...(options.version !== undefined ? { version: options.version } : {}),
  };
}

export const promptPackageMeta = {
  architecture: "pc-react",
  domain: "intelligence",
  package: "@sdkwork/prompt-pc-react",
  status: "ready",
} as const;

export type PromptPackageMeta = typeof promptPackageMeta;
