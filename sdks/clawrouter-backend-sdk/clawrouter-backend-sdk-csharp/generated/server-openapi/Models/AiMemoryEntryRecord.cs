using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiMemoryEntryRecord
    {
        public string? ConfidenceScore { get; set; }
        public Dictionary<string, string>? ContentJson { get; set; }
        public string? ContentText { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? ExpiresAt { get; set; }
        public string? Id { get; set; }
        public string? ImportanceScore { get; set; }
        public string? LastRecalledAt { get; set; }
        public string? MemoryCode { get; set; }
        public string? MemoryType { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public string? RecallCount { get; set; }
        public string? SensitivityLevel { get; set; }
        public string? SourceConversationId { get; set; }
        public string? SourceInvocationId { get; set; }
        public string? SourceItemId { get; set; }
        public string? SourceKind { get; set; }
        public string? SourceTurnId { get; set; }
        public string? SpaceId { get; set; }
        public string? Status { get; set; }
        public string? SubjectKey { get; set; }
        public string? SubjectType { get; set; }
        public string? SupersedesMemoryId { get; set; }
        public string? TenantId { get; set; }
        public string? TrustLevel { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? ValidFrom { get; set; }
        public string? ValidUntil { get; set; }
        public string? Version { get; set; }
        public string? VersionNo { get; set; }
    }
}
