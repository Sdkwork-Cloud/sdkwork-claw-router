using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentRunStepItem
    {
        public string? CachedTokens { get; set; }
        public string? CompletedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? InputTokens { get; set; }
        public string? LatencyMs { get; set; }
        public string? Model { get; set; }
        public string? OutputTokens { get; set; }
        public string? RunId { get; set; }
        public string? RuntimeInvocationId { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public string? StepIndex { get; set; }
        public string? StepType { get; set; }
        public string? Title { get; set; }
        public string? ToolName { get; set; }
        public string? TotalTokens { get; set; }
    }
}
