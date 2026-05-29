using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiChannelGroupRecord
    {
        public Dictionary<string, string>? AllowedOrigin { get; set; }
        public string? BillingType { get; set; }
        public string? CapacityLimit { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? Environment { get; set; }
        public string? GroupCode { get; set; }
        public string? GroupName { get; set; }
        public string? GroupType { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OfficialPriceMultiplier { get; set; }
        public string? OrganizationId { get; set; }
        public string? PriceReferenceMode { get; set; }
        public string? PricingPlanCode { get; set; }
        public string? PricingPlanId { get; set; }
        public string? ProviderCode { get; set; }
        public string? QuotaPolicyId { get; set; }
        public string? RateLimitPolicyId { get; set; }
        public string? RateMultiplier { get; set; }
        public string? RoutingPolicyId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
