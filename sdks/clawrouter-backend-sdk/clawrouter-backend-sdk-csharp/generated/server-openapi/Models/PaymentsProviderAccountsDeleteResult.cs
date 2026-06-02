using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PaymentsProviderAccountsDeleteResult
    {
        public string? Code { get; set; }
        public CommercePaymentProviderAccountDeleteResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
