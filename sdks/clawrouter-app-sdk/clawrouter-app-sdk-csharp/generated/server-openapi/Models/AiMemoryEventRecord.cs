using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiMemoryEventRecord
    {
        public string? ActorId { get; set; }
        public string? ActorType { get; set; }
        public Dictionary<string, string>? AfterJson { get; set; }
        public Dictionary<string, string>? BeforeJson { get; set; }
        public string? ConversationId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DecisionReason { get; set; }
        public string? EventType { get; set; }
        public string? Id { get; set; }
        public string? InvocationId { get; set; }
        public bool? LegalHold { get; set; }
        public string? MemoryId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? SpaceId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? TurnId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
