import {
  readMediaResource,
  readMediaResourceUrl,
  toExternalUrlMediaResource,
  type ClawRouterMediaResource,
} from 'sdkwork-claw-router-commons/runtime';

export type PlatformType = 'Desktop' | 'Mobile' | 'Web' | 'Mini Program';
export type OS =
  | 'Windows'
  | 'macOS'
  | 'Linux'
  | 'iOS'
  | 'Android'
  | 'HarmonyOS'
  | 'PC Web'
  | 'Mobile Web'
  | 'WeChat'
  | 'Alipay'
  | 'ByteDance'
  | 'Baidu'
  | 'QuickApp';

export type AppRelease = {
  id: string;
  platformType: PlatformType;
  os: OS;
  version: string;
  size: string;
  releaseDate: string;
  artifact?: ClawRouterMediaResource;
  whatsNew?: string;
};

export type App = {
  id: string;
  name: string;
  developer: string;
  category: string;
  image: ClawRouterMediaResource;
  rating: number;
  description: string;
  downloads: string;
  screenshots: ClawRouterMediaResource[];
  features: string[];
  releases: AppRelease[];
};

export type ApiRecord = Record<string, unknown>;

export type AppSortKey = 'Most Popular' | 'Highest Rated' | 'Newest';

export type AppCatalogFilters = {
  searchQuery: string;
  platformTypes: PlatformType[];
  categories: string[];
  sortBy: AppSortKey;
};

export type AppCategoryOption = {
  id: string;
  label: string;
  count: number;
};

export type AppPlatformOption = {
  id: PlatformType;
  label: string;
  count: number;
};

export type AppCatalogCardView = {
  id: string;
  name: string;
  developer: string;
  descriptionPreview: string;
  category: string;
  image: ClawRouterMediaResource;
  ratingLabel: string;
  downloadsLabel: string;
  displayOSes: OS[];
  extraOSCount: number;
  releases: AppRelease[];
};

export type AppCatalogViewModel = {
  categoryOptions: AppCategoryOption[];
  platformOptions: AppPlatformOption[];
  sortOptions: AppSortKey[];
  appCards: AppCatalogCardView[];
  resultCount: number;
  emptyStateVisible: boolean;
};

export type AppDetailViewModel = {
  app: App;
  selectedRelease: AppRelease;
  availablePlatformReleases: AppRelease[];
  releaseDateLabel: string;
  canDownload: boolean;
};

const DEFAULT_APP_IMAGE = toExternalUrlMediaResource('https://picsum.photos/seed/app-center/800/600', 'image')!;
const SORT_OPTIONS: AppSortKey[] = ['Most Popular', 'Highest Rated', 'Newest'];
const PLATFORM_OPTIONS: { id: PlatformType; label: string }[] = [
  { id: 'Desktop', label: 'Desktop' },
  { id: 'Mobile', label: 'Mobile' },
  { id: 'Web', label: 'Web' },
  { id: 'Mini Program', label: 'Mini Program' },
];
const PLATFORM_TYPES: PlatformType[] = PLATFORM_OPTIONS.map((platform) => platform.id);
const OPERATING_SYSTEMS: OS[] = [
  'Windows',
  'macOS',
  'Linux',
  'iOS',
  'Android',
  'HarmonyOS',
  'PC Web',
  'Mobile Web',
  'WeChat',
  'Alipay',
  'ByteDance',
  'Baidu',
  'QuickApp',
];

export function normalizeAppApiRecord(value: unknown): App {
  const item = readRequiredRecord(value, 'App record is required');
  const assets = readRequiredRecordArray(item, 'assets', 'App asset record is required').length > 0
    ? readRequiredRecordArray(item, 'assets', 'App asset record is required')
    : readRequiredRecordArray(item, 'resourceList', 'App resource record is required');
  const artifacts = readRequiredRecordArray(item, 'releases', 'App release record is required').length > 0
    ? readRequiredRecordArray(item, 'releases', 'App release record is required')
    : readRequiredRecordArray(item, 'artifacts', 'App release record is required');
  const ratingCount = readNumber(item, 'ratingCount') || readNumber(item, 'rating_count');
  const installCount = readNumber(item, 'installCount') || readNumber(item, 'install_count') || readNumber(item, 'downloads');
  const screenshots = readMediaResourceArray(item, 'screenshots');

  return {
    id: readRequiredFirstString(item, ['id', 'appId', 'app_id', 'code'], 'App id is required'),
    name: readRequiredFirstString(item, ['name'], 'App name is required'),
    developer: readRequiredFirstString(item, ['developer', 'provider', 'publisher'], 'App developer is required'),
    category: normalizeWhitespace(readString(item, 'category') || readString(item, 'categoryName') || readString(item, 'category_name')) || 'Uncategorized',
    image: readMediaResource(item.image) || firstAssetResource(assets, ['cover', 'icon']) || DEFAULT_APP_IMAGE,
    rating: readNumber(item, 'rating') || readNumber(item, 'ratingAvg') || readNumber(item, 'rating_avg') || readNumber(item, 'ratingScore') || ratingCount,
    description: normalizeWhitespace(readString(item, 'description')),
    downloads: normalizeWhitespace(readString(item, 'downloads')) || formatAppCount(installCount),
    screenshots: screenshots.length > 0 ? screenshots : collectAssetResources(assets, ['screenshot']),
    features: normalizeAppStrings(readStringArray(item, 'features').length > 0
      ? readStringArray(item, 'features')
      : readStringArray(item, 'resource_list').length > 0
        ? readStringArray(item, 'resource_list')
        : readStringArray(item, 'resourceList')),
    releases: artifacts.map(normalizeAppReleaseApiRecord),
  };
}

