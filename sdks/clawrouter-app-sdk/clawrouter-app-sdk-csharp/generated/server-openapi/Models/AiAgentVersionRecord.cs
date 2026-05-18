using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiAgentVersionRecord
    {
        public string? AgentId { get; set; }
        public string? ConfigHash { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? McpPolicy { get; set; }
        public Dictionary<string, string>? MemoryPolicy { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public Dictionary<string, string>? ModelPolicy { get; set; }
        public string? OrganizationId { get; set; }
        public string? PublishedAt { get; set; }
        public string? PublishedBy { get; set; }
        public string? ReleaseStatus { get; set; }
        public Dictionary<string, string>? RuntimePolicy { get; set; }
        public Dictionary<string, string>? SkillPolicy { get; set; }
        public string? Status { get; set; }
        public string? SystemPrompt { get; set; }
        public string? TenantId { get; set; }
        public Dictionary<string, string>? ToolPolicy { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? VersionNo { get; set; }
    }
}
