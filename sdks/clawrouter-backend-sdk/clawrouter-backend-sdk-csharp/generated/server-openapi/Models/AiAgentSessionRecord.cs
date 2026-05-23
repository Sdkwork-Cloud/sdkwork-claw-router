using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiAgentSessionRecord
    {
        public string? AgentId { get; set; }
        public string? AgentVersionId { get; set; }
        public string? ApprovalPolicy { get; set; }
        public string? ChatConversationId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Cwd { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultModel { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? ExecutionMode { get; set; }
        public string? ForkedFromRunId { get; set; }
        public string? ForkedFromStepId { get; set; }
        public string? GitBranch { get; set; }
        public string? GitCommit { get; set; }
        public string? Id { get; set; }
        public string? LastActiveAt { get; set; }
        public string? LastRunId { get; set; }
        public string? LastStepId { get; set; }
        public string? MemorySpaceId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public string? ParentSessionId { get; set; }
        public string? PermissionMode { get; set; }
        public string? ProviderConversationId { get; set; }
        public string? ProviderSessionId { get; set; }
        public string? RepositoryId { get; set; }
        public string? ResumeStrategy { get; set; }
        public string? RunCount { get; set; }
        public string? Runtime { get; set; }
        public string? RuntimeStateStorageKey { get; set; }
        public string? SandboxPolicy { get; set; }
        public string? SessionCode { get; set; }
        public string? SessionKind { get; set; }
        public string? SourceSurface { get; set; }
        public string? Status { get; set; }
        public string? StepCount { get; set; }
        public string? Summary { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? ToolCallCount { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? Visibility { get; set; }
        public string? WorkspaceId { get; set; }
    }
}
