using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamVerificationCodeVerifyResponse
    {
        public bool? Valid { get; set; }
        public bool Verified { get; set; }
    }
}
