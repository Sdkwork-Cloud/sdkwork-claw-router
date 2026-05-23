using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiRuntimeArtifactRecord
    {
        public string? AgentRunId { get; set; }
        public string? AgentRunStepId { get; set; }
        public string? AgentSessionId { get; set; }
        public string? ArtifactType { get; set; }
        public string? ChatItemId { get; set; }
        public string? ChatTurnId { get; set; }
        public Dictionary<string, string>? ContentJson { get; set; }
        public string? ContentText { get; set; }
        public string? ConversationId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public string? MessageId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MimeType { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RuntimeInvocationId { get; set; }
        public string? Sha256 { get; set; }
        public string? SizeBytes { get; set; }
        public string? Status { get; set; }
        public string? StorageKey { get; set; }
        public string? StorageUrl { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