export function normalizeAppReleaseApiRecord(value: unknown): AppRelease {
  const item = readRequiredRecord(value, 'App release record is required');
  const platformType = readPlatformType(item);
  const os = readOperatingSystem(item, platformType);
  const id = normalizeWhitespace(readString(item, 'id') || readString(item, 'artifactId') || readString(item, 'artifact_id') || `${platformType}-${os}`);
  const sizeBytes = readNumber(item, 'artifactSizeBytes') || readNumber(item, 'artifact_size_bytes') || readNumber(item, 'sizeBytes');
  const artifact = readMediaResource(item.artifact)
    || readMediaResource(item.resource)
    || readMediaResource(item.artifactResourceSnapshot)
    || readMediaResource(item.artifact_resource_snapshot);

  return {
    id,
    platformType,
    os,
    version: normalizeWhitespace(readString(item, 'version')) || 'Latest',
    size: normalizeWhitespace(readString(item, 'size')) || formatAppSize(sizeBytes),
    releaseDate: normalizeAppDate(readString(item, 'releaseDate') || readString(item, 'publishedAt') || readString(item, 'published_at')),
    artifact,
    whatsNew: normalizeWhitespace(readString(item, 'whatsNew') || readString(item, 'releaseNotes') || readString(item, 'release_notes')),
  };
}

