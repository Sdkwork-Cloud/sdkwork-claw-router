using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IntegrationProviderAccountRecord
    {
        public string? AccountCode { get; set; }
        public string? AccountName { get; set; }
        public Dictionary<string, string>? AuthConfig { get; set; }
        public string? AuthType { get; set; }
        public string? BaseUrl { get; set; }
        public string? ConsecutiveErrorCount { get; set; }
        public string? CreatedAt { get; set; }
        public string? CredentialProfile { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? ExternalAccountId { get; set; }
        public string? Id { get; set; }
        public string? LastBalanceCheckedAt { get; set; }
        public string? LastRotatedAt { get; set; }
        public string? LastUsedAt { get; set; }
        public string? LastVerifiedAt { get; set; }
        public string? MaskedLabel { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? NextRotateAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderId { get; set; }
        public string? QuotaLimit { get; set; }
        public string? QuotaUnit { get; set; }
        public string? QuotaUsed { get; set; }
        public string? RiskLevel { get; set; }
        public string? SecretHash { get; set; }
        public string? SecretRef { get; set; }
        public Dictionary<string, string>? SecretRotationPolicy { get; set; }
        public string? SecretVersion { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UpstreamBalanceAmount { get; set; }
        public string? UpstreamBalanceCurrency { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
