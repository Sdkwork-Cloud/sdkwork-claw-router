using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiSiteModelRecord
    {
        public Dictionary<string, string>? Capabilities { get; set; }
        public string? Capability { get; set; }
        public string? CatalogKey { get; set; }
        public string? ConsecutiveErrorCount { get; set; }
        public string? ContextTokens { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public Dictionary<string, string>? DefaultParameters { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DisplayName { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public int? LastLatencyMs { get; set; }
        public string? LastSyncAt { get; set; }
        public string? MaxInputTokens { get; set; }
        public string? MaxOutputTokens { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Modality { get; set; }
        public Dictionary<string, string>? ModelAliases { get; set; }
        public string? ModelCode { get; set; }
        public string? ModelId { get; set; }
        public string? ModelName { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? PricingSnapshot { get; set; }
        public string? ProviderModel { get; set; }
        public string? ProviderNativeModel { get; set; }
        public string? ServiceType { get; set; }
        public string? SiteCode { get; set; }
        public string? SiteId { get; set; }
        public string? SiteServiceCode { get; set; }
        public string? SiteServiceId { get; set; }
        public string? Status { get; set; }
        public bool? SupportsJsonSchema { get; set; }
        public bool? SupportsStreaming { get; set; }
        public bool? SupportsTools { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? Version { get; set; }
    }
}
