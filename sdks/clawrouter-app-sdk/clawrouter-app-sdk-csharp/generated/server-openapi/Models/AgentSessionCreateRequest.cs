using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentSessionCreateRequest
    {
        public string? AgentVersionId { get; set; }
        public string? ApprovalPolicy { get; set; }
        public string? ChatConversationId { get; set; }
        public string? Cwd { get; set; }
        public string? DefaultModel { get; set; }
        public string? MemorySpaceId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? PermissionMode { get; set; }
        public string? Runtime { get; set; }
        public string? SandboxPolicy { get; set; }
        public string? SessionKind { get; set; }
        public string? SourceSurface { get; set; }
        public string? Title { get; set; }
    }
}
