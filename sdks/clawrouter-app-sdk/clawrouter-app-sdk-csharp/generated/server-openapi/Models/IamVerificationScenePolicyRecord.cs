using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamVerificationScenePolicyRecord
    {
        public Dictionary<string, string>? AllowedChannels { get; set; }
        public string? CodeCharset { get; set; }
        public int? CodeLength { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultChannel { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public int? MaxSendPerHour { get; set; }
        public int? MaxVerifyAttempts { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public int? ResendIntervalSeconds { get; set; }
        public Dictionary<string, string>? RiskPolicy { get; set; }
        public Dictionary<string, string>? RolloutPolicy { get; set; }
        public string? SceneCode { get; set; }
        public string? SceneName { get; set; }
        public string? Status { get; set; }
        public bool? TargetBindingRequired { get; set; }
        public string? TemplateCode { get; set; }
        public string? TenantId { get; set; }
        public int? TtlSeconds { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
