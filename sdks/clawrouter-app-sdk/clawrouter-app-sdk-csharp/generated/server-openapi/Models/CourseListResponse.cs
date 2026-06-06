using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseListResponse
    {
        public List<CourseItem>? Content { get; set; }
        public List<CourseItem>? Items { get; set; }
        public string? Page { get; set; }
        public string? Size { get; set; }
        public string? TotalElements { get; set; }
    }
}
