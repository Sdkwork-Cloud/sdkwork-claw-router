using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseListResponse
    {
        public List<CourseItem>? Content { get; set; }
        public List<CourseItem>? Items { get; set; }
        public int? Page { get; set; }
        public int? Size { get; set; }
        public int? TotalElements { get; set; }
    }
}
