using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminUserBalanceAdjustmentRequest
    {
        public double? Amount { get; set; }
        public string? Type { get; set; }
    }
}
