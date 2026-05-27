using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PromotionDiscountApplicationRecord
    {
        public string? ApplicationNo { get; set; }
        public string? AppliedAt { get; set; }
        public string? BudgetAccountId { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? FailureCode { get; set; }
        public string? FailureMessage { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? OfferId { get; set; }
        public string? OfferVersionId { get; set; }
        public string? OrderId { get; set; }
        public string? OrderNo { get; set; }
        public string? OrganizationId { get; set; }
        public string? PaymentId { get; set; }
        public string? ReleasedAt { get; set; }
        public string? RequestNo { get; set; }
        public string? ReservationExpiresAt { get; set; }
        public string? ReservedAt { get; set; }
        public string? RolledBackAt { get; set; }
        public Dictionary<string, string>? RuleSnapshotJson { get; set; }
        public string? SettledAt { get; set; }
        public string? Status { get; set; }
        public string? StockId { get; set; }
        public string? SubjectId { get; set; }
        public string? SubjectType { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserCouponId { get; set; }
    }
}
