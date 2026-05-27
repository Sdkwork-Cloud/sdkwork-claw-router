using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PaymentsMethodsListResult
    {
        public string? Code { get; set; }
        public CommercePaymentMethodListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
