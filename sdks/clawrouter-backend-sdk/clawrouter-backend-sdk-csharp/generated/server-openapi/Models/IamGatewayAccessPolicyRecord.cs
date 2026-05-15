using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamGatewayAccessPolicyRecord
    {
        public Dictionary<string, string>? AllowedCapabilities { get; set; }
        public Dictionary<string, string>? AllowedModels { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataRetentionMode { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public Dictionary<string, string>? DeniedCapabilities { get; set; }
        public Dictionary<string, string>? DeniedModels { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? IpAllowlist { get; set; }
        public Dictionary<string, string>? IpDenylist { get; set; }
        public int? IpRuleCount { get; set; }
        public string? MaxContextTokens { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Name { get; set; }
        public string? NetworkPolicyMode { get; set; }
        public string? OrganizationId { get; set; }
        public string? PolicyType { get; set; }
        public Dictionary<string, string>? RegionAllowlist { get; set; }
        public string? Status { get; set; }
        public string? SubjectId { get; set; }
        public string? SubjectRefHash { get; set; }
        public string? SubjectRefMasked { get; set; }
        public string? SubjectType { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
