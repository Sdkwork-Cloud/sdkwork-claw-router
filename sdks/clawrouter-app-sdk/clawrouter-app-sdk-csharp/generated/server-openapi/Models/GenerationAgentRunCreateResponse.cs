using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class GenerationAgentRunCreateResponse
    {
        public GenerationAgentSnapshot? Agent { get; set; }
        public GenerationHistoryItem? Item { get; set; }
        public List<GenerationAgentMeteringEvent>? MeteringEvents { get; set; }
        public GenerationAgentRunSnapshot? Run { get; set; }
        public string? Status { get; set; }
        public List<GenerationAgentRunStepSnapshot>? Steps { get; set; }
        public string? TargetType { get; set; }
        public GenerationAgentUsageSummary? Usage { get; set; }
    }
}
