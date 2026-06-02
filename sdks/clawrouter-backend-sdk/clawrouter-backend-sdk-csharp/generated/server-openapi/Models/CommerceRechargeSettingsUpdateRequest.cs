using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceRechargeSettingsUpdateRequest
    {
        public string? BaseCurrencyCode { get; set; }
        public string? BasePointsPerCny { get; set; }
        public Dictionary<string, string>? CurrencyToCnyRates { get; set; }
    }
}
