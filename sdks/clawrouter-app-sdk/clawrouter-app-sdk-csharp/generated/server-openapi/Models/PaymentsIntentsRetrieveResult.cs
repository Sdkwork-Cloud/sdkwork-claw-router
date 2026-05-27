using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PaymentsIntentsRetrieveResult
    {
        public string? Code { get; set; }
        public CommercePaymentIntentResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
