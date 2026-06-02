using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentWebhookDeliveryRecord
    {
        public string? CreatedAt { get; set; }
        public string? DeliveryNo { get; set; }
        public string? DeliveryStatus { get; set; }
        public string? EventId { get; set; }
        public string? FailureCode { get; set; }
        public string? FailureMessage { get; set; }
        public Dictionary<string, string>? HeadersJson { get; set; }
        public string? Id { get; set; }
        public string? Nonce { get; set; }
        public string? NormalizedEventId { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadDigest { get; set; }
        public string? PayloadRef { get; set; }
        public string? ProcessedAt { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public string? ReceivedAt { get; set; }
        public string? RequestTimestamp { get; set; }
        public string? Signature { get; set; }
        public string? SignatureAlgorithm { get; set; }
        public string? SourceIp { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserAgent { get; set; }
        public string? VerificationStatus { get; set; }
        public string? VerifiedAt { get; set; }
    }
}
