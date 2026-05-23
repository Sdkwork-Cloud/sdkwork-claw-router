using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceCouponTemplateRecord
    {
        public string? CreatedAt { get; set; }
        public string? DiscountType { get; set; }
        public string? DiscountValue { get; set; }
        public string? ExpiresAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? StartsAt { get; set; }
        public string? Status { get; set; }
        public string? TemplateNo { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? TotalQuantity { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
