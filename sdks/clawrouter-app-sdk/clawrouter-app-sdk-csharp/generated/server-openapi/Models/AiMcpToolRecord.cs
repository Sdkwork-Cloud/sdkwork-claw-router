using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiMcpToolRecord
    {
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? DiscoveredAt { get; set; }
        public string? Id { get; set; }
        public string? LastInvokedAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? SchemaHash { get; set; }
        public string? ServerId { get; set; }
        public string? ServerRevisionId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? ToolKey { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
