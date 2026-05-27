using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePaymentAttemptCreateRequest
    {
        public string? ClientRequestNo { get; set; }
        public string? MethodCode { get; set; }
        public string? Note { get; set; }
        public string? ProviderCode { get; set; }
        public string? ReturnUrl { get; set; }
    }
}
