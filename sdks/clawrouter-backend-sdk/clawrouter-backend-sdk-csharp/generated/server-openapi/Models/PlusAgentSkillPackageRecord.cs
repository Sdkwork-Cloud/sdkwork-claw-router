using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PlusAgentSkillPackageRecord
    {
        public string? CategoryId { get; set; }
        public MediaResource? Cover { get; set; }
        public string? CreatedAt { get; set; }
        public int? DataScope { get; set; }
        public string? Description { get; set; }
        public bool? Enabled { get; set; }
        public bool? Featured { get; set; }
        public MediaResource? Icon { get; set; }
        public string? Id { get; set; }
        public string? LatestPublishedAt { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? PackageKey { get; set; }
        public int? SortWeight { get; set; }
        public string? Summary { get; set; }
        public Dictionary<string, string>? Tags { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? V { get; set; }
    }
}
