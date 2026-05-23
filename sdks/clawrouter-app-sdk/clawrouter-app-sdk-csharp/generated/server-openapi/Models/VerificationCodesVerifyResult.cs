using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class VerificationCodesVerifyResult
    {
        public string? Code { get; set; }
        public IamVerificationCodeVerifyResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
