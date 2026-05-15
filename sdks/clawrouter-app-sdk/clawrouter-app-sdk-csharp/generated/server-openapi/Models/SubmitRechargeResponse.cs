using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SubmitRechargeResponse
    {
        public string? Amount { get; set; }
        public string? OrderNo { get; set; }
        public string? PaymentMethod { get; set; }
        public int? Points { get; set; }
        public string? Status { get; set; }
        public bool? Success { get; set; }
    }
}
