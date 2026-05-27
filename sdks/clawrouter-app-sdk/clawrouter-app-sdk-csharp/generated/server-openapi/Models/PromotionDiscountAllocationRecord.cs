using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionDiscountAllocationRecord
    {
        public int? AllocationRatioBps { get; set; }
        public string? ApplicationId { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? OrderId { get; set; }
        public string? OrderItemId { get; set; }
        public string? OrganizationId { get; set; }
        public string? SkuId { get; set; }
        public string? TenantId { get; set; }
    }
}
