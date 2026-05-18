using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiAgentToolBindingRecord
    {
        public string? AgentId { get; set; }
        public string? AgentVersionId { get; set; }
        public string? BindingKey { get; set; }
        public string? BindingType { get; set; }
        public string? CreatedAt { get; set; }
        public string? CredentialRef { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public bool? Enabled { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public string? LastCheckedAt { get; set; }
        public string? McpServerId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? PermissionPolicy { get; set; }
        public Dictionary<string, string>? RuntimeConfig { get; set; }
        public string? SkillId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? ToolName { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
