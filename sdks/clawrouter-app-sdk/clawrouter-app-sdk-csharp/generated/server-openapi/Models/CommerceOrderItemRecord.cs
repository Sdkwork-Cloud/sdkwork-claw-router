using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceOrderItemRecord
    {
        public string? CreatedAt { get; set; }
        public string? OrderId { get; set; }
        public string? Quantity { get; set; }
        public string? SkuId { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? TotalAmount { get; set; }
        public string? UnitPriceAmount { get; set; }
    }
}
