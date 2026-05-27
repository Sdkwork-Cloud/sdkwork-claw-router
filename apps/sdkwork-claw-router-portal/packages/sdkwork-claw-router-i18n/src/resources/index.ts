import { mergeI18nBundles } from './merge';
import { adminCommerceCatalogMessages } from './admin-commerce/catalog';
import { adminCommerceFinanceMessages } from './admin-commerce/finance';
import { adminCommerceInventoryMessages } from './admin-commerce/inventory';
import { adminCommerceMarketingMessages } from './admin-commerce/marketing';
import { adminCommerceMembershipsMessages } from './admin-commerce/memberships';
import { adminCommerceOrdersMessages } from './admin-commerce/orders';
import { adminCommercePaymentsMessages } from './admin-commerce/payments';
import { adminCommerceVipMessages } from './admin-commerce/vip';
import { adminCommerceWalletMessages } from './admin-commerce/wallet';
import { adminAgentsMessages } from './admin/agents';
import { adminAnalyticsRecordMessages } from './admin/analytics-record';
import { adminAnnouncementMessages } from './admin/announcement';
import { adminAppCenterMessages } from './admin/app-center';
import { adminAuthSettingsMessages } from './admin/auth-settings';
import { adminCacheMessages } from './admin/cache';
import { adminChannelMessages } from './admin/channel';
import { adminCoreColumnsMessages } from './admin/core-columns';
import { adminCoreNavigationMessages } from './admin/core-navigation';
import { adminDashboardMessages } from './admin/dashboard';
import { adminFilePlatformMessages } from './admin/file-platform';
import { adminFinanceMessages } from './admin/finance';
import { adminGroupUserMessages } from './admin/group-user';
import { adminMiscMessages } from './admin/misc';
import { adminModelMessages } from './admin/model';
import { adminMcpMessages } from './admin/mcp';
import { adminOpenPlatformMessages } from './admin/open-platform';
import { adminPromptsMessages } from './admin/prompts';
import { adminRateLimitMessages } from './admin/rate-limit';
import { adminServiceNodesMessages } from './admin/service-nodes';
import { adminServiceProviderMessages } from './admin/service-provider';
import { adminSiteSettingsMessages } from './admin/site-settings';
import { adminSkillMessages } from './admin/skill';
import { consoleAccountMessages } from './console/account';
import { consoleApiKeysMessages } from './console/api-keys';
import { consoleBillingMessages } from './console/billing';
import { consoleCoreMessages } from './console/core';
import { consoleDashboardMessages } from './console/dashboard';
import { consoleGatewayMessages } from './console/gateway';
import { consoleMembershipsMessages } from './console/memberships';
import { consoleMessagesMessages } from './console/messages';
import { consoleRechargeMessages } from './console/recharge';
import { consoleSettingsMessages } from './console/settings';
import { consoleSettlementsMessages } from './console/settlements';
import { consoleUsageMessages } from './console/usage';
import { playgroundAssetsMessages } from './playground/assets';
import { playgroundChatMessages } from './playground/chat';
import { playgroundCoreMessages } from './playground/core';
import { playgroundFiltersMessages } from './playground/filters';
import { playgroundGenerationMessages } from './playground/generation';
import { playgroundInputMessages } from './playground/input';
import { playgroundModalitiesMessages } from './playground/modalities';
import { playgroundPreviewMessages } from './playground/preview';
import { publicApiReferenceMessages } from './public/api-reference';
import { publicAppsMessages } from './public/apps';
import { publicCoursesMessages } from './public/courses';
import { publicDocsMessages } from './public/docs';
import { publicForumMessages } from './public/forum';
import { publicModelsMessages } from './public/models';
import { publicRankingsMessages } from './public/rankings';
import { publicSdkReferenceMessages } from './public/sdk-reference';
import { publicSkillsMessages } from './public/skills';
import { sharedCommonMessages } from './shared/common';
import { sharedNavigationMessages } from './shared/navigation';

export const resources = mergeI18nBundles([
  adminCommerceCatalogMessages,
  adminCommerceFinanceMessages,
  adminCommerceInventoryMessages,
  adminCommerceMarketingMessages,
  adminCommerceMembershipsMessages,
  adminCommerceOrdersMessages,
  adminCommercePaymentsMessages,
  adminCommerceVipMessages,
  adminCommerceWalletMessages,
  adminAgentsMessages,
  adminAnalyticsRecordMessages,
  adminAnnouncementMessages,
  adminAppCenterMessages,
  adminAuthSettingsMessages,
  adminCacheMessages,
  adminChannelMessages,
  adminCoreColumnsMessages,
  adminCoreNavigationMessages,
  adminDashboardMessages,
  adminFilePlatformMessages,
  adminFinanceMessages,
  adminGroupUserMessages,
  adminMiscMessages,
  adminModelMessages,
  adminMcpMessages,
  adminOpenPlatformMessages,
  adminPromptsMessages,
  adminRateLimitMessages,
  adminServiceNodesMessages,
  adminServiceProviderMessages,
  adminSiteSettingsMessages,
  adminSkillMessages,
  consoleAccountMessages,
  consoleApiKeysMessages,
  consoleBillingMessages,
  consoleCoreMessages,
  consoleDashboardMessages,
  consoleGatewayMessages,
  consoleMembershipsMessages,
  consoleMessagesMessages,
  consoleRechargeMessages,
  consoleSettingsMessages,
  consoleSettlementsMessages,
  consoleUsageMessages,
  playgroundAssetsMessages,
  playgroundChatMessages,
  playgroundCoreMessages,
  playgroundFiltersMessages,
  playgroundGenerationMessages,
  playgroundInputMessages,
  playgroundModalitiesMessages,
  playgroundPreviewMessages,
  publicApiReferenceMessages,
  publicAppsMessages,
  publicCoursesMessages,
  publicDocsMessages,
  publicForumMessages,
  publicModelsMessages,
  publicRankingsMessages,
  publicSdkReferenceMessages,
  publicSkillsMessages,
  sharedCommonMessages,
  sharedNavigationMessages,
]);
