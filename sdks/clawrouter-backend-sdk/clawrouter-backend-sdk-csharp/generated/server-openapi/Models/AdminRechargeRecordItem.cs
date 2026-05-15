using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminRechargeRecordItem
    {
        public string? Amount { get; set; }
        public string? Id { get; set; }
        public string? Method { get; set; }
        public string? Status { get; set; }
        public string? Time { get; set; }
        public string? TradeNo { get; set; }
        public string? UsdCredited { get; set; }
        public string? User { get; set; }
        public string? UserId { get; set; }
    }
}
