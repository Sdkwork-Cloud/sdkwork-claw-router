using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceBillingHistoryRecord
    {
        public string? Amount { get; set; }
        public string? AssetType { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? Direction { get; set; }
        public string? HistoryNo { get; set; }
        public string? HistoryType { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? MetadataJson { get; set; }
        public string? OccurredAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? PaymentMethod { get; set; }
        public string? PointsDelta { get; set; }
        public string? ReferenceNo { get; set; }
        public string? RelatedOrderId { get; set; }
        public string? RelatedOrderNo { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
