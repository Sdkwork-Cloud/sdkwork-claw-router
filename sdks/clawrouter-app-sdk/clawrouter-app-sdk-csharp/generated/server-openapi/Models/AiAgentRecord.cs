using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiAgentRecord
    {
        public string? AgentCode { get; set; }
        public string? AvatarUrl { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultVersionId { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? GovernanceStatus { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? PublishedAt { get; set; }
        public string? PublishedBy { get; set; }
        public string? Status { get; set; }
        public string? TemplateSource { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? Visibility { get; set; }
    }
}
