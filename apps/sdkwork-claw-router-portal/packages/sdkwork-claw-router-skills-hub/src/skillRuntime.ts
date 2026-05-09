export type Skill = {
  id: string;
  name: string;
  developer: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  downloads: string;
  features: string[];
  lastUpdated: string;
  clawhubImage: string;
  version: string;
  size: string;
  license: string;
  frameworks: string[];
  screenshots: string[];
  packages?: SkillPackage[];
};

export type ApiRecord = Record<string, unknown>;

export type SkillPackage = {
  id: string;
  version: string;
  artifactRef: string;
  artifactSizeBytes: number;
  frameworks: string[];
  licenseName: string;
  publishedAt: string;
};

export type InstalledSkill = {
  id: string;
  skillId: string;
  enabled: boolean;
  config: Record<string, unknown>;
  installedAt: string;
  lastEnabledAt: string;
  skill: Skill;
};

export type SkillSortKey = 'Most Popular' | 'Highest Rated' | 'Newest';
export type SkillPackageManager = 'agent' | 'npm' | 'pnpm' | 'bun';
export type SkillRegistry = 'default' | 'china';

export type SkillCatalogFilters = {
  searchQuery: string;
  categories: string[];
  sortBy: SkillSortKey;
};

export type SkillCategoryOption = {
  id: string;
  label: string;
  count: number;
};

export type SkillCatalogCardView = {
  id: string;
  name: string;
  developer: string;
  descriptionPreview: string;
  category: string;
  ratingLabel: string;
  downloadsLabel: string;
  license: string;
  installed: boolean;
  enabled: boolean;
  installationLabel: string;
};

export type SkillCatalogViewModel = {
  categoryOptions: SkillCategoryOption[];
  sortOptions: SkillSortKey[];
  skillCards: SkillCatalogCardView[];
  resultCount: number;
  emptyStateVisible: boolean;
};

export type SkillDetailViewModel = {
  skill: Skill;
  lastUpdatedLabel: string;
  packageName: string;
  registryOptions: {
    defaultUrl: string;
    chinaUrl: string;
  };
};

export type SkillInstallationAction = 'enable' | 'disable';

export type SkillInstallationState = {
  installed: boolean;
  enabled: boolean;
  action: SkillInstallationAction;
  label: string;
};

export type SkillInstallCommandInput = {
  packageName: string;
  packageManager: SkillPackageManager;
  registry: SkillRegistry;
};

const DEFAULT_SKILL_IMAGE = 'https://picsum.photos/seed/skill/800/600';
const DEFAULT_REGISTRY_URL = 'https://registry.clawhub.io';
const CHINA_REGISTRY_URL = 'https://cn.clawhub-mirror.com';
const SORT_OPTIONS: SkillSortKey[] = ['Most Popular', 'Highest Rated', 'Newest'];
const MAX_SKILL_CONFIG_BYTES = 64 * 1024;
const MAX_SKILL_CONFIG_KEY_LENGTH = 128;
const MAX_SKILL_CONFIG_DEPTH = 8;
const MAX_SKILL_CONFIG_ARRAY_LENGTH = 256;
const MAX_SKILL_CONFIG_STRING_LENGTH = 4096;

