using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IntegrationProviderHealthSnapshotRecord
    {
        public string? ChannelId { get; set; }
        public string? CheckType { get; set; }
        public string? CheckedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? ErrorCode { get; set; }
        public string? ErrorMessageMasked { get; set; }
        public string? HealthStatus { get; set; }
        public int? HttpStatus { get; set; }
        public string? Id { get; set; }
        public int? LatencyMs { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderId { get; set; }
        public Dictionary<string, string>? QuotaSnapshot { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
