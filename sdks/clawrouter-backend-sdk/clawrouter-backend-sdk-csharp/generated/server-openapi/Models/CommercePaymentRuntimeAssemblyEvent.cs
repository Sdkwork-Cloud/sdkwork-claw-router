using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentRuntimeAssemblyEvent
    {
        public string? AccountNo { get; set; }
        public string? Kind { get; set; }
        public string? Message { get; set; }
        public string? ProviderCode { get; set; }
        public string? Reason { get; set; }
    }
}
