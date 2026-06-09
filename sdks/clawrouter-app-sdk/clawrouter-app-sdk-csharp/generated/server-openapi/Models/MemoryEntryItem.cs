using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class MemoryEntryItem
    {
        public string? ConfidenceScore { get; set; }
        public string Content { get; set; }
        public string CreatedAt { get; set; }
        public string Id { get; set; }
        public string? ImportanceScore { get; set; }
        public string MemoryType { get; set; }
        public string RecallCount { get; set; }
        public string SensitivityLevel { get; set; }
        public string? SourceConversationId { get; set; }
        public string? SourceInvocationId { get; set; }
        public string? SourceItemId { get; set; }
        public string SourceKind { get; set; }
        public string? SourceTurnId { get; set; }
        public string SpaceId { get; set; }
        public string Status { get; set; }
        public string? SubjectKey { get; set; }
        public string? SubjectType { get; set; }
        public string TrustLevel { get; set; }
        public string UpdatedAt { get; set; }
    }
}
