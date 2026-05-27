using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseSectionMutationRequest
    {
        public string? Description { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? SectionNo { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? Title { get; set; }
    }
}
