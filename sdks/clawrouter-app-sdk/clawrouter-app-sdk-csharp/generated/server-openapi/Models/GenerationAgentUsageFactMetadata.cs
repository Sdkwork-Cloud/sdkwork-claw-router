using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class GenerationAgentUsageFactMetadata
    {
        public string? AgentId { get; set; }
        public string? AgentVersionId { get; set; }
        public string? McpServerId { get; set; }
        public string? MeteringSource { get; set; }
        public string? RunId { get; set; }
        public string? SkillId { get; set; }
        public string? StepId { get; set; }
        public string? ToolId { get; set; }
    }
}
