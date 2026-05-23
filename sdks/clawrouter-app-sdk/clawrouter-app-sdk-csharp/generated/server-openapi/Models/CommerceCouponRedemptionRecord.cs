using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceCouponRedemptionRecord
    {
        public string? CouponId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DiscountAmount { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? OrderId { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? RedeemedAt { get; set; }
        public string? RequestNo { get; set; }
        public string? RolledBackAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
