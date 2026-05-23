using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductAttributeItem
    {
        public string? AttributeNo { get; set; }
        public bool? Filterable { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public bool? Required { get; set; }
        public string? Scope { get; set; }
        public bool? Searchable { get; set; }
        public string? Status { get; set; }
        public string? ValueType { get; set; }
    }
}
