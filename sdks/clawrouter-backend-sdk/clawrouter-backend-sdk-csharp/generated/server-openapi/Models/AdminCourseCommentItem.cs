using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseCommentItem
    {
        public string? Author { get; set; }
        public string? Content { get; set; }
        public string? CourseId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? Status { get; set; }
    }
}
