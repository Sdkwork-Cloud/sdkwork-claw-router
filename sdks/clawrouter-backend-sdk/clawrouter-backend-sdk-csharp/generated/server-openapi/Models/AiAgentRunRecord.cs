using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiAgentRunRecord
    {
        public string? AgentId { get; set; }
        public string? AgentVersionId { get; set; }
        public string? AudioSeconds { get; set; }
        public string? CachedTokens { get; set; }
        public string? CancelledAt { get; set; }
        public string? CompletedAt { get; set; }
        public string? CompletionTokens { get; set; }
        public string? CreatedAt { get; set; }
        public string? ErrorMessageMasked { get; set; }
        public string? ExecutionMode { get; set; }
        public string? FailedAt { get; set; }
        public string? Id { get; set; }
        public string? ImageCount { get; set; }
        public string? InputMessage { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MeteringStatus { get; set; }
        public string? OrganizationId { get; set; }
        public string? OutputMessage { get; set; }
        public string? PayloadHash { get; set; }
        public string? PlannerModel { get; set; }
        public string? PromptTokens { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RunStatus { get; set; }
        public string? RunUuid { get; set; }
        public string? SourceSurface { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public string? TargetModality { get; set; }
        public string? TenantId { get; set; }
        public int? TotalSteps { get; set; }
        public string? TotalTokens { get; set; }
        public string? TraceId { get; set; }
        public string? UsageFactId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? VideoSeconds { get; set; }
    }
}
