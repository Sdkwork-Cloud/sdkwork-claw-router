using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseSectionItem
    {
        public string Description { get; set; }
        public string DurationSeconds { get; set; }
        public string Id { get; set; }
        public string LessonCount { get; set; }
        public List<CourseLessonItem> Lessons { get; set; }
        public string SectionId { get; set; }
        public string SectionNo { get; set; }
        public string SortOrder { get; set; }
        public string Title { get; set; }
    }
}
