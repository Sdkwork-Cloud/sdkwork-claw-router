using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillCategoryItem
    {
        public string? Code { get; set; }
        public string? Description { get; set; }
        public MediaResource? Icon { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? ParentId { get; set; }
        public string? Path { get; set; }
        public int? SortWeight { get; set; }
        public int? Status { get; set; }
        public int? Type { get; set; }
        public bool? Visible { get; set; }
    }
}
