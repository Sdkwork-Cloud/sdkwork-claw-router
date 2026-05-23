using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductCategoryItem
    {
        public string? CategoryNo { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public int? LevelNo { get; set; }
        public string? Name { get; set; }
        public string? ParentId { get; set; }
        public string? Path { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
