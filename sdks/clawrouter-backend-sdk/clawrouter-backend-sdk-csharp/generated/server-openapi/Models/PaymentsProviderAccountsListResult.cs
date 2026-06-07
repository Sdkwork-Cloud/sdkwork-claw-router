using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PaymentsProviderAccountsListResult
    {
        public string? Code { get; set; }
        public CommercePaymentProviderAccountListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
