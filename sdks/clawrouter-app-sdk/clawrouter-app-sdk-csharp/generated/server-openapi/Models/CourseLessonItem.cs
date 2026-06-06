using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseLessonItem
    {
        public string? Content { get; set; }
        public string? Description { get; set; }
        public string? DurationSeconds { get; set; }
        public string? DurationText { get; set; }
        public string? ExternalBvid { get; set; }
        public bool? FreePreview { get; set; }
        public string? Id { get; set; }
        public string? LessonId { get; set; }
        public string? LessonNo { get; set; }
        public string? Number { get; set; }
        public string? SortOrder { get; set; }
        public string? SourceProvider { get; set; }
        public string? Title { get; set; }
        public MediaResource? Video { get; set; }
    }
}
