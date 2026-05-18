using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceExchangeRuleUpsertRequest
    {
        public string? Rate { get; set; }
        public string? SourceAssetType { get; set; }
        public string? Status { get; set; }
        public string? TargetAssetType { get; set; }
    }
}