export function normalizeSkillApiRecord(value: unknown): Skill {
  const item = readRequiredRecord(value, 'Skill record is required');
  const id = readRequiredFirstString(item, ['id', 'skillId', 'skillKey'], 'Skill id is required');
  const name = readRequiredFirstString(item, ['name'], 'Skill name is required');
  const developer = readRequiredFirstString(item, ['developer', 'provider'], 'Skill developer is required');
  const category = normalizeWhitespace(readString(item, 'category') || readString(item, 'categoryName')) || 'Uncategorized';
  const installCount = readNumber(item, 'installCount') || readNumber(item, 'downloads');
  const artifactSizeBytes = readNumber(item, 'artifactSizeBytes') || readNumber(item, 'sizeBytes');
  const artifact = firstRecord(item, 'packages') ?? firstRecord(item, 'artifacts');

  return {
    id,
    name,
    developer,
    description: normalizeWhitespace(readString(item, 'description')),
    category,
    image: readString(item, 'image') || readString(item, 'coverImage') || readString(item, 'cover_image') || DEFAULT_SKILL_IMAGE,
    rating: readNumber(item, 'rating') || readNumber(item, 'ratingAvg') || readNumber(item, 'rating_avg'),
    downloads: normalizeWhitespace(readString(item, 'downloads')) || formatSkillCount(installCount),
    features: normalizeSkillStrings(readStringArray(item, 'features').length > 0 ? readStringArray(item, 'features') : readStringArray(item, 'capabilities')),
    lastUpdated: normalizeSkillDate(
      readString(item, 'lastUpdated')
        || readString(item, 'latestPublishedAt')
        || readString(item, 'latest_published_at')
        || readString(artifact, 'publishedAt')
        || readString(artifact, 'published_at'),
    ),
    clawhubImage: readString(item, 'clawhubImage') || readString(item, 'artifactRef') || readString(item, 'artifact_ref') || readString(artifact, 'artifactRef') || readString(artifact, 'artifact_ref'),
    version: readString(item, 'version') || readString(artifact, 'version'),
    size: normalizeWhitespace(readString(item, 'size')) || formatSkillSize(artifactSizeBytes || readNumber(artifact, 'artifactSizeBytes') || readNumber(artifact, 'artifact_size_bytes')),
    license: normalizeWhitespace(readString(item, 'license') || readString(item, 'licenseName') || readString(item, 'license_name') || readString(artifact, 'licenseName') || readString(artifact, 'license_name')) || 'Proprietary',
    frameworks: normalizeSkillStrings(readStringArray(item, 'frameworks').length > 0 ? readStringArray(item, 'frameworks') : readStringArray(artifact, 'frameworks')),
    screenshots: normalizeSkillStrings(readStringArray(item, 'screenshots')),
    packages: normalizeSkillPackages(item),
  };
}

export function normalizeInstalledSkillApiRecord(value: unknown): InstalledSkill {
  const item = readRequiredRecord(value, 'Installed skill record is required');
  const skillId = readRequiredFirstString(item, ['skillId', 'skill_id'], 'Installed skill id is required');
  const skill = normalizeSkillApiRecord(item.skill ?? item);
  const config = normalizePlainConfig(item.config);

  return {
    id: readRequiredFirstString(item, ['id'], 'Installed skill installation id is required'),
    skillId,
    enabled: readBoolean(item, 'enabled', true),
    config,
    installedAt: readString(item, 'installedAt') || readString(item, 'installed_at'),
    lastEnabledAt: readString(item, 'lastEnabledAt') || readString(item, 'last_enabled_at'),
    skill,
  };
}

export function normalizeSkillConfig(value: unknown): Record<string, unknown> {
  const config = normalizePlainConfig(value);
  rejectOversizedSkillConfigRequestBody(config);
  return config;
}

export function formatSkillConfigEditorValue(installedSkill: InstalledSkill | null | undefined): string {
  return JSON.stringify(installedSkill ? normalizeSkillConfig(installedSkill.config) : {}, null, 2);
}

export function parseSkillConfigEditorValue(value: string): Record<string, unknown> {
  if (value.trim() === '') {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error('skill config must be valid JSON');
  }
  return normalizeSkillConfig(parsed);
}

export function filterSkillsForCatalog(
  skills: readonly Skill[],
  filters: SkillCatalogFilters,
): Skill[] {
  const normalizedSearch = normalizeSearchText(filters.searchQuery);
  const normalizedCategories = new Set(filters.categories.map(normalizeSearchText).filter(Boolean));
  const filtered = skills.filter((skill) => {
    const searchableText = normalizeSearchText([
      skill.name,
      skill.description,
      skill.developer,
      skill.category,
      ...skill.features,
      ...skill.frameworks,
    ].join(' '));
    const matchesSearch = normalizedSearch === '' || searchableText.includes(normalizedSearch);
    const matchesCategory = normalizedCategories.size === 0 || normalizedCategories.has(normalizeSearchText(skill.category));
    return matchesSearch && matchesCategory;
  });

  return sortSkillsForCatalog(filtered, filters.sortBy);
}

