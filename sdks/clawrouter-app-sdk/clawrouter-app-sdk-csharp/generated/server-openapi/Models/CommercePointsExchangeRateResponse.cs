using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePointsExchangeRateResponse
    {
        public string? Rate { get; set; }
        public string? SourceAssetType { get; set; }
        public string? TargetAssetType { get; set; }
    }
}
