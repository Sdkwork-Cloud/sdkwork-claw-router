using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseEngagementItem
    {
        public int? Count { get; set; }
        public string? CourseId { get; set; }
        public string? Id { get; set; }
        public string? ReactionType { get; set; }
        public string? ReactionValue { get; set; }
        public string? Status { get; set; }
    }
}
