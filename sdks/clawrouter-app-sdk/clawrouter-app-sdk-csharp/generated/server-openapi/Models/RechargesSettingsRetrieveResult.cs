using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class RechargesSettingsRetrieveResult
    {
        public string? Code { get; set; }
        public CommerceRechargeSettingsResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
