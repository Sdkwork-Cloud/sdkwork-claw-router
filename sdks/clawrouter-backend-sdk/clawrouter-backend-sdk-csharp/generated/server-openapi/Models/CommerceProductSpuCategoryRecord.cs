using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductSpuCategoryRecord
    {
        public string? CategoryId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? OrganizationId { get; set; }
        public bool? PrimaryFlag { get; set; }
        public string? SortOrder { get; set; }
        public string? SpuId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
