using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiPricingPlanBindingRecord
    {
        public string? BindingSource { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MultiplierOverride { get; set; }
        public string? OrganizationId { get; set; }
        public string? PricingPlanCode { get; set; }
        public string? PricingPlanId { get; set; }
        public int? Priority { get; set; }
        public string? QuotaPolicyId { get; set; }
        public string? RpmOverride { get; set; }
        public string? Status { get; set; }
        public string? SubjectCode { get; set; }
        public string? SubjectId { get; set; }
        public string? SubjectType { get; set; }
        public string? TenantId { get; set; }
        public string? TpmOverride { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
