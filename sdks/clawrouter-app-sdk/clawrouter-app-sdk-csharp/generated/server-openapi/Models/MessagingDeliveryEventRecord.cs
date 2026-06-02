using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class MessagingDeliveryEventRecord
    {
        public string? CreatedAt { get; set; }
        public string? EventAt { get; set; }
        public string? EventType { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public Dictionary<string, string>? PayloadRedacted { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderEventId { get; set; }
        public string? ProviderMessageId { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? SendAttemptId { get; set; }
        public string? SendRequestId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
