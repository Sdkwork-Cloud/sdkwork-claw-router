using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PaymentsIntentsListResult
    {
        public string? Code { get; set; }
        public CommercePaymentIntentListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
