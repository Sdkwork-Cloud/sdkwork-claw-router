using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PromotionDiscountAllocationRecord
    {
        public string? AllocationAmountMinor { get; set; }
        public int? AllocationRatioBps { get; set; }
        public string? ApplicationId { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? Id { get; set; }
        public string? OrderId { get; set; }
        public string? OrderItemId { get; set; }
        public string? OrganizationId { get; set; }
        public string? SkuId { get; set; }
        public string? TenantId { get; set; }
    }
}
