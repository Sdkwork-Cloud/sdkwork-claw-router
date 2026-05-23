using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PaymentsRecordsRetrieveResult
    {
        public string? Code { get; set; }
        public BillingRechargeHistoryItem? Data { get; set; }
        public string? Msg { get; set; }
    }
}
