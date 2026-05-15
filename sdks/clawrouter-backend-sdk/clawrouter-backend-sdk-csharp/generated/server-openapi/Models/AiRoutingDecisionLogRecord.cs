using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiRoutingDecisionLogRecord
    {
        public string? ApiKeyId { get; set; }
        public Dictionary<string, string>? CandidateSnapshot { get; set; }
        public string? Capability { get; set; }
        public string? CreatedAt { get; set; }
        public int? DecisionLatencyMs { get; set; }
        public string? DecisionMode { get; set; }
        public Dictionary<string, string>? DecisionReason { get; set; }
        public Dictionary<string, string>? FallbackChain { get; set; }
        public string? Id { get; set; }
        public string? LegacyApiKeyId { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? PolicyId { get; set; }
        public string? ProfileId { get; set; }
        public string? RequestId { get; set; }
        public string? RequestedModel { get; set; }
        public string? ResolvedModel { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RuleId { get; set; }
        public string? SelectedAccountId { get; set; }
        public string? SelectedChannelId { get; set; }
        public string? SelectedProviderId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
