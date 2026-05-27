using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionEventOutboxRecord
    {
        public string? AggregateId { get; set; }
        public string? AggregateType { get; set; }
        public string? CreatedAt { get; set; }
        public string? EventNo { get; set; }
        public string? EventType { get; set; }
        public int? EventVersion { get; set; }
        public string? NextRetryAt { get; set; }
        public string? OccurredAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public Dictionary<string, string>? PayloadJson { get; set; }
        public string? PublishedAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
    }
}
