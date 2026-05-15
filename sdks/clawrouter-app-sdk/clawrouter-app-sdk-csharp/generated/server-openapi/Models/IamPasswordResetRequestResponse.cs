using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamPasswordResetRequestResponse
    {
        public string? DebugCode { get; set; }
        public string? ExpiresAt { get; set; }
        public string? RequestId { get; set; }
    }
}
