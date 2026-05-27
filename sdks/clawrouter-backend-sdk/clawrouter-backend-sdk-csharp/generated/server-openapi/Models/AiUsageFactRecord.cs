using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiUsageFactRecord
    {
        public string? ApiKeyGroupId { get; set; }
        public string? ApiKeyGroupSnapshot { get; set; }
        public string? ApiKeyId { get; set; }
        public string? ApiKeyNameSnapshot { get; set; }
        public string? AudioSeconds { get; set; }
        public string? BandwidthBytes { get; set; }
        public string? BaseInputUnitPrice { get; set; }
        public string? BaseOutputUnitPrice { get; set; }
        public string? BillableQuantity { get; set; }
        public string? BillableUnit { get; set; }
        public string? BillingMeterCode { get; set; }
        public string? BillingMeterId { get; set; }
        public string? BillingMode { get; set; }
        public string? BillingTier { get; set; }
        public string? BillingType { get; set; }
        public string? CacheReadUnitPrice { get; set; }
        public string? CachedTokens { get; set; }
        public string? CatalogKey { get; set; }
        public string? ChannelId { get; set; }
        public string? CharacterCount { get; set; }
        public string? CompletionTokens { get; set; }
        public string? CostAmount { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? CustomerChargeAmount { get; set; }
        public string? DecisionLogId { get; set; }
        public string? Id { get; set; }
        public string? ImageCount { get; set; }
        public string? ItemCount { get; set; }
        public string? LegacyApiKeyId { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Modality { get; set; }
        public string? Model { get; set; }
        public string? OccurredAt { get; set; }
        public string? OfficialReferenceAmount { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerNameSnapshot { get; set; }
        public string? OwnerType { get; set; }
        public string? PayloadHash { get; set; }
        public string? PricingId { get; set; }
        public string? PricingPlanCode { get; set; }
        public string? PricingPlanId { get; set; }
        public string? PricingRuleId { get; set; }
        public Dictionary<string, string>? PricingSnapshot { get; set; }
        public string? PricingTierId { get; set; }
        public string? PromptTokens { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderId { get; set; }
        public string? ProviderNativeModel { get; set; }
        public string? RateMultiplier { get; set; }
        public string? ReasoningEffort { get; set; }
        public string? ReferenceMultiplier { get; set; }
        public string? RequestCount { get; set; }
        public string? RequestId { get; set; }
        public string? RequestedModelCatalogKey { get; set; }
        public string? ResultCount { get; set; }
        public string? RetentionUntil { get; set; }
        public string? SettlementId { get; set; }
        public string? SettlementStatus { get; set; }
        public string? Status { get; set; }
        public string? StorageByteHours { get; set; }
        public string? TenantId { get; set; }
        public string? TotalTokens { get; set; }
        public string? TraceId { get; set; }
        public string? UnitPriceSnapshot { get; set; }
        public string? UpstreamCostAmount { get; set; }
        public string? UsageType { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? VideoSeconds { get; set; }
    }
}
