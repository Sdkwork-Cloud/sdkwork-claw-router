using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ContentCourseRecord
    {
        public string? Category { get; set; }
        public string? Content { get; set; }
        public string? CourseCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? DurationText { get; set; }
        public string? ExternalBvid { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? InstructorSnapshot { get; set; }
        public bool? IsCollection { get; set; }
        public int? LessonsCount { get; set; }
        public string? Level { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PriceAmount { get; set; }
        public string? PublishedAt { get; set; }
        public string? RatingScore { get; set; }
        public string? Status { get; set; }
        public string? StudentsCount { get; set; }
        public Dictionary<string, string>? Tags { get; set; }
        public string? TenantId { get; set; }
        public MediaResource? Thumbnail { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
