using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PaymentsProvidersListResult
    {
        public string? Code { get; set; }
        public CommercePaymentProviderListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
