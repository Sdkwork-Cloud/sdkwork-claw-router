using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCouponBatchesResponse
    {
        public List<AdminCouponBatchItem>? Items { get; set; }
    }
}
