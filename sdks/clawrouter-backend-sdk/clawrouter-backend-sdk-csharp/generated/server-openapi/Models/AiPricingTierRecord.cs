using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiPricingTierRecord
    {
        public string? AudioUnitPrice { get; set; }
        public string? BillingMeterCode { get; set; }
        public string? BillingMeterId { get; set; }
        public string? BillingMode { get; set; }
        public string? CacheReadUnitPrice { get; set; }
        public string? CacheWriteUnitPrice { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? Id { get; set; }
        public string? ImageUnitPrice { get; set; }
        public string? IncludedQuantity { get; set; }
        public string? InputUnitPrice { get; set; }
        public string? MaxQuantity { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MinQuantity { get; set; }
        public string? ModelPricingId { get; set; }
        public string? Multiplier { get; set; }
        public string? OrganizationId { get; set; }
        public string? OutputUnitPrice { get; set; }
        public string? PerRequestPrice { get; set; }
        public string? PriceItemType { get; set; }
        public string? PricingRuleId { get; set; }
        public string? QuantityStep { get; set; }
        public string? QuantityUnit { get; set; }
        public string? ResultSelector { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TierCode { get; set; }
        public string? TierLabel { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? VideoUnitPrice { get; set; }
    }
}
