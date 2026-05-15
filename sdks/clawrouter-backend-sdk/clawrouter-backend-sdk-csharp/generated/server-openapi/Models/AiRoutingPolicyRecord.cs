using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiRoutingPolicyRecord
    {
        public string? Capability { get; set; }
        public string? CostCeiling { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultProfileId { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? FallbackMode { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? PolicyCode { get; set; }
        public string? PolicyScope { get; set; }
        public int? SloLatencyMs { get; set; }
        public string? SloSuccessRate { get; set; }
        public string? Status { get; set; }
        public string? SubjectId { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
