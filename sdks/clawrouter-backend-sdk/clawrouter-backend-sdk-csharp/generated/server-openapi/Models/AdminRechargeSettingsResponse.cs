using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminRechargeSettingsResponse
    {
        public string? BaseCurrencyCode { get; set; }
        public string? BasePointsPerCny { get; set; }
        public Dictionary<string, string>? CurrencyToCnyRates { get; set; }
    }
}
