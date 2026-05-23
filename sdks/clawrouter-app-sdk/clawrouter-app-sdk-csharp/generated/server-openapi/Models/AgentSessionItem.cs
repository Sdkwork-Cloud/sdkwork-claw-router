using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentSessionItem
    {
        public string? AgentId { get; set; }
        public string? AgentVersionId { get; set; }
        public string? ApprovalPolicy { get; set; }
        public string? ChatConversationId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Cwd { get; set; }
        public string? DefaultModel { get; set; }
        public string? Id { get; set; }
        public string? LastActiveAt { get; set; }
        public string? LastRunId { get; set; }
        public int? LastStepId { get; set; }
        public string? MemorySpaceId { get; set; }
        public string? PermissionMode { get; set; }
        public int? RunCount { get; set; }
        public string? Runtime { get; set; }
        public string? SandboxPolicy { get; set; }
        public string? SessionKind { get; set; }
        public string? SourceSurface { get; set; }
        public string? Status { get; set; }
        public int? StepCount { get; set; }
        public string? Title { get; set; }
        public int? ToolCallCount { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
