using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamVerificationPolicyRetrieveResult
    {
        public string? Code { get; set; }
        public AuthVerificationPolicy? Data { get; set; }
        public string? Msg { get; set; }
    }
}
