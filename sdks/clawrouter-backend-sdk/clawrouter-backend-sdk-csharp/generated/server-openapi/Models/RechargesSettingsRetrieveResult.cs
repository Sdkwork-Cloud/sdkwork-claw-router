using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class RechargesSettingsRetrieveResult
    {
        public string? Code { get; set; }
        public AdminRechargeSettingsResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
