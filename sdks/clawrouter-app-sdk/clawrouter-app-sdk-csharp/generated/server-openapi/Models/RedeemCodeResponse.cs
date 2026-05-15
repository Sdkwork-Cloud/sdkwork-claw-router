using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class RedeemCodeResponse
    {
        public string? Amount { get; set; }
        public int? Balance { get; set; }
        public int? CreditedPoints { get; set; }
        public string? Message { get; set; }
    }
}
