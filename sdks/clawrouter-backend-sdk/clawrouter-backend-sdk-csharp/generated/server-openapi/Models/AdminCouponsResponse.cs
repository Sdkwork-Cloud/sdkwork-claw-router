using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCouponsResponse
    {
        public List<AdminCouponItem>? Items { get; set; }
    }
}
