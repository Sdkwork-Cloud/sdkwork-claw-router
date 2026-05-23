using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiChatContextSnapshotRecord
    {
        public Dictionary<string, string>? ContextJson { get; set; }
        public string? ConversationId { get; set; }
        public string? CreatedAt { get; set; }
        public Dictionary<string, string>? ExcludedItemIds { get; set; }
        public Dictionary<string, string>? ExcludedMemoryIds { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? IncludedItemIds { get; set; }
        public Dictionary<string, string>? IncludedMemoryIds { get; set; }
        public string? InputTokenEstimate { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? MemoryPack { get; set; }
        public string? MemoryTokenCount { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? PreviousResponseId { get; set; }
        public string? ProviderConversationId { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RuntimeInvocationId { get; set; }
        public int? SnapshotNo { get; set; }
        public string? Status { get; set; }
        public string? Strategy { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? TruncationReason { get; set; }
        public string? TurnId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
