using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class GenerationAgentUsageSummary
    {
        public int? CachedTokens { get; set; }
        public int? CompletionTokens { get; set; }
        public List<GenerationAgentMeteringEvent>? Events { get; set; }
        public int? ImageCount { get; set; }
        public int? PromptTokens { get; set; }
        public int? TotalTokens { get; set; }
        public string? VideoSeconds { get; set; }
    }
}
