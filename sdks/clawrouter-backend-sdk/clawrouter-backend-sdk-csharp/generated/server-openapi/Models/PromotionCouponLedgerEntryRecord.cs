using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PromotionCouponLedgerEntryRecord
    {
        public string? ApplicationId { get; set; }
        public string? BusinessType { get; set; }
        public string? CreatedAt { get; set; }
        public string? Direction { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? LedgerNo { get; set; }
        public string? OccurredAt { get; set; }
        public string? OfferId { get; set; }
        public string? OrganizationId { get; set; }
        public string? RequestNo { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? StockId { get; set; }
        public string? SubjectId { get; set; }
        public string? SubjectType { get; set; }
        public string? TenantId { get; set; }
        public string? UserCouponId { get; set; }
    }
}
