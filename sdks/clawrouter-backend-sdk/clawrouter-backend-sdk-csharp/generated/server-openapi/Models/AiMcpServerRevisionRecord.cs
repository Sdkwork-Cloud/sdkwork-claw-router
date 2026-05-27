using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiMcpServerRevisionRecord
    {
        public string? Command { get; set; }
        public string? ConfigHash { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DeprecatedAt { get; set; }
        public string? EndpointUrl { get; set; }
        public string? Id { get; set; }
        public string? LifecycleStatus { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PublishedAt { get; set; }
        public string? RevisionNo { get; set; }
        public string? SecretRef { get; set; }
        public string? ServerId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? Transport { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
