using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCouponBatchItem
    {
        public int? Count { get; set; }
        public string? CouponId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Prefix { get; set; }
    }
}
