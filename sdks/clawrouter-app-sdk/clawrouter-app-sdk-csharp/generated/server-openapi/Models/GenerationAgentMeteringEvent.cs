using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class GenerationAgentMeteringEvent
    {
        public string? Quantity { get; set; }
        public string? Type { get; set; }
        public GenerationAgentUsageFactMetadata? UsageFactMetadata { get; set; }
    }
}
