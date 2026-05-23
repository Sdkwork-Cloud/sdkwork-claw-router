using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AccountPointsRechargesCreateResult
    {
        public string? Code { get; set; }
        public SubmitRechargeResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
