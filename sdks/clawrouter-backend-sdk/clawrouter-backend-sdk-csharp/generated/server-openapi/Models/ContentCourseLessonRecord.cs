using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ContentCourseLessonRecord
    {
        public string? Content { get; set; }
        public string? CourseId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? DurationSeconds { get; set; }
        public string? DurationText { get; set; }
        public string? ExternalBvid { get; set; }
        public bool? FreePreview { get; set; }
        public string? Id { get; set; }
        public int? LessonNo { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? SectionId { get; set; }
        public int? SortOrder { get; set; }
        public string? SourceProvider { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public MediaResource? Video { get; set; }
    }
}
