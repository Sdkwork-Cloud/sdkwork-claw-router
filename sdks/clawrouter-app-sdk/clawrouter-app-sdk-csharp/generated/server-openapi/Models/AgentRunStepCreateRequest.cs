using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentRunStepCreateRequest
    {
        public Dictionary<string, string>? InputJson { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Model { get; set; }
        public Dictionary<string, string>? OutputJson { get; set; }
        public string? RuntimeInvocationId { get; set; }
        public string? Status { get; set; }
        public string? StepType { get; set; }
        public string? Title { get; set; }
        public string? ToolName { get; set; }
        public UsageSnapshot? UsageJson { get; set; }
    }
}
