using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceMembershipPurchaseRequest
    {
        public string? CouponId { get; set; }
        public int? PackageId { get; set; }
    }
}
