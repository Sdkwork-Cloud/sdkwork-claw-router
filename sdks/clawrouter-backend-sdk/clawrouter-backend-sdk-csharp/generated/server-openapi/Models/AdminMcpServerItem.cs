using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminMcpServerItem
    {
        public string? CategoryCode { get; set; }
        public string? CategoryId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DeprecatedAt { get; set; }
        public string? Description { get; set; }
        public string? HealthStatus { get; set; }
        public int? Id { get; set; }
        public string? LastCheckedAt { get; set; }
        public string? LastErrorMasked { get; set; }
        public int? LatestRevisionId { get; set; }
        public string? Name { get; set; }
        public int? OrganizationId { get; set; }
        public int? OwnerUserId { get; set; }
        public string? PublishedAt { get; set; }
        public int? PublishedRevisionId { get; set; }
        public string? ServerKey { get; set; }
        public string? Status { get; set; }
        public List<string>? Tags { get; set; }
        public int? TenantId { get; set; }
        public string? Transport { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Visibility { get; set; }
    }
}
