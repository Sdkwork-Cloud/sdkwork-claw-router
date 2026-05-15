using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiPricingRuleRecord
    {
        public string? BillingMeterCode { get; set; }
        public string? BillingMeterId { get; set; }
        public string? BillingMode { get; set; }
        public string? BillingType { get; set; }
        public string? CapabilityCode { get; set; }
        public string? ChannelId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? Expression { get; set; }
        public string? ExpressionHash { get; set; }
        public string? FallbackMode { get; set; }
        public string? FamilyCode { get; set; }
        public string? FormulaMode { get; set; }
        public string? Id { get; set; }
        public string? IncludedQuantity { get; set; }
        public string? MarkupAmount { get; set; }
        public string? MatchType { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MeteringMode { get; set; }
        public string? MinimumQuantity { get; set; }
        public string? Model { get; set; }
        public string? ModelId { get; set; }
        public string? Multiplier { get; set; }
        public string? OrganizationId { get; set; }
        public string? PlatformCode { get; set; }
        public string? PriceItemType { get; set; }
        public string? PriceSide { get; set; }
        public string? PricingPlanCode { get; set; }
        public string? PricingPlanId { get; set; }
        public int? Priority { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderModel { get; set; }
        public string? QuantityFormula { get; set; }
        public string? QuantitySource { get; set; }
        public string? QuantityStep { get; set; }
        public string? ReferencePriceSide { get; set; }
        public string? ReferencePricingId { get; set; }
        public string? ReferencePricingScope { get; set; }
        public string? Region { get; set; }
        public string? ResultSelector { get; set; }
        public string? RuleCode { get; set; }
        public string? RuleName { get; set; }
        public string? ServiceTier { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? Unit { get; set; }
        public string? UnitPriceOverride { get; set; }
        public string? UnitSize { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? Version { get; set; }
    }
}
