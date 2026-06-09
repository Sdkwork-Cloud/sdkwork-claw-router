using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamVerificationCodeVerifyRequest
    {
        public string Code { get; set; }
        public string? CodeId { get; set; }
        public string Scene { get; set; }
        public string Target { get; set; }
        public string VerifyType { get; set; }
    }
}
