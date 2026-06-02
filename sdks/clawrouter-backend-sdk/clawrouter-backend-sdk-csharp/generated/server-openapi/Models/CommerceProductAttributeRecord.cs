using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductAttributeRecord
    {
        public string? AttributeNo { get; set; }
        public string? CreatedAt { get; set; }
        public bool? Filterable { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public bool? Required { get; set; }
        public string? Scope { get; set; }
        public bool? Searchable { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? ValueType { get; set; }
    }
}