export function filterAppsForCatalog(
  apps: readonly App[],
  filters: AppCatalogFilters,
): App[] {
  const normalizedSearch = normalizeSearchText(filters.searchQuery);
  const normalizedCategories = new Set(filters.categories.map(normalizeSearchText).filter(Boolean));
  const platformTypes = new Set(filters.platformTypes);
  const filtered = apps.filter((app) => {
    const searchableText = normalizeSearchText([
      app.name,
      app.description,
      app.developer,
      app.category,
      ...app.features,
      ...app.releases.map((release) => `${release.platformType} ${release.os}`),
    ].join(' '));
    const matchesSearch = normalizedSearch === '' || searchableText.includes(normalizedSearch);
    const matchesCategory = normalizedCategories.size === 0 || normalizedCategories.has(normalizeSearchText(app.category));
    const matchesPlatform = platformTypes.size === 0 || app.releases.some((release) => platformTypes.has(release.platformType));
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  return sortAppsForCatalog(filtered, filters.sortBy);
}

export function deriveAppCatalogViewModel({
  apps,
  categories,
  filters,
}: {
  apps: readonly App[];
  categories: readonly string[];
  filters: AppCatalogFilters;
}): AppCatalogViewModel {
  const appCards = filterAppsForCatalog(apps, filters).map(deriveAppCatalogCardView);

  return {
    categoryOptions: deriveAppCategoryOptions(apps, categories),
    platformOptions: deriveAppPlatformOptions(apps),
    sortOptions: [...SORT_OPTIONS],
    appCards,
    resultCount: appCards.length,
    emptyStateVisible: appCards.length === 0,
  };
}

export function deriveAppDetailView(
  apps: readonly App[],
  appId: string | undefined,
  releaseId?: string | null,
): AppDetailViewModel | null {
  const app = apps.find((item) => item.id === appId);
  const selectedRelease = app?.releases.find((release) => release.id === releaseId) ?? app?.releases[0];
  if (!app || !selectedRelease) {
    return null;
  }

  return {
    app,
    selectedRelease,
    availablePlatformReleases: app.releases.filter((release) => release.id !== selectedRelease.id),
    releaseDateLabel: formatAppDateLabel(selectedRelease.releaseDate),
    canDownload: isReleaseDownloadable(selectedRelease),
  };
}

export function getReleaseDownloadHref(release: AppRelease | null | undefined): string {
  return readMediaResourceUrl(release?.artifact);
}

export function isReleaseDownloadable(release: AppRelease | null | undefined): boolean {
  const downloadHref = getReleaseDownloadHref(release);
  return downloadHref.length > 0 && downloadHref !== '#';
}

export function formatAppDateLabel(value: string): string {
  const normalized = normalizeAppDate(value);
  return normalized || 'Unpublished';
}

export function normalizeAppDate(value: string): string {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) {
    return match[1];
  }
  return trimmed;
}

export function formatAppCount(value: number): string {
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

function deriveAppCatalogCardView(app: App): AppCatalogCardView {
  const uniqueOSes = unique(app.releases.map((release) => release.os));
  const displayOSes = uniqueOSes.slice(0, 3);

  return {
    id: app.id,
    name: app.name,
    developer: app.developer,
    descriptionPreview: firstDescriptionLine(app.description),
    category: app.category,
    image: app.image,
    ratingLabel: app.rating.toFixed(1),
    downloadsLabel: app.downloads,
    displayOSes,
    extraOSCount: Math.max(0, uniqueOSes.length - displayOSes.length),
    releases: app.releases,
  };
}

function deriveAppCategoryOptions(apps: readonly App[], categories: readonly string[]): AppCategoryOption[] {
  const uniqueCategories = unique(categories.map(normalizeWhitespace).filter(Boolean))
    .sort((left, right) => left.localeCompare(right));

  return [
    {
      id: 'All',
      label: 'All Categories',
      count: apps.length,
    },
    ...uniqueCategories.map((category) => ({
      id: category,
      label: category,
      count: apps.filter((app) => normalizeSearchText(app.category) === normalizeSearchText(category)).length,
    })),
  ];
}

function deriveAppPlatformOptions(apps: readonly App[]): AppPlatformOption[] {
  return PLATFORM_OPTIONS.map((platform) => ({
    ...platform,
    count: apps.filter((app) => app.releases.some((release) => release.platformType === platform.id)).length,
  }));
}

function sortAppsForCatalog(apps: readonly App[], sortBy: AppSortKey): App[] {
  const sorted = [...apps];
  if (sortBy === 'Highest Rated') {
    return sorted.sort((left, right) => right.rating - left.rating || left.name.localeCompare(right.name));
  }
  if (sortBy === 'Newest') {
    return sorted.sort((left, right) => latestReleaseDate(right).localeCompare(latestReleaseDate(left)) || left.name.localeCompare(right.name));
  }
  return sorted.sort((left, right) => parseCount(right.downloads) - parseCount(left.downloads) || left.name.localeCompare(right.name));
}

function latestReleaseDate(app: App): string {
  return app.releases.map((release) => release.releaseDate).sort((left, right) => right.localeCompare(left))[0] ?? '';
}

function readPlatformType(item: ApiRecord): PlatformType {
  const platformType = normalizeWhitespace(readString(item, 'platformType') || readString(item, 'platform_type'));
  if (PLATFORM_TYPES.includes(platformType as PlatformType)) {
    return platformType as PlatformType;
  }
  throw new Error(platformType ? `Unsupported app platform type: ${platformType}` : 'App platform type is required');
}

function readOperatingSystem(item: ApiRecord, platformType: PlatformType): OS {
  const os = normalizeWhitespace(readString(item, 'os') || readString(item, 'osName') || readString(item, 'os_name'));
  if (OPERATING_SYSTEMS.includes(os as OS)) {
    return os as OS;
  }
  throw new Error(os ? `Unsupported app operating system: ${os}` : `App operating system is required for ${platformType}`);
}

function collectAssetResources(assets: readonly ApiRecord[], acceptedTypes: readonly string[]): ClawRouterMediaResource[] {
  return assets
    .filter((asset) => acceptedTypes.includes(normalizeSearchText(readString(asset, 'assetType') || readString(asset, 'asset_type') || readString(asset, 'type'))))
    .map((asset) => readMediaResource(asset.asset) || readMediaResource(asset.resource) || readMediaResource(asset.assetResourceSnapshot))
    .filter((value): value is ClawRouterMediaResource => value !== undefined);
}

function firstAssetResource(assets: readonly ApiRecord[], acceptedTypes: readonly string[]): ClawRouterMediaResource | undefined {
  return collectAssetResources(assets, acceptedTypes)[0];
}

function firstDescriptionLine(value: string): string {
  return value.split('\n').map((line) => line.trim()).find(Boolean) ?? '';
}

function parseCount(value: string): number {
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

function formatAppSize(bytes: number): string {
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

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function normalizeAppStrings(values: readonly string[]): string[] {
  return values.map(normalizeWhitespace).filter(Boolean);
}

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizeSearchText(value: string): string {
  return normalizeWhitespace(value).toLowerCase();
}

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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

function readMediaResourceArray(record: ApiRecord | undefined, key: string): ClawRouterMediaResource[] {
  const value = record?.[key];
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map(readMediaResource)
    .filter((item): item is ClawRouterMediaResource => item !== undefined);
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readRequiredRecordArray(record: ApiRecord, key: string, itemMessage: string): ApiRecord[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => readRequiredRecord(item, itemMessage));
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