export function deriveSkillCatalogViewModel({
  skills,
  categories,
  installedSkills = [],
  filters,
}: {
  skills: readonly Skill[];
  categories: readonly string[];
  installedSkills?: readonly InstalledSkill[];
  filters: SkillCatalogFilters;
}): SkillCatalogViewModel {
  const normalizedCategories = deriveSkillCategoryOptions(skills, categories);
  const skillCards = filterSkillsForCatalog(skills, filters).map((skill) =>
    deriveSkillCatalogCardView(skill, installedSkills),
  );

  return {
    categoryOptions: normalizedCategories,
    sortOptions: [...SORT_OPTIONS],
    skillCards,
    resultCount: skillCards.length,
    emptyStateVisible: skillCards.length === 0,
  };
}

export function deriveSkillDetailView(
  skills: readonly Skill[],
  skillId: string | undefined,
): SkillDetailViewModel | null {
  const skill = skills.find((item) => item.id === skillId);
  if (!skill) {
    return null;
  }

  return {
    skill,
    lastUpdatedLabel: formatSkillDateLabel(skill.lastUpdated),
    packageName: installTargetFromSkill(skill),
    registryOptions: {
      defaultUrl: DEFAULT_REGISTRY_URL,
      chinaUrl: CHINA_REGISTRY_URL,
    },
  };
}

export function deriveSkillInstallationState(
  skillId: string | undefined,
  installedSkills: readonly InstalledSkill[],
): SkillInstallationState {
  const installed = installedSkills.find((item) => item.skillId === skillId);
  if (!installed) {
    return {
      installed: false,
      enabled: false,
      action: 'enable',
      label: 'Not installed',
    };
  }

  if (!installed.enabled) {
    return {
      installed: true,
      enabled: false,
      action: 'enable',
      label: 'Installed',
    };
  }

  return {
    installed: true,
    enabled: true,
    action: 'disable',
    label: 'Enabled',
  };
}

export function buildSkillInstallCommand({
  packageName,
  packageManager,
  registry,
}: SkillInstallCommandInput): string {
  const safePackageName = normalizeInstallTarget(packageName);
  const registryUrl = registry === 'china' ? CHINA_REGISTRY_URL : DEFAULT_REGISTRY_URL;
  const registryFlag = registry === 'china' ? ` --registry=${CHINA_REGISTRY_URL}` : '';

  if (packageManager === 'agent') {
    return `Install ${safePackageName} from ${registryUrl} through the Agent skill installer.`;
  }
  if (packageManager === 'pnpm') {
    return `pnpm dlx clawhub@latest install ${safePackageName}${registryFlag}`;
  }
  if (packageManager === 'bun') {
    return `bunx clawhub@latest install ${safePackageName}${registryFlag}`;
  }
  return `npx clawhub@latest install ${safePackageName}${registryFlag}`;
}

export function formatSkillDateLabel(value: string): string {
  const normalized = normalizeSkillDate(value);
  return normalized || 'Unpublished';
}

export function normalizeSkillDate(value: string): string {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? '';
}

export function formatSkillCount(value: number): string {
  if (value >= 1_000_000_000) {
    return `${trimFixed(value / 1_000_000_000)}B`;
  }
  if (value >= 1_000_000) {
    return `${trimFixed(value / 1_000_000)}M`;
  }
  if (value >= 1_000) {
    return `${trimFixed(value / 1_000)}K`;
  }
  return String(Math.max(0, Math.round(value)));
}

function deriveSkillCategoryOptions(skills: readonly Skill[], categories: readonly string[]): SkillCategoryOption[] {
  const uniqueCategories = [...new Set(categories.map(normalizeWhitespace).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));

  return [
    {
      id: 'All',
      label: 'All Categories',
      count: skills.length,
    },
    ...uniqueCategories.map((category) => ({
      id: category,
      label: category,
      count: skills.filter((skill) => normalizeSearchText(skill.category) === normalizeSearchText(category)).length,
    })),
  ];
}

