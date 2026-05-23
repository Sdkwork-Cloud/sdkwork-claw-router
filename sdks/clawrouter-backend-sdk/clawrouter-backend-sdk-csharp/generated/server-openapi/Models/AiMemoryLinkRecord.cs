using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiMemoryLinkRecord
    {
        public string? AgentRunId { get; set; }
        public string? AgentRunStepId { get; set; }
        public string? AgentSessionId { get; set; }
        public string? ChatItemId { get; set; }
        public string? ChatTurnId { get; set; }
        public string? ConversationId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? InjectedTextSnapshot { get; set; }
        public bool? LegalHold { get; set; }
        public string? LinkType { get; set; }
        public string? MemoryId { get; set; }
        public string? MemorySpaceId { get; set; }
        public string? MessageId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? PolicyDecision { get; set; }
        public string? RecallQuery { get; set; }
        public int? RecallRank { get; set; }
        public string? RecallScore { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RuntimeInvocationId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TokenCount { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
