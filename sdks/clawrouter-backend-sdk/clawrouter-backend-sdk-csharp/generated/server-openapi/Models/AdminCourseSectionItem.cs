using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseSectionItem
    {
        public string? CourseId { get; set; }
        public string? Id { get; set; }
        public string? Status { get; set; }
        public string? Title { get; set; }
    }
}
