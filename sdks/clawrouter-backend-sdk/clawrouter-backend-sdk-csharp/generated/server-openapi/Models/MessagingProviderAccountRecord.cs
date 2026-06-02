using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class MessagingProviderAccountRecord
    {
        public string? AccountCode { get; set; }
        public string? AccountName { get; set; }
        public string? AuthType { get; set; }
        public string? BaseUrl { get; set; }
        public string? Channel { get; set; }
        public string? CreatedAt { get; set; }
        public string? CredentialHash { get; set; }
        public string? CredentialRef { get; set; }
        public string? CredentialVersion { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DeliveryPurpose { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public string? LastUsedAt { get; set; }
        public string? LastVerifiedAt { get; set; }
        public string? MaskedLabel { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
