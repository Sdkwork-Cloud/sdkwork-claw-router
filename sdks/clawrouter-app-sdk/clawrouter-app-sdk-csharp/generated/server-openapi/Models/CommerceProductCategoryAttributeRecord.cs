using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceProductCategoryAttributeRecord
    {
        public string? AttributeId { get; set; }
        public string? CategoryId { get; set; }
        public string? CreatedAt { get; set; }
        public bool? Filterable { get; set; }
        public string? Id { get; set; }
        public string? OrganizationId { get; set; }
        public bool? Required { get; set; }
        public bool? Searchable { get; set; }
        public string? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
