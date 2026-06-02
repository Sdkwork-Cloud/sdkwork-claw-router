using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class MessagingSendAttemptRecord
    {
        public int? AttemptNo { get; set; }
        public string? AttemptedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? FailureCode { get; set; }
        public string? FailureMessageMasked { get; set; }
        public int? HttpStatus { get; set; }
        public string? Id { get; set; }
        public int? LatencyMs { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderMessageId { get; set; }
        public string? ProviderRequestId { get; set; }
        public string? ProviderStatus { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RetryAfterAt { get; set; }
        public string? SendRequestId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
