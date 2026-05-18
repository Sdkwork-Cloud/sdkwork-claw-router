using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiAgentRunStepRecord
    {
        public string? AgentId { get; set; }
        public string? AgentVersionId { get; set; }
        public string? AudioSeconds { get; set; }
        public string? CachedTokens { get; set; }
        public string? CompletedAt { get; set; }
        public string? CompletionTokens { get; set; }
        public string? CreatedAt { get; set; }
        public string? ErrorMessageMasked { get; set; }
        public string? Id { get; set; }
        public string? ImageCount { get; set; }
        public Dictionary<string, string>? InputSnapshot { get; set; }
        public int? LatencyMs { get; set; }
        public bool? LegalHold { get; set; }
        public string? McpServerId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Model { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? OutputSnapshot { get; set; }
        public string? PayloadHash { get; set; }
        public string? PromptTokens { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RunId { get; set; }
        public string? SkillId { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public int? StepIndex { get; set; }
        public string? StepStatus { get; set; }
        public string? StepType { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? ToolBindingId { get; set; }
        public string? TotalTokens { get; set; }
        public string? TraceId { get; set; }
        public string? UsageFactId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? VideoSeconds { get; set; }
    }
}
