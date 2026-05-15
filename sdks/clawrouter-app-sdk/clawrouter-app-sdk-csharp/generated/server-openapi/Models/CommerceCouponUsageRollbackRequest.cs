using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceCouponUsageRollbackRequest
    {
        public string? Reason { get; set; }
        public string? RequestNo { get; set; }
        public string? UsageNo { get; set; }
    }
}
