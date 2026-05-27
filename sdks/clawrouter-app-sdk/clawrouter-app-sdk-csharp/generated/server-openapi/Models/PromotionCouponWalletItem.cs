using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionCouponWalletItem
    {
        public string? ClaimSource { get; set; }
        public string? ClaimedAt { get; set; }
        public string? CodeId { get; set; }
        public string? CouponNo { get; set; }
        public string? CurrencyCode { get; set; }
        public string? DiscountType { get; set; }
        public string? ExpiresAt { get; set; }
        public int? FaceValueMinor { get; set; }
        public string? Id { get; set; }
        public string? LockExpiresAt { get; set; }
        public string? LockedAt { get; set; }
        public string? OfferId { get; set; }
        public string? RedeemedAt { get; set; }
        public string? ReturnedAt { get; set; }
        public string? SourceCodeLast4 { get; set; }
        public string? Status { get; set; }
        public string? StockId { get; set; }
        public string? ValidFrom { get; set; }
    }
}
