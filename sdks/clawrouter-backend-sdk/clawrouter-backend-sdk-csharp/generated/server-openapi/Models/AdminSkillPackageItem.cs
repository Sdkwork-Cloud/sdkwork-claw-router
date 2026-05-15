using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillPackageItem
    {
        public string? CategoryId { get; set; }
        public string? CoverImage { get; set; }
        public string? CreatedAt { get; set; }
        public string? Description { get; set; }
        public bool? Enabled { get; set; }
        public bool? Featured { get; set; }
        public string? Icon { get; set; }
        public string? Id { get; set; }
        public string? LatestPublishedAt { get; set; }
        public string? Name { get; set; }
        public string? PackageKey { get; set; }
        public int? SortWeight { get; set; }
        public string? Summary { get; set; }
        public List<string>? Tags { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
