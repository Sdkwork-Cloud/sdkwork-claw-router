using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiChatTurnRecord
    {
        public string? AgentId { get; set; }
        public string? AgentSessionId { get; set; }
        public string? BranchId { get; set; }
        public string? CachedTokenTotal { get; set; }
        public string? CompletedAt { get; set; }
        public string? ContextSnapshotId { get; set; }
        public string? ConversationId { get; set; }
        public string? CostAmount { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? Endpoint { get; set; }
        public string? FinalOutputItemId { get; set; }
        public string? Id { get; set; }
        public string? InputItemId { get; set; }
        public string? InputTokenTotal { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Model { get; set; }
        public string? OrganizationId { get; set; }
        public string? OutputTokenTotal { get; set; }
        public string? ParentTurnId { get; set; }
        public string? PayloadHash { get; set; }
        public string? Provider { get; set; }
        public string? ReasoningTokenTotal { get; set; }
        public string? RequestId { get; set; }
        public Dictionary<string, string>? RequestSnapshot { get; set; }
        public Dictionary<string, string>? ResponseSnapshot { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RuntimeInvocationId { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public bool? Streaming { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? TurnNo { get; set; }
        public string? UpdatedAt { get; set; }
        public Dictionary<string, string>? UsageSnapshot { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
