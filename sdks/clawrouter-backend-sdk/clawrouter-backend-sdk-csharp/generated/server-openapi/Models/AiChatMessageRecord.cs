using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiChatMessageRecord
    {
        public Dictionary<string, string>? ContentJson { get; set; }
        public string? ContentText { get; set; }
        public string? ConversationId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Direction { get; set; }
        public string? FinishReason { get; set; }
        public string? Id { get; set; }
        public string? ItemId { get; set; }
        public bool? LegalHold { get; set; }
        public string? MessageKind { get; set; }
        public string? MessageNo { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Model { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? Provider { get; set; }
        public Dictionary<string, string>? RawProviderJson { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? Role { get; set; }
        public string? Runtime { get; set; }
        public string? RuntimeInvocationId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TokenCount { get; set; }
        public string? TraceId { get; set; }
        public string? TurnId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UsageLinkId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
