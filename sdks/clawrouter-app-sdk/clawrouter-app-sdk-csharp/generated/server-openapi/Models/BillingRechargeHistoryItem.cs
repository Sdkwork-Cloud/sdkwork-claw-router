using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class BillingRechargeHistoryItem
    {
        public string? Amount { get; set; }
        public string? Date { get; set; }
        public string? Id { get; set; }
        public string? Method { get; set; }
        public string? OrderNo { get; set; }
        public string? Status { get; set; }
    }
}
