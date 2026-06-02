using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillPackageUpdateRequest
    {
        public string? CategoryId { get; set; }
        public MediaResource? Cover { get; set; }
        public string? Description { get; set; }
        public bool? Enabled { get; set; }
        public bool? Featured { get; set; }
        public MediaResource? Icon { get; set; }
        public string? Name { get; set; }
        public string? PackageKey { get; set; }
        public int? SortWeight { get; set; }
        public string? Summary { get; set; }
        public List<string>? Tags { get; set; }
    }
}
