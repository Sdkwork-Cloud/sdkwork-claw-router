import type {
  AppInstalledSkillResponse as SdkAppInstalledSkillResponse,
  AppInstalledSkillsResponse as SdkAppInstalledSkillsResponse,
  AppSkillConfigRequest as SdkAppSkillConfigRequest,
  SkillCategoriesResponse as SdkSkillCategoriesResponse,
  SkillDetailResponse as SdkSkillDetailResponse,
  SkillsCatalogResponse as SdkSkillsCatalogResponse,
} from '@sdkwork/clawrouter-app-sdk';
import {
  createRequestToken,
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  optionalBoundedPositiveInteger,
  optionalPositiveInteger,
  optionalText,
  pruneUndefinedQueryParams,
  standardListQueryArguments,
  readApiData,
  readRequiredApiItem,
  readRequiredApiItems,
  readString,
  requiredSafePathSegment,
} from 'sdkwork-claw-router-commons/runtime';
import {
  filterSkillsForCatalog,
  normalizeInstalledSkillApiRecord,
  normalizeSkillConfig,
  normalizeSkillApiRecord,
  type InstalledSkill,
  type Skill,
  type SkillSortKey,
} from '../skillRuntime.ts';

const MAX_SKILL_CATALOG_PAGE_SIZE = 100;
const MAX_SKILL_CATALOG_QUERY_TEXT_LENGTH = 128;
const MAX_SKILL_CATALOG_STATUS_LENGTH = 64;
const MAX_SKILL_CATALOG_TIMESTAMP_LENGTH = 64;

interface SkillFilters {
  search?: string;
  categories?: string[];
  sortBy?: SkillSortKey;
}

type SkillCatalogQueryFilterInput = SkillFilters & {
  keyword?: unknown;
  pageNo?: unknown;
  pageSize?: unknown;
  status?: unknown;
  startTime?: unknown;
  endTime?: unknown;
};

export const skillService = {
  async getSkills(filters?: SkillFilters): Promise<Skill[]> {
    const result = await getClawRouterAppSdkClient().skill.getSkills(...skillCatalogQueryArguments(filters));
    ensurePlusApiSuccess(result, 'Failed to fetch skills');
    const items: SdkSkillsCatalogResponse['items'] = readRequiredApiItems(
      result,
      'Failed to fetch skills',
    ) as SdkSkillsCatalogResponse['items'];
    return filterSkillsForCatalog(
      items.map(normalizeSkillApiRecord),
      {
        searchQuery: filters?.search ?? '',
        categories: filters?.categories ?? [],
        sortBy: filters?.sortBy ?? 'Most Popular',
      },
    );
  },

  async getSkillById(id: string): Promise<Skill | undefined> {
    const result = await getClawRouterAppSdkClient().skill.getSkillById(requiredSafePathSegment(id, 'skillId'));
    if (result === null || result === undefined) {
      return undefined;
    }
    ensurePlusApiSuccess(result, 'Failed to fetch skill details');
    if (readApiData(result) === null || readApiData(result) === undefined) {
      return undefined;
    }
    const item: SdkSkillDetailResponse = readRequiredApiItem(result, 'Skill detail response is missing data') as unknown as SdkSkillDetailResponse;
    return normalizeSkillApiRecord(item);
  },

  async getCategories(): Promise<string[]> {
    const result = await getClawRouterAppSdkClient().skill.skillsGetCategories();
    ensurePlusApiSuccess(result, 'Failed to fetch skill categories');
    const items: SdkSkillCategoriesResponse['items'] = readRequiredApiItems(
      result,
      'Failed to fetch skill categories',
    ) as SdkSkillCategoriesResponse['items'];
    return items
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }
        return isRecord(item) ? readString(item, 'name') || readString(item, 'category') : '';
      })
      .filter((item): item is string => item.length > 0)
      .sort();
  },

  async getMySkills(): Promise<InstalledSkill[]> {
    const result = await getClawRouterAppSdkClient().skill.getMySkills();
    ensurePlusApiSuccess(result, 'Failed to fetch installed skills');
    const items: SdkAppInstalledSkillsResponse['items'] = readRequiredApiItems(
      result,
      'Failed to fetch installed skills',
    ) as SdkAppInstalledSkillsResponse['items'];
    return items.map(normalizeInstalledSkillApiRecord);
  },

  async enableSkill(skillId: string, config: unknown = {}): Promise<InstalledSkill> {
    const result = await getClawRouterAppSdkClient().skill.enableSkill(
      requiredSafePathSegment(skillId, 'skillId'),
      skillConfigRequest(config),
      createRequestToken('skill-enable'),
    );
    ensurePlusApiSuccess(result, 'Failed to enable skill');
    return readInstalledSkillResult(result, 'Enabled skill response is missing data');
  },

  async disableSkill(skillId: string): Promise<InstalledSkill> {
    const result = await getClawRouterAppSdkClient().skill.disableSkill(
      requiredSafePathSegment(skillId, 'skillId'),
      undefined,
      createRequestToken('skill-disable'),
    );
    ensurePlusApiSuccess(result, 'Failed to disable skill');
    return readInstalledSkillResult(result, 'Disabled skill response is missing data');
  },

  async updateSkillConfig(skillId: string, config: unknown): Promise<InstalledSkill> {
    const result = await getClawRouterAppSdkClient().skill.updateSkillConfig(
      requiredSafePathSegment(skillId, 'skillId'),
      skillConfigRequest(config),
      createRequestToken('skill-config'),
    );
    ensurePlusApiSuccess(result, 'Failed to update skill config');
    return readInstalledSkillResult(result, 'Updated skill response is missing data');
  },
};

function toSkillCatalogQueryParams(filters: SkillCatalogQueryFilterInput | undefined = {}): Record<string, string | number> {
  const keyword = optionalText(filters.keyword ?? filters.search, 'search', MAX_SKILL_CATALOG_QUERY_TEXT_LENGTH);

  return pruneUndefinedQueryParams({
    pageNo: optionalPositiveInteger(filters.pageNo, 'pageNo'),
    pageSize: optionalBoundedPositiveInteger(filters.pageSize, 'pageSize', MAX_SKILL_CATALOG_PAGE_SIZE),
    keyword,
    status: optionalText(filters.status, 'status', MAX_SKILL_CATALOG_STATUS_LENGTH),
    startTime: optionalText(filters.startTime, 'startTime', MAX_SKILL_CATALOG_TIMESTAMP_LENGTH),
    endTime: optionalText(filters.endTime, 'endTime', MAX_SKILL_CATALOG_TIMESTAMP_LENGTH),
  });
}

function skillCatalogQueryArguments(filters: SkillCatalogQueryFilterInput | undefined = {}) {
  return standardListQueryArguments(toSkillCatalogQueryParams(filters));
}

function skillConfigRequest(config: unknown): SdkAppSkillConfigRequest {
  return { config: normalizeSkillConfig(config) };
}

function readInstalledSkillResult(result: unknown, message: string): InstalledSkill {
  const item: SdkAppInstalledSkillResponse['item'] = readRequiredApiItem(
    result,
    message,
    ['item'],
  ) as unknown as SdkAppInstalledSkillResponse['item'];
  return normalizeInstalledSkillApiRecord(item);
}
