using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductCategoryAttributeItem
    {
        public string? AttributeId { get; set; }
        public string? AttributeName { get; set; }
        public string? AttributeNo { get; set; }
        public string? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? CategoryPath { get; set; }
        public string? CreatedAt { get; set; }
        public bool? Filterable { get; set; }
        public string? Id { get; set; }
        public bool? Required { get; set; }
        public string? Scope { get; set; }
        public bool? Searchable { get; set; }
        public string? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? UpdatedAt { get; set; }
        public string? ValueType { get; set; }
    }
}
