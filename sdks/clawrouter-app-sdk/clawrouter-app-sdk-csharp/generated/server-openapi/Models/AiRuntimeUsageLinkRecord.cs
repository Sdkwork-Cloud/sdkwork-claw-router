using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiRuntimeUsageLinkRecord
    {
        public string? AgentRunId { get; set; }
        public string? AgentRunStepId { get; set; }
        public string? AgentSessionId { get; set; }
        public string? CachedTokens { get; set; }
        public string? ChatItemId { get; set; }
        public string? ChatTurnId { get; set; }
        public string? ConversationId { get; set; }
        public string? CostAmount { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? Id { get; set; }
        public string? InputTokens { get; set; }
        public bool? LegalHold { get; set; }
        public string? MessageId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Model { get; set; }
        public string? OccurredAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? OutputTokens { get; set; }
        public string? PayloadHash { get; set; }
        public string? Provider { get; set; }
        public string? ReasoningTokens { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RuntimeInvocationId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TotalTokens { get; set; }
        public string? TraceId { get; set; }
        public string? UsageFactId { get; set; }
        public string? UsageType { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
