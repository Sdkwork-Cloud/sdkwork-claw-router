using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class UsageSnapshot
    {
        public int? CachedTokens { get; set; }
        public int? InputTokens { get; set; }
        public int? OutputTokens { get; set; }
        public int? TotalTokens { get; set; }
    }
}
