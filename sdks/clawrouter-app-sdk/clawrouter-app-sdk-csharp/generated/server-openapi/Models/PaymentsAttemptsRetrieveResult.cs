using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PaymentsAttemptsRetrieveResult
    {
        public string? Code { get; set; }
        public CommercePaymentAttemptResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
