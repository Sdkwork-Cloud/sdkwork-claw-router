using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseSectionItem
    {
        public string? Description { get; set; }
        public int? DurationSeconds { get; set; }
        public string? Id { get; set; }
        public int? LessonCount { get; set; }
        public List<CourseLessonItem>? Lessons { get; set; }
        public int? SectionId { get; set; }
        public int? SectionNo { get; set; }
        public int? SortOrder { get; set; }
        public string? Title { get; set; }
    }
}
