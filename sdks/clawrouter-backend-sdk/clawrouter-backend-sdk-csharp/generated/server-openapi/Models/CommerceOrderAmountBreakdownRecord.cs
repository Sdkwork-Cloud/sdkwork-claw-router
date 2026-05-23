using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceOrderAmountBreakdownRecord
    {
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? DiscountAmount { get; set; }
        public string? OrderId { get; set; }
        public string? OriginalAmount { get; set; }
        public string? PayableAmount { get; set; }
        public string? TenantId { get; set; }
    }
}
