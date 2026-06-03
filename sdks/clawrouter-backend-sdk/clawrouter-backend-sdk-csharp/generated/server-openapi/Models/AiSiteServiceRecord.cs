using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiSiteServiceRecord
    {
        public Dictionary<string, string>? AuthConfig { get; set; }
        public string? AuthType { get; set; }
        public string? BaseUrl { get; set; }
        public string? ConsecutiveErrorCount { get; set; }
        public string? CreatedAt { get; set; }
        public string? CredentialHash { get; set; }
        public string? CredentialProfile { get; set; }
        public string? CredentialRef { get; set; }
        public string? CredentialVersion { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Environment { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public int? LastLatencyMs { get; set; }
        public string? LastSyncAt { get; set; }
        public string? LastVerifiedAt { get; set; }
        public string? MaskedLabel { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProtocolCode { get; set; }
        public string? RegionCode { get; set; }
        public string? ServiceCode { get; set; }
        public string? ServiceName { get; set; }
        public string? ServiceType { get; set; }
        public string? SiteCode { get; set; }
        public string? SiteId { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
