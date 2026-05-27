using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminPromptVersionItem
    {
        public string? ChecksumHash { get; set; }
        public string? Content { get; set; }
        public string? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public List<Dictionary<string, string>>? ExamplesJson { get; set; }
        public int? Id { get; set; }
        public string? LifecycleStatus { get; set; }
        public Dictionary<string, string>? ModelConstraints { get; set; }
        public int? OrganizationId { get; set; }
        public Dictionary<string, string>? OutputSchema { get; set; }
        public int? PromptId { get; set; }
        public string? PublishedAt { get; set; }
        public string? ReviewComment { get; set; }
        public string? ReviewStatus { get; set; }
        public Dictionary<string, string>? SafetyPolicy { get; set; }
        public int? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public Dictionary<string, string>? VariableSchema { get; set; }
        public string? VersionNo { get; set; }
    }
}
