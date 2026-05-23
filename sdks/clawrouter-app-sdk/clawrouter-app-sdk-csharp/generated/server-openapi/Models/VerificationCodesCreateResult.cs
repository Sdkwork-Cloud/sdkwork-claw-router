using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class VerificationCodesCreateResult
    {
        public string? Code { get; set; }
        public IamVerificationCodeResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
