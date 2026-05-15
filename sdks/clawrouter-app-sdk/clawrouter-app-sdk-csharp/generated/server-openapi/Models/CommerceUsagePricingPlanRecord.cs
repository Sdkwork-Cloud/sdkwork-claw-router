using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceUsagePricingPlanRecord
    {
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? Id { get; set; }
        public string? IncludedQuota { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OveragePricingId { get; set; }
        public string? PlanCode { get; set; }
        public string? PlanName { get; set; }
        public string? PricingMode { get; set; }
        public string? ProductId { get; set; }
        public string? RateMultiplier { get; set; }
        public string? SkuId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? VipLevelId { get; set; }
    }
}