function deriveSkillCatalogCardView(skill: Skill, installedSkills: readonly InstalledSkill[]): SkillCatalogCardView {
  const installation = deriveSkillInstallationState(skill.id, installedSkills);
  return {
    id: skill.id,
    name: skill.name,
    developer: skill.developer,
    descriptionPreview: firstDescriptionLine(skill.description),
    category: skill.category,
    ratingLabel: skill.rating.toFixed(1),
    downloadsLabel: skill.downloads,
    license: skill.license,
    installed: installation.installed,
    enabled: installation.enabled,
    installationLabel: installation.label,
  };
}

function sortSkillsForCatalog(skills: readonly Skill[], sortBy: SkillSortKey): Skill[] {
  const sorted = [...skills];
  if (sortBy === 'Highest Rated') {
    return sorted.sort((left, right) => right.rating - left.rating || left.name.localeCompare(right.name));
  }
  if (sortBy === 'Newest') {
    return sorted.sort((left, right) => right.lastUpdated.localeCompare(left.lastUpdated) || left.name.localeCompare(right.name));
  }
  return sorted.sort((left, right) => parseDownloadCount(right.downloads) - parseDownloadCount(left.downloads) || left.name.localeCompare(right.name));
}

function installTargetFromSkill(skill: Skill): string {
  return normalizeInstallTarget(skill.packages?.[0]?.artifactRef || skill.clawhubImage || skill.name);
}

function normalizeInstallTarget(value: string): string {
  const trimmed = value.trim();
  if (/^[A-Za-z0-9._~:/@+-]+$/.test(trimmed)) {
    return trimmed;
  }
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || 'skill';
}

function firstDescriptionLine(value: string): string {
  return value.split('\n').map((line) => line.trim()).find(Boolean) ?? '';
}

function parseDownloadCount(value: string): number {
  const normalized = value.trim().toUpperCase().replace(/\+/g, '');
  const match = normalized.match(/^(\d+(?:\.\d+)?)([KMB])?$/);
  if (!match) {
    return 0;
  }
  const amount = Number(match[1]);
  const suffix = match[2];
  if (suffix === 'B') {
    return amount * 1_000_000_000;
  }
  if (suffix === 'M') {
    return amount * 1_000_000;
  }
  if (suffix === 'K') {
    return amount * 1_000;
  }
  return amount;
}

