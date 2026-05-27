using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminPromptBindingItem
    {
        public string? BindingRole { get; set; }
        public string? CreatedAt { get; set; }
        public bool? Enabled { get; set; }
        public int? Id { get; set; }
        public int? OrganizationId { get; set; }
        public int? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public Dictionary<string, string>? PolicyJson { get; set; }
        public int? Priority { get; set; }
        public int? PromptId { get; set; }
        public int? PromptVersionId { get; set; }
        public Dictionary<string, string>? SnapshotJson { get; set; }
        public int? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
    }
}
