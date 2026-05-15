using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class OpsOutboxEventRecord
    {
        public string? AggregateId { get; set; }
        public string? AggregateType { get; set; }
        public string? AggregateUuid { get; set; }
        public string? CreatedAt { get; set; }
        public string? EventId { get; set; }
        public Dictionary<string, string>? EventPayload { get; set; }
        public string? EventType { get; set; }
        public int? EventVersion { get; set; }
        public string? FailureReason { get; set; }
        public Dictionary<string, string>? Headers { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? NextRetryAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? PublishStatus { get; set; }
        public string? PublishedAt { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public int? RetryCount { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