function formatSkillSize(bytes: number): string {
  if (bytes <= 0) {
    return '';
  }
  if (bytes >= 1024 * 1024 * 1024) {
    return `${trimFixed(bytes / (1024 * 1024 * 1024))} GB`;
  }
  if (bytes >= 1024 * 1024) {
    return `${trimFixed(bytes / (1024 * 1024))} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
}

function trimFixed(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}

function normalizeSkillPackages(record: ApiRecord): SkillPackage[] {
  return readRecordArray(record, 'packages').map((item) => ({
    id: normalizeWhitespace(readString(item, 'id')),
    version: normalizeWhitespace(readString(item, 'version')),
    artifactRef: normalizeWhitespace(readString(item, 'artifactRef') || readString(item, 'artifact_ref')),
    artifactSizeBytes: readNumber(item, 'artifactSizeBytes') || readNumber(item, 'artifact_size_bytes'),
    frameworks: normalizeSkillStrings(readStringArray(item, 'frameworks')),
    licenseName: normalizeWhitespace(readString(item, 'licenseName') || readString(item, 'license_name')),
    publishedAt: normalizeSkillDate(readString(item, 'publishedAt') || readString(item, 'published_at')),
  }));
}

function normalizeSkillStrings(values: readonly string[]): string[] {
  return values.map(normalizeWhitespace).filter(Boolean);
}

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizeSearchText(value: string): string {
  return normalizeWhitespace(value).toLowerCase();
}

function firstRecord(item: ApiRecord, key: string): ApiRecord | undefined {
  const records = readRecordArray(item, key);
  return records[0];
}

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readRequiredFirstString(record: ApiRecord, keys: readonly string[], message: string): string {
  for (const key of keys) {
    const normalized = normalizeWhitespace(readString(record, key));
    if (normalized) {
      return normalized;
    }
  }
  throw new Error(message);
}

function readString(record: ApiRecord | undefined, key: string, fallback = ''): string {
  const value = record?.[key];
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return fallback;
}

function readNumber(record: ApiRecord | undefined, key: string, fallback = 0): number {
  const value = record?.[key];
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function readBoolean(record: ApiRecord | undefined, key: string, fallback = false): boolean {
  const value = record?.[key];
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value !== 0;
  }
  return fallback;
}

function normalizePlainConfig(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error('config must be a plain object');
  }
  if (Object.prototype.hasOwnProperty.call(value, 'portal')) {
    throw new Error('config.portal is reserved portal metadata');
  }
  validateSkillConfigObject(value, 0);
  return cloneSkillConfigObject(value);
}

function rejectOversizedSkillConfigRequestBody(config: Record<string, unknown>): void {
  if (encodedByteLength(JSON.stringify({ config })) > MAX_SKILL_CONFIG_BYTES) {
    throw new Error(`skill config request body must be at most ${MAX_SKILL_CONFIG_BYTES} bytes`);
  }
}

function validateSkillConfigObject(record: ApiRecord, depth: number): void {
  if (depth > MAX_SKILL_CONFIG_DEPTH) {
    throw new Error(`config nesting depth must be at most ${MAX_SKILL_CONFIG_DEPTH}`);
  }

  for (const [key, value] of Object.entries(record)) {
    if (key.trim() === '' || unicodeScalarLength(key) > MAX_SKILL_CONFIG_KEY_LENGTH) {
      throw new Error(`config keys must be non-empty and at most ${MAX_SKILL_CONFIG_KEY_LENGTH} characters`);
    }
    if (containsControlCharacter(key)) {
      throw new Error('config keys must not contain control characters');
    }
    validateSkillConfigValue(value, depth);
  }
}

function validateSkillConfigValue(value: unknown, depth: number): void {
  if (isRecord(value)) {
    validateSkillConfigObject(value, depth + 1);
    return;
  }
  if (Array.isArray(value)) {
    if (value.length > MAX_SKILL_CONFIG_ARRAY_LENGTH) {
      throw new Error(`config arrays must contain at most ${MAX_SKILL_CONFIG_ARRAY_LENGTH} items`);
    }
    value.forEach((item) => validateSkillConfigValue(item, depth + 1));
    return;
  }
  if (typeof value === 'string' && unicodeScalarLength(value) > MAX_SKILL_CONFIG_STRING_LENGTH) {
    throw new Error(`config string values must be at most ${MAX_SKILL_CONFIG_STRING_LENGTH} characters`);
  }
}

function cloneSkillConfigObject(record: ApiRecord): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, cloneSkillConfigValue(value)]),
  );
}

function cloneSkillConfigValue(value: unknown): unknown {
  if (isRecord(value)) {
    return cloneSkillConfigObject(value);
  }
  if (Array.isArray(value)) {
    return value.map(cloneSkillConfigValue);
  }
  return value;
}

function containsControlCharacter(value: string): boolean {
  return value.split('').some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127);
}

function unicodeScalarLength(value: string): number {
  return Array.from(value).length;
}

function encodedByteLength(value: string): number {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(value).length;
  }
  return value.length;
}

function readStringArray(record: ApiRecord | undefined, key: string, fallback: string[] = []): string[] {
  const value = record?.[key];
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  const items = value
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }
      if (typeof item === 'number' || typeof item === 'boolean') {
        return String(item);
      }
      return null;
    })
    .filter((item): item is string => item !== null);
  return items.length > 0 ? items : [...fallback];
}

function readRecordArray(record: ApiRecord, key: string): ApiRecord[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => readRequiredRecord(item, 'Skill package record is required'));
}
