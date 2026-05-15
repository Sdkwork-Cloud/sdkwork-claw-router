using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiModelPricingRecord
    {
        public string? BillingMeterCode { get; set; }
        public string? BillingMeterId { get; set; }
        public string? BillingMode { get; set; }
        public string? BillingType { get; set; }
        public string? CatalogKey { get; set; }
        public string? ChannelId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? Id { get; set; }
        public string? ImportSnapshotId { get; set; }
        public string? IncludedQuantity { get; set; }
        public string? MarkupAmount { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MeteringMode { get; set; }
        public string? MinChargeAmount { get; set; }
        public string? MinimumQuantity { get; set; }
        public string? Model { get; set; }
        public string? ModelId { get; set; }
        public string? ObservedAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? PlatformCode { get; set; }
        public string? PriceItemType { get; set; }
        public string? PriceOrigin { get; set; }
        public string? PriceSide { get; set; }
        public string? PriceVersion { get; set; }
        public string? PricingFormulaMode { get; set; }
        public string? PricingPlanCode { get; set; }
        public string? PricingPlanId { get; set; }
        public string? PricingScope { get; set; }
        public string? PricingScopeId { get; set; }
        public int? Priority { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderModel { get; set; }
        public string? PublishedAt { get; set; }
        public string? QuantityFormula { get; set; }
        public string? QuantitySource { get; set; }
        public string? QuantityStep { get; set; }
        public string? ReferenceMultiplier { get; set; }
        public string? ReferencePriceId { get; set; }
        public string? ReferencePriceSide { get; set; }
        public string? RegionCode { get; set; }
        public string? ResultSelector { get; set; }
        public string? RoundingMode { get; set; }
        public string? ServiceTier { get; set; }
        public string? SourceHash { get; set; }
        public string? SourcePriceId { get; set; }
        public string? SourceUrl { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? Unit { get; set; }
        public string? UnitPrice { get; set; }
        public string? UnitSize { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? Version { get; set; }
    }
}
