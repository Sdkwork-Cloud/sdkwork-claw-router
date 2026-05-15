using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class BillingRedeemHistoryItem
    {
        public string? Amount { get; set; }
        public string? Code { get; set; }
        public string? Date { get; set; }
        public int? Id { get; set; }
        public string? Status { get; set; }
    }
}
