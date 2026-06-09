using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class MemoryEntryCreateRequest
    {
        public string? ConfidenceScore { get; set; }
        public string Content { get; set; }
        public Dictionary<string, string>? ContentJson { get; set; }
        public string? ImportanceScore { get; set; }
        public string? MemoryType { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? SensitivityLevel { get; set; }
        public string? SourceConversationId { get; set; }
        public string? SourceInvocationId { get; set; }
        public string? SourceItemId { get; set; }
        public string? SourceKind { get; set; }
        public string? SourceTurnId { get; set; }
        public string? Status { get; set; }
        public string? SubjectKey { get; set; }
        public string? SubjectType { get; set; }
        public string? TrustLevel { get; set; }
    }
}
