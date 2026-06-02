using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PaymentsProviderAccountsStatusUpdateResult
    {
        public string? Code { get; set; }
        public CommercePaymentProviderAccountMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
