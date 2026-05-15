using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceCouponUsageRequest
    {
        public string? Amount { get; set; }
        public string? BusinessNo { get; set; }
        public string? RequestNo { get; set; }
        public string? UserCouponId { get; set; }
    }
}
