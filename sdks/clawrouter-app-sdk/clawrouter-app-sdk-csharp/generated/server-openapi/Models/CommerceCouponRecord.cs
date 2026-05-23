using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceCouponRecord
    {
        public string? ClaimedAt { get; set; }
        public string? CouponCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? DisabledAt { get; set; }
        public string? ExpiresAt { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? IssueBatchId { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? RedeemedAt { get; set; }
        public string? RequestNo { get; set; }
        public string? Status { get; set; }
        public string? TemplateId { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
