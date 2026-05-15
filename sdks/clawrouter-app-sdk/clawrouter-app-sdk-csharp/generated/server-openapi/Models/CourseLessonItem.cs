using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseLessonItem
    {
        public string? Content { get; set; }
        public string? Description { get; set; }
        public int? DurationSeconds { get; set; }
        public string? DurationText { get; set; }
        public string? ExternalBvid { get; set; }
        public bool? FreePreview { get; set; }
        public string? Id { get; set; }
        public int? LessonId { get; set; }
        public int? LessonNo { get; set; }
        public int? Number { get; set; }
        public int? SortOrder { get; set; }
        public string? SourceProvider { get; set; }
        public string? Title { get; set; }
        public string? VideoUrl { get; set; }
    }
}
