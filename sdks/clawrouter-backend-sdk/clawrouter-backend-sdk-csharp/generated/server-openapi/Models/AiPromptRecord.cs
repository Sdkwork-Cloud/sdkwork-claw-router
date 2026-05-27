using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiPromptRecord
    {
        public string? CategoryCode { get; set; }
        public string? CategoryId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DeprecatedAt { get; set; }
        public string? Description { get; set; }
        public string? Id { get; set; }
        public string? LatestVersionId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? PromptKey { get; set; }
        public string? PromptType { get; set; }
        public string? PublishedAt { get; set; }
        public string? PublishedVersionId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? Visibility { get; set; }
    }
}
