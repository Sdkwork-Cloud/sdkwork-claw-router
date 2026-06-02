using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceRechargeSettingsResponse
    {
        public string? BaseCurrencyCode { get; set; }
        public string? BasePointsPerCny { get; set; }
        public Dictionary<string, string>? CurrencyToCnyRates { get; set; }
        public Dictionary<string, Dictionary<string, Dictionary<string, object>>>? PreviewExamples { get; set; }
    }
}
