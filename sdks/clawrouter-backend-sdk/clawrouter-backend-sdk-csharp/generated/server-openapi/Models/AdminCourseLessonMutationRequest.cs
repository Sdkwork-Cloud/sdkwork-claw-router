using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseLessonMutationRequest
    {
        public string? Description { get; set; }
        public int? DurationSeconds { get; set; }
        public string? ExternalBvid { get; set; }
        public bool? FreePreview { get; set; }
        public string? LessonNo { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? SectionId { get; set; }
        public string? Status { get; set; }
        public string? Title { get; set; }
        public MediaResource? Video { get; set; }
    }
}
