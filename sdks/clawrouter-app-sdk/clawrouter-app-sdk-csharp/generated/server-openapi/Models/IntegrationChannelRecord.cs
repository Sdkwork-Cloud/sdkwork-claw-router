using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IntegrationChannelRecord
    {
        public string? AccessType { get; set; }
        public string? AccountId { get; set; }
        public string? BaseUrlOverride { get; set; }
        public Dictionary<string, string>? Capabilities { get; set; }
        public string? ChannelCode { get; set; }
        public Dictionary<string, string>? CircuitBreakerPolicy { get; set; }
        public string? ConsecutiveErrorCount { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Environment { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public int? LastLatencyMs { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? ModelMode { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public int? Priority { get; set; }
        public string? Protocol { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderId { get; set; }
        public string? ProxyId { get; set; }
        public string? Region { get; set; }
        public Dictionary<string, string>? RetryPolicy { get; set; }
        public string? RpmLimit { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public int? TimeoutMs { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public int? Weight { get; set; }
    }
}
