using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiSiteRecord
    {
        public string? BaseUrl { get; set; }
        public string? ColorToken { get; set; }
        public string? ConsecutiveErrorCount { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? DisplayName { get; set; }
        public string? DocsUrl { get; set; }
        public string? Environment { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public string? LastCheckedAt { get; set; }
        public int? LastLatencyMs { get; set; }
        public string? LastSyncAt { get; set; }
        public MediaResource? Logo { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerKind { get; set; }
        public string? RegionCode { get; set; }
        public string? SiteCode { get; set; }
        public string? SiteName { get; set; }
        public string? SiteType { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? WebsiteUrl { get; set; }
    }
}
