using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiPricingPlanRecord
    {
        public string? BasePriceSide { get; set; }
        public string? BasePricingScope { get; set; }
        public string? BillingMode { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultMarkupAmount { get; set; }
        public string? DefaultMultiplier { get; set; }
        public string? DefaultReferencePriceId { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? FallbackMode { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MinChargeAmount { get; set; }
        public string? OrganizationId { get; set; }
        public string? PlanCode { get; set; }
        public string? PlanName { get; set; }
        public string? PlanScope { get; set; }
        public string? PriceVersion { get; set; }
        public int? Priority { get; set; }
        public string? RoundingMode { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
