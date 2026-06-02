using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class MessagingProviderCapabilityRecord
    {
        public Dictionary<string, string>? CapabilitySchema { get; set; }
        public string? Channel { get; set; }
        public string? CountryCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DeliveryPurpose { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public string? LastVerifiedAt { get; set; }
        public string? Locale { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public Dictionary<string, string>? RateLimitPolicy { get; set; }
        public bool? SandboxSupported { get; set; }
        public string? Status { get; set; }
        public bool? SupportsBatchSend { get; set; }
        public bool? SupportsDeliveryReceipt { get; set; }
        public bool? SupportsTemplateSync { get; set; }
        public bool? SupportsTestSend { get; set; }
        public bool? SupportsWebhook { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
