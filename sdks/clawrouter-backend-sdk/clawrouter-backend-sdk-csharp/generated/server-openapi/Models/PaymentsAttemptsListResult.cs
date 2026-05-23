using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PaymentsAttemptsListResult
    {
        public string? Code { get; set; }
        public CommercePaymentAttemptListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
