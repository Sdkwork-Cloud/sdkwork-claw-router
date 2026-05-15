using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCouponBatchGenerateRequest
    {
        public int? Count { get; set; }
        public int? CouponId { get; set; }
        public string? Name { get; set; }
        public string? Prefix { get; set; }
    }
}
