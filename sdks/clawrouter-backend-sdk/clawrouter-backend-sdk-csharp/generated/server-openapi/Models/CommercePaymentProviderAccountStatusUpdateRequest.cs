using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentProviderAccountStatusUpdateRequest
    {
        public string? ClientRequestNo { get; set; }
        public string? Note { get; set; }
        public string? Status { get; set; }
    }
}
