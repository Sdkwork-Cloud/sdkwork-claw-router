using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamVerificationCodeResponse
    {
        public string? CodeId { get; set; }
        public string? DeliveryRequestId { get; set; }
        public string? ExpiresAt { get; set; }
    }
}
