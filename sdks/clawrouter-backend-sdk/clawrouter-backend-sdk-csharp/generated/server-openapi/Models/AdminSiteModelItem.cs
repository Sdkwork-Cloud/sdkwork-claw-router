using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSiteModelItem
    {
        public List<string>? Capabilities { get; set; }
        public int? ConsecutiveErrorCount { get; set; }
        public int? ContextTokens { get; set; }
        public string? DisplayName { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public int? LastLatencyMs { get; set; }
        public string? LastSyncAt { get; set; }
        public int? MaxInputTokens { get; set; }
        public int? MaxOutputTokens { get; set; }
        public string? Modality { get; set; }
        public string? ModelCode { get; set; }
        public string? ModelName { get; set; }
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
        public string? VendorCode { get; set; }
    }
}
