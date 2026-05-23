using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiRuntimeInvocationEventRecord
    {
        public string? AgentRunId { get; set; }
        public string? AgentRunStepId { get; set; }
        public string? AgentSessionId { get; set; }
        public string? ChatTurnId { get; set; }
        public string? ConversationId { get; set; }
        public string? CreatedAt { get; set; }
        public string? EventNo { get; set; }
        public string? EventSource { get; set; }
        public string? EventType { get; set; }
        public string? Id { get; set; }
        public string? InvocationId { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public Dictionary<string, string>? PayloadJson { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TextDelta { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
