using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionUserCouponRecord
    {
        public string? ActivationStatus { get; set; }
        public string? BudgetAccountId { get; set; }
        public bool? CanResend { get; set; }
        public string? CancelUntil { get; set; }
        public string? ClaimCodeHash { get; set; }
        public string? ClaimCodeSuffix { get; set; }
        public string? ClaimSource { get; set; }
        public string? ClaimedAt { get; set; }
        public string? CodeId { get; set; }
        public string? CouponCodeHash { get; set; }
        public string? CouponCodeSuffix { get; set; }
        public string? CouponNo { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? DisabledAt { get; set; }
        public int? DiscountPercentBps { get; set; }
        public string? ExpiresAt { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? LockExpiresAt { get; set; }
        public string? LockedAt { get; set; }
        public string? OfferId { get; set; }
        public string? OfferVersionId { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? RecognitionHash { get; set; }
        public string? RecognitionType { get; set; }
        public string? RedeemedAt { get; set; }
        public string? RequestNo { get; set; }
        public string? ReturnedAt { get; set; }
        public string? Status { get; set; }
        public string? StockId { get; set; }
        public string? SubjectId { get; set; }
        public string? SubjectType { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? ValidFrom { get; set; }
        public string? VerifyMethod { get; set; }
    }
}
