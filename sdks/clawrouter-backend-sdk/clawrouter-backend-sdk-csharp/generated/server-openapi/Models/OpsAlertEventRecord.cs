using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpsAlertEventRecord
    {
        public string? AlertNo { get; set; }
        public string? AlertStatus { get; set; }
        public string? CreatedAt { get; set; }
        public string? FirstSeenAt { get; set; }
        public string? Id { get; set; }
        public string? LastSeenAt { get; set; }
        public bool? LegalHold { get; set; }
        public string? Message { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? RequestId { get; set; }
        public string? ResolvedAt { get; set; }
        public string? ResolvedBy { get; set; }
        public string? RetentionUntil { get; set; }
        public string? Severity { get; set; }
        public string? Source { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
