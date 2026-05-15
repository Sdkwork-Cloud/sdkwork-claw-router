using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePointsHistoryItem
    {
        public int? Amount { get; set; }
        public int? BalanceAfter { get; set; }
        public string? BusinessType { get; set; }
        public string? CreatedAt { get; set; }
        public string? Direction { get; set; }
        public string? Id { get; set; }
    }
}
