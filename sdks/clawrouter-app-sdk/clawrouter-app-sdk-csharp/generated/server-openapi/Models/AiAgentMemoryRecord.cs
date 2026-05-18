using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiAgentMemoryRecord
    {
        public string? AgentId { get; set; }
        public string? ContentRef { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EmbeddingRef { get; set; }
        public string? ExpiresAt { get; set; }
        public string? Id { get; set; }
        public string? LastUsedAt { get; set; }
        public string? MemoryHash { get; set; }
        public string? MemoryScope { get; set; }
        public string? MemoryType { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public string? OwnerUserId { get; set; }
        public Dictionary<string, string>? RetentionPolicy { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
