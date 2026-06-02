using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductAttributeValueRecord
    {
        public string? AttributeId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DisplayValue { get; set; }
        public string? Id { get; set; }
        public string? OrganizationId { get; set; }
        public string? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? ValueCode { get; set; }
    }
}
