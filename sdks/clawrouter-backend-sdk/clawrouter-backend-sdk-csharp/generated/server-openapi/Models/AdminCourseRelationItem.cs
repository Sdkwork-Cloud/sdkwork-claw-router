using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseRelationItem
    {
        public string? CourseId { get; set; }
        public string? Id { get; set; }
        public string? RelatedCourseId { get; set; }
        public string? RelationType { get; set; }
        public string? SortOrder { get; set; }
        public string? Status { get; set; }
    }
}
