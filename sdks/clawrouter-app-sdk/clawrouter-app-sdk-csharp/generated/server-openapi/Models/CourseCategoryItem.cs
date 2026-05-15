using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseCategoryItem
    {
        public string? Code { get; set; }
        public int? CourseCount { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public string? Id { get; set; }
        public string? Label { get; set; }
        public string? Name { get; set; }
        public int? SortWeight { get; set; }
    }
}
