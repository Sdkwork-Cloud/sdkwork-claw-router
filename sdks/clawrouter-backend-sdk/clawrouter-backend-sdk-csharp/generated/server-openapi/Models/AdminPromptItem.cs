using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminPromptItem
    {
        public string? CategoryCode { get; set; }
        public string? CategoryId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Description { get; set; }
        public int? Id { get; set; }
        public int? LatestVersionId { get; set; }
        public string? Name { get; set; }
        public int? OrganizationId { get; set; }
        public int? OwnerUserId { get; set; }
        public string? PromptKey { get; set; }
        public string? PromptType { get; set; }
        public int? PublishedVersionId { get; set; }
        public string? Status { get; set; }
        public List<string>? Tags { get; set; }
        public int? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Visibility { get; set; }
    }
}
