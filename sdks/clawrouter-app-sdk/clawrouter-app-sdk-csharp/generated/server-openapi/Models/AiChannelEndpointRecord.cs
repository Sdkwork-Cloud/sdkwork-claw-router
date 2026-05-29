using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiChannelEndpointRecord
    {
        public string? ApiCode { get; set; }
        public string? ApiEndpointId { get; set; }
        public string? BaseUrl { get; set; }
        public string? ChannelCode { get; set; }
        public string? ChannelId { get; set; }
        public string? ChannelType { get; set; }
        public string? ConsecutiveErrorCount { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? Id { get; set; }
        public int? LastLatencyMs { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PathPrefix { get; set; }
        public string? ProviderCode { get; set; }
        public string? RegionCode { get; set; }
        public Dictionary<string, string>? RetryPolicy { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public int? TimeoutMs { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? VendorId { get; set; }
        public string? Version { get; set; }
    }
}
