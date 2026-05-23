using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiChatConversationRecord
    {
        public string? AgentId { get; set; }
        public string? AgentSessionId { get; set; }
        public string? CachedTokenTotal { get; set; }
        public string? ConversationCode { get; set; }
        public string? CostAmountTotal { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultEndpoint { get; set; }
        public string? DefaultModel { get; set; }
        public string? DefaultProvider { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public string? InputTokenTotal { get; set; }
        public string? ItemCount { get; set; }
        public string? LastItemId { get; set; }
        public string? LastMessagePreview { get; set; }
        public string? LastTurnId { get; set; }
        public string? MemorySpaceId { get; set; }
        public string? MessageCount { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OutputTokenTotal { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public string? ReasoningTokenTotal { get; set; }
        public string? SourceSurface { get; set; }
        public string? Status { get; set; }
        public string? Summary { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? TurnCount { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? Visibility { get; set; }
    }
}
