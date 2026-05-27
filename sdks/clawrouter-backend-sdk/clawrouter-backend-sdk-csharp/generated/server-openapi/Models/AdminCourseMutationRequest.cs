using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseMutationRequest
    {
        public string? Category { get; set; }
        public string? CourseCode { get; set; }
        public string? Description { get; set; }
        public Dictionary<string, string>? InstructorSnapshot { get; set; }
        public string? Level { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Status { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? Title { get; set; }
    }
}
