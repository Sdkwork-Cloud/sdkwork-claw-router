using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminRedemptionRecordItem
    {
        public string? Amount { get; set; }
        public string? Code { get; set; }
        public string? Id { get; set; }
        public string? Time { get; set; }
        public string? User { get; set; }
        public string? UserId { get; set; }
    }
}
