using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiChannelRecord
    {
        public Dictionary<string, string>? AuthConfig { get; set; }
        public string? AuthType { get; set; }
        public string? BaseUrl { get; set; }
        public string? ChannelCode { get; set; }
        public string? ChannelName { get; set; }
        public string? ChannelType { get; set; }
        public Dictionary<string, string>? CircuitBreakerPolicy { get; set; }
        public string? ConsecutiveErrorCount { get; set; }
        public string? CreatedAt { get; set; }
        public string? CredentialHash { get; set; }
        public string? CredentialProfile { get; set; }
        public string? CredentialRef { get; set; }
        public Dictionary<string, string>? CredentialRotationPolicy { get; set; }
        public string? CredentialVersion { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Environment { get; set; }
        public string? ExternalChannelId { get; set; }
        public string? Id { get; set; }
        public string? LastBalanceCheckedAt { get; set; }
        public int? LastLatencyMs { get; set; }
        public string? LastRotatedAt { get; set; }
        public string? LastUsedAt { get; set; }
        public string? LastVerifiedAt { get; set; }
        public string? MaskedLabel { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? NextRotateAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProtocolCode { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderId { get; set; }
        public string? ProxyId { get; set; }
        public string? QuotaLimit { get; set; }
        public string? QuotaUnit { get; set; }
        public string? QuotaUsed { get; set; }
        public string? RegionCode { get; set; }
        public Dictionary<string, string>? RetryPolicy { get; set; }
        public string? RiskLevel { get; set; }
        public string? RpmLimit { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public int? TimeoutMs { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UpstreamBalanceAmount { get; set; }
        public string? UpstreamBalanceCurrency { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
