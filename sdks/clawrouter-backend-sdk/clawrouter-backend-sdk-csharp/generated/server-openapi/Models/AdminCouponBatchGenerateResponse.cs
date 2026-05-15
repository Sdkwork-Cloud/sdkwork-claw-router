using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCouponBatchGenerateResponse
    {
        public AdminCouponBatchItem? Batch { get; set; }
        public List<AdminPromoCodeItem>? Codes { get; set; }
    }
}
