using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamGatewayRiskRuleRecord
    {
        public string? Action { get; set; }
        public string? BlockDurationSeconds { get; set; }
        public string? BurstLimit { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? HitCount { get; set; }
        public string? Id { get; set; }
        public string? LastHitAt { get; set; }
        public string? MatchMode { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public int? Priority { get; set; }
        public string? Reason { get; set; }
        public string? RequestsPerDay { get; set; }
        public string? RequestsPerMinute { get; set; }
        public string? RequestsPerSecond { get; set; }
        public string? RuleCategory { get; set; }
        public string? RuleName { get; set; }
        public string? RuleType { get; set; }
        public string? ScopeId { get; set; }
        public string? ScopeType { get; set; }
        public string? Status { get; set; }
        public string? TargetType { get; set; }
        public string? TargetValue { get; set; }
        public string? TargetValueCipherRef { get; set; }
        public string? TargetValueHash { get; set; }
        public string? TargetValueMasked { get; set; }
        public string? TenantId { get; set; }
        public string? TokensPerMinute { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
