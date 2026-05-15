using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceCouponClaimRequest
    {
        public string? ClaimSource { get; set; }
        public string? CouponId { get; set; }
    }
}
