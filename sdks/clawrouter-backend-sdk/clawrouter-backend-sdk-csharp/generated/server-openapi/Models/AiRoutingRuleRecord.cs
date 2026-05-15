using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiRoutingRuleRecord
    {
        public Dictionary<string, string>? CandidateChannels { get; set; }
        public Dictionary<string, string>? Constraints { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public Dictionary<string, string>? FallbackChain { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? MatchExpression { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public int? Priority { get; set; }
        public string? ProfileId { get; set; }
        public string? RateLimitPolicyId { get; set; }
        public string? RuleCode { get; set; }
        public string? Status { get; set; }
        public string? TargetModel { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
