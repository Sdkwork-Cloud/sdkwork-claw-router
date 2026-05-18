using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiAgentMcpServerRecord
    {
        public Dictionary<string, string>? ConnectionConfig { get; set; }
        public string? CreatedAt { get; set; }
        public string? CredentialRef { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public string? LastCheckedAt { get; set; }
        public string? LastErrorMasked { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? PermissionPolicy { get; set; }
        public Dictionary<string, string>? PromptCatalog { get; set; }
        public Dictionary<string, string>? ResourceCatalog { get; set; }
        public string? ServerCode { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public Dictionary<string, string>? ToolCatalog { get; set; }
        public string? TransportType { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
