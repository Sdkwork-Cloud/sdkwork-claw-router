using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformPayBindingCreateRequest
    {
        public string? Mode { get; set; }
        public string? PaymentAccountId { get; set; }
        public string? PaymentChannelId { get; set; }
        public string? Scene { get; set; }
    }
}
