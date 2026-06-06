using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductCategoryAttributeMutationRequest
    {
        public string? AttributeId { get; set; }
        public string? CategoryId { get; set; }
        public bool? Filterable { get; set; }
        public bool? Required { get; set; }
        public bool? Searchable { get; set; }
        public string? SortOrder { get; set; }
        public string? Status { get; set; }
    }
}
