using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AccountPointsRechargesRecordsListResult
    {
        public string? Code { get; set; }
        public List<BillingRechargeHistoryItem>? Data { get; set; }
        public string? Msg { get; set; }
    }
}
