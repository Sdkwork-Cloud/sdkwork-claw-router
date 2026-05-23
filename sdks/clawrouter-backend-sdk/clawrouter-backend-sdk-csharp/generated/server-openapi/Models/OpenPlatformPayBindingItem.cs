using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformPayBindingItem
    {
        public string? AccountId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? Mode { get; set; }
        public string? PaymentAccountId { get; set; }
        public string? PaymentChannelId { get; set; }
        public string? Scene { get; set; }
        public string? Status { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
