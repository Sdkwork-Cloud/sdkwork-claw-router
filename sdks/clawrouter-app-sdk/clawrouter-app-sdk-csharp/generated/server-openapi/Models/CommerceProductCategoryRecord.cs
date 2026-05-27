using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceProductCategoryRecord
    {
        public string? CategoryNo { get; set; }
        public string? CreatedAt { get; set; }
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
        public int? LevelNo { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? ParentId { get; set; }
        public string? Path { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
