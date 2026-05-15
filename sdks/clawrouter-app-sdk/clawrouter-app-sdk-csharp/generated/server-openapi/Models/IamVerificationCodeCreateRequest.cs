using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamVerificationCodeCreateRequest
    {
        public string? Scene { get; set; }
        public string? Target { get; set; }
        public string? VerifyType { get; set; }
    }
}
